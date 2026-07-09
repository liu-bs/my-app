#!/bin/bash
set -e

BRANCH=$(git branch --show-current)
REMOTE=$(git remote | head -1)
DATE=$(date +%Y%m%d)
BACKUP="backup/squash-$BRANCH-$DATE"
MSG="$1"

if [ -z "$MSG" ]; then
  echo "❌ 用法: $0 \"commit message\""
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌿 分支:$BRANCH | 🔗 远程:$REMOTE | 📅 备份:$BACKUP"
echo "📝 提交信息:$MSG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! git rev-parse --verify "$REMOTE/$BRANCH" >/dev/null 2>&1; then
  echo "❌ 远程分支 $REMOTE/$BRANCH 不存在"
  exit 1
fi

UNPUSHED=$(git log --oneline "$REMOTE/$BRANCH"..HEAD 2>/dev/null | wc -l | tr -d ' ')
echo "📦 未推送提交数:$UNPUSHED"

# 备份
git branch "$BACKUP" 2>/dev/null || true
git push "$REMOTE" "$BACKUP" --quiet
echo "✅ 备份完成:$REMOTE/$BACKUP"

# 软重置 + 暂存
git reset --soft "$REMOTE/$BRANCH"
git add -A
STAGED=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')
echo "📋 暂存文件数:$STAGED"

# 提交
if [ "$STAGED" -eq 0 ]; then
  echo "ℹ️  无暂存内容,使用 --allow-empty 创建里程碑提交"
  git commit --allow-empty -m "$MSG"
else
  git commit -m "$MSG"
fi
echo "✅ 提交完成:$(git log -1 --pretty=format:%h) $(git log -1 --pretty=format:%s)"

# 强制推送
git push --force-with-lease "$REMOTE" "$BRANCH"
echo "✅ 强制推送完成"

# 验收
LOCAL=$(git rev-parse HEAD)
REMOTE_HASH=$(git rev-parse "$REMOTE/$BRANCH")
if [ "$LOCAL" = "$REMOTE_HASH" ]; then
  echo "✅ 本地与远程 HEAD 一致:$LOCAL"
else
  echo "❌ 不一致"
  exit 1
fi

# 清理备份
git push "$REMOTE" --delete "$BACKUP" --quiet
git branch -D "$BACKUP" --quiet
echo "✅ 备份分支已删除(本地+远程)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 全部完成!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
