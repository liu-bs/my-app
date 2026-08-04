/**
 * @file comment.ts
 * @description 评论模块共享类型，定义评论实体、发表评论 DTO、评论列表及详情响应数据结构，供前后端共用
 */

/**
 * 评论
 */
export interface Comment {
  /** 评论唯一ID */
  id: string;
  /** 所属文章ID */
  postId: string;
  /** 评论者用户ID */
  userId: string;
  /** 评论者显示名（冗余，避免展示时反复查用户） */
  userName: string;
  /** 评论者头像（冗余） */
  userAvatar?: string;
  /** 评论内容 */
  content: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 发表评论请求
 */
export interface CreateCommentDto {
  /** 评论内容 */
  content: string;
}

/**
 * GET /api/posts/:postId/comments 响应数据
 */
export interface CommentsListData {
  /** 评论列表 */
  comments: Comment[];
}

/**
 * POST /api/posts/:postId/comments、PUT /api/comments/:id 响应数据
 */
export interface CommentData {
  /** 评论详情 */
  comment: Comment;
}

/**
 * 评论列表查询选项（后端内部使用）。
 * `user` 由后端鉴权中间件注入，前端不传。
 */
export interface ListCommentsOptions {
  /** 所属文章ID */
  postId: string;
  /** 认证上下文（后端注入） */
  user?: import('./user').AuthPayload;
}
