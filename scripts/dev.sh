#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# 一键启动脚本：前端开发服务器
#   前端: http://localhost:3000
#
# 健壮性措施：
#   1. 检查端口占用，提示并退出（不自动杀进程，避免误杀）
#   2. 检查 node_modules 是否存在，缺失则自动安装
#   3. 强制 NODE_ENV=development（避免 devDependencies 被跳过）
# ============================================================

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

FRONTEND_PORT=3000

# --- 颜色 ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info()  { echo -e "${BLUE}[info]${NC}  $1"; }
ok()    { echo -e "${GREEN}[ok]${NC}    $1"; }
warn()  { echo -e "${YELLOW}[warn]${NC}  $1"; }
fail()  { echo -e "${RED}[error]${NC} $1"; exit 1; }

# --- 1. 检查端口占用 ---
check_port() {
  local port=$1
  local name=$2
  if command -v lsof &>/dev/null; then
    local pid
    pid=$(lsof -ti:"$port" 2>/dev/null || true)
    if [[ -n "$pid" ]]; then
      echo ""
      warn "端口 ${port} 已被占用（${name}）"
      echo -e "  占用 PID: ${YELLOW}${pid}${NC}"
      echo -e "  如需释放，请运行: ${YELLOW}kill ${pid}${NC}"
      echo -e "  如需强制释放，请运行: ${YELLOW}kill -9 ${pid}${NC}"
      echo ""
      return 1
    fi
  fi
  return 0
}

info "检查端口占用..."
check_port "$FRONTEND_PORT" "前端" || fail "前端端口 ${FRONTEND_PORT} 被占用，请先释放"
ok "端口 ${FRONTEND_PORT} 可用"

# --- 2. 检查依赖 ---
info "检查依赖安装..."
if [[ ! -d "$ROOT_DIR/node_modules" ]]; then
  warn "根 node_modules 不存在，正在安装依赖..."
  NODE_ENV=development pnpm install
fi

if [[ ! -d "$ROOT_DIR/frontend/node_modules" ]]; then
  warn "frontend/node_modules 不存在，正在创建链接..."
  NODE_ENV=development pnpm install
fi

ok "依赖已就绪"

# --- 3. 启动 ---
export NODE_ENV=development

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  启动开发环境${NC}"
echo -e "${GREEN}  前端: http://localhost:${FRONTEND_PORT}${NC}"
echo -e "${GREEN}  按 Ctrl+C 停止服务${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

exec pnpm --filter ./frontend dev
