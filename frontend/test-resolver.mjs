// ponytail: 最小路径解析器，仅用于 node 自检运行
// 映射路径别名 + 补全无扩展名的相对 import
import { resolve as resolvePath } from 'node:path';
import { existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';

const FRONTEND_DIR = import.meta.dirname;
const SRC = resolvePath(FRONTEND_DIR, 'src');
const SHARED = resolvePath(FRONTEND_DIR, '../shared');

function tryFile(absPath) {
  for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
    const full = `${absPath}${ext}`;
    if (existsSync(full)) return pathToFileURL(full).href;
  }
  for (const ext of ['.ts', '.js']) {
    const full = resolvePath(absPath, `index${ext}`);
    if (existsSync(full)) return pathToFileURL(full).href;
  }
  return null;
}

export async function resolve(specifier, context, next) {
  if (specifier === 'server-only') {
    return { url: 'data:text/javascript,', shortCircuit: true };
  }

  if (specifier.startsWith('@server/')) {
    const mapped = resolvePath(SRC, 'server', specifier.slice(8));
    const found = tryFile(mapped);
    if (found) return { url: found, shortCircuit: true };
  }
  if (specifier.startsWith('@/')) {
    const mapped = resolvePath(SRC, specifier.slice(2));
    const found = tryFile(mapped);
    if (found) return { url: found, shortCircuit: true };
  }
  if (specifier === '@my-app/shared') {
    const found = tryFile(resolvePath(SHARED, 'index'));
    if (found) return { url: found, shortCircuit: true };
  }
  if (specifier.startsWith('@my-app/shared/')) {
    const mapped = resolvePath(SHARED, specifier.slice(15));
    const found = tryFile(mapped);
    if (found) return { url: found, shortCircuit: true };
  }

  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    const parentFile = context.parentURL ? fileURLToPath(context.parentURL) : FRONTEND_DIR;
    const parentDir = resolvePath(parentFile, '..');
    const abs = resolvePath(parentDir, specifier);
    const found = tryFile(abs);
    if (found) return { url: found, shortCircuit: true };
  }
  if (specifier.startsWith('file://') && !specifier.match(/\.\w+$/)) {
    const abs = fileURLToPath(specifier);
    const found = tryFile(abs);
    if (found) return { url: found, shortCircuit: true };
  }

  return next(specifier, context);
}
