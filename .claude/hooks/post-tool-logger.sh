#!/bin/bash
# LOG hook — records every terraform command to the deploy log

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if echo "$CMD" | grep -q "terraform"; then
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Terraform command executed: $CMD" >> "$CLAUDE_PROJECT_DIR/.claude/deploy.log"
fi
