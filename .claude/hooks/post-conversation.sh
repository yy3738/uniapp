#!/bin/bash

# Post-conversation hook: 在对话结束后提醒更新 CLAUDE.md
# 由于 hook 运行时 Claude 已退出，我们创建一个提醒文件

CLAUDE_MD="CLAUDE.md"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
REMINDER_FILE=".claude/.pending-update"

# 检查是否有文件变更
CHANGED_FILES=$(git status --short 2>/dev/null | grep -E "^(M| M|A| A|\?\?)" | awk '{print $2}')

if [ -z "$CHANGED_FILES" ]; then
  # 没有变更，清理提醒文件
  rm -f "$REMINDER_FILE"
  exit 0
fi

# 创建提醒文件，记录变更信息
cat > "$REMINDER_FILE" <<EOF
{
  "timestamp": "$TIMESTAMP",
  "changed_files": [
$(echo "$CHANGED_FILES" | sed 's/^/    "/' | sed 's/$/",/' | sed '$ s/,$//')
  ],
  "message": "检测到代码变更，请在下次对话开始时要求 Claude 更新 CLAUDE.md"
}
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 检测到以下文件变更:"
echo "$CHANGED_FILES" | sed 's/^/   /'
echo ""
echo "💡 提示: 在下次对话时，直接说："
echo "   '请根据刚才的变更更新 CLAUDE.md'"
echo ""
echo "   Claude 会自动分析变更并生成文档"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
