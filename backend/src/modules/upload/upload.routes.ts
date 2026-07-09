/**
 * @file upload.routes.ts
 * @description 文件上传模块路由，定义图片上传相关 HTTP 接口：单图上传、批量上传，使用 multer 磁盘存储
 */
import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import path from 'node:path';
import { generateId, success } from '@utils/index.js';

/** Express 路由实例 */
const router: Router = Router();

/** multer 磁盘存储策略：文件落地到工程根目录 uploads/，文件名使用生成 ID 拼接原扩展名 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // 上传目录为项目根目录下的 uploads 文件夹
    cb(null, path.resolve(process.cwd(), 'uploads'));
  },
  filename: (_req, file, cb) => {
    // 保留原文件扩展名，主体名使用工具生成的唯一 ID，避免重名
    const ext = path.extname(file.originalname);
    cb(null, `${generateId()}${ext}`);
  },
});

/** multer 上传中间件：限制单文件大小 5MB（5 * 1024 * 1024 字节），仅允许 JPG/JPEG/PNG/GIF/WebP */
const upload = multer({
  storage,
  // 单文件大小上限 5MB
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    // 允许的图片扩展名白名单
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 JPG、PNG、GIF、WebP 格式'));
    }
  },
});

/**
 * POST /api/upload/image
 * @description 单图上传，字段名为 file，保存到 uploads 目录并返回访问 URL 与文件名
 * @param {Request} req Express 请求对象，需通过 multer.single('file') 处理单文件
 * @param params.file 待上传的图片文件，字段名必须为 file
 * @param {Response} res Express 响应对象
 * @returns {void} 返回 201 携带 { url, filename }；未提供文件时返回 400
 */
router.post('/image', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: '请选择要上传的文件', statusCode: 400, error: 'BadRequest' });
    return;
  }

  // 文件可通过 /uploads/{filename} 访问
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json(success({ url, filename: req.file.filename }, '上传成功', 201));
});

/**
 * POST /api/upload/images
 * @description 批量上传图片，字段名为 files，最多 5 张，返回每张图片的 URL 与文件名
 * @param {Request} req Express 请求对象，需通过 multer.array('files', 5) 处理多文件
 * @param params.files 待上传的图片文件数组，字段名必须为 files，最多 5 个
 * @param {Response} res Express 响应对象
 * @returns {void} 返回 201 携带图片对象数组；未提供文件时返回 400
 */
router.post('/images', upload.array('files', 5), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ message: '请选择要上传的文件', statusCode: 400, error: 'BadRequest' });
    return;
  }

  // 组装每张图片的访问 URL 与文件名
  const urls = files.map((f) => ({ url: `/uploads/${f.filename}`, filename: f.filename }));
  res.status(201).json(success(urls, '上传成功', 201));
});

export default router;
