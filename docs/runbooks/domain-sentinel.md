# Domain/Uptime Sentinel

## What it does
Checks DNS + HTTP for whoffagents.com every 15 minutes and only alerts on **state change** (OK → BROKEN or BROKEN → OK). Logs to a local file; optionally posts an event to Mission Control.

## Checks
- DNS resolve for `whoffagents.com` and `www.whoffagents.com`
- HTTP GET `https://whoffagents.com` (200/301/302 = OK)

## Files
- Script: `scripts/domain_sentinel.sh`
- State: `.state/domain_sentinel_state.json`
- Log: `.state/domain_sentinel.log`

## Env vars
- `MC_URL` (optional): Mission Control base URL (e.g. `http://localhost:4000`)
- `MC_AGENT_ID` (optional): agent UUID for MC events
- `CHECK_DOMAIN` (optional): default `whoffagents.com`
- `CHECK_DOMAIN_WWW` (optional): default `www.whoffagents.com`
- `CHECK_URL` (optional): default `https://whoffagents.com`
- `STATE_FILE` (optional)
- `LOG_FILE` (optional)

## Run once
```bash
chmod +x scripts/domain_sentinel.sh
MC_URL=http://localhost:4000 MC_AGENT_ID=<agent-uuid> scripts/domain_sentinel.sh
```

## Cron (macOS example)
```bash
*/15 * * * * cd /path/to/whoffagents-site && MC_URL=http://localhost:4000 MC_AGENT_ID=<agent-uuid> scripts/domain_sentinel.sh
```

## Verify
- OK case: run normally with real domain
- BROKEN case: set `CHECK_DOMAIN=does-not-exist.example` and re-run; it should log a state change
