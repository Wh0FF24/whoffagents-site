import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Real recent commit subjects for the ops tape. Conventional-commit
 * subjects only; housekeeping/meta lines are dropped so internal cleanup
 * language never renders on the site. Returns [] whenever git history is
 * unavailable (e.g. a shallow CI clone) — the tape degrades gracefully.
 * NOTE: scripts/prerender.mjs has its own independent define block with the
 * same logic — keep both in sync.
 */
function getOpsLines() {
  try {
    return execSync('git log -12 --format=%s', { encoding: 'utf8' })
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => /^(feat|fix|perf|style|docs|chore):/.test(s))
      .filter((s) => !/honest|fabricat|purge|remove/i.test(s))
      .slice(0, 4)
  } catch {
    return []
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Stamped into the UI "receipts" — always the real build date.
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    // Real git log subjects for the ops tape — filtered above.
    __OPS_LINES__: JSON.stringify(getOpsLines()),
  },
})
