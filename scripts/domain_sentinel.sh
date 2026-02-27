#!/usr/bin/env bash
set -euo pipefail

STATE_FILE=${STATE_FILE:-".state/domain_sentinel_state.json"}
LOG_FILE=${LOG_FILE:-".state/domain_sentinel.log"}
MC_URL=${MC_URL:-""}
MC_AGENT_ID=${MC_AGENT_ID:-""}
CHECK_DOMAIN=${CHECK_DOMAIN:-"whoffagents.com"}
CHECK_DOMAIN_WWW=${CHECK_DOMAIN_WWW:-"www.whoffagents.com"}
CHECK_URL=${CHECK_URL:-"https://whoffagents.com"}

python3 - <<'PY'
import json, os, socket, time
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

state_file = os.environ.get('STATE_FILE')
log_file = os.environ.get('LOG_FILE')
mc_url = os.environ.get('MC_URL')
mc_agent_id = os.environ.get('MC_AGENT_ID')

domains = [os.environ.get('CHECK_DOMAIN'), os.environ.get('CHECK_DOMAIN_WWW')]
url = os.environ.get('CHECK_URL')

status = {
    'dns': {},
    'http': None,
    'ok': True,
    'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
}

for h in domains:
    try:
        ip = socket.gethostbyname(h)
        status['dns'][h] = ip
    except Exception:
        status['dns'][h] = None
        status['ok'] = False

try:
    req = Request(url, method='GET', headers={'User-Agent':'atlas-domain-sentinel'})
    with urlopen(req, timeout=10) as resp:
        code = resp.status
        status['http'] = code
        if code not in (200, 301, 302):
            status['ok'] = False
except HTTPError as e:
    status['http'] = e.code
    status['ok'] = False
except URLError:
    status['http'] = None
    status['ok'] = False

prev = None
if os.path.exists(state_file):
    try:
        prev = json.load(open(state_file))
    except Exception:
        prev = None

changed = prev is None or prev.get('ok') != status['ok']

os.makedirs(os.path.dirname(state_file), exist_ok=True)
with open(state_file, 'w') as f:
    json.dump(status, f, indent=2)

with open(log_file, 'a') as f:
    f.write(f"{status['timestamp']} ok={status['ok']} dns={status['dns']} http={status['http']}\n")

if changed and mc_url:
    msg = f"Domain sentinel: {'OK' if status['ok'] else 'BROKEN'} | dns={status['dns']} | http={status['http']}"
    payload = {
        'type':'monitor',
        'message': msg,
        'agent_id': mc_agent_id or None,
        'metadata': status,
    }
    try:
        req = Request(mc_url.rstrip('/') + '/api/events', data=json.dumps(payload).encode('utf-8'), headers={'Content-Type':'application/json'}, method='POST')
        with urlopen(req, timeout=5) as resp:
            resp.read()
    except Exception:
        pass
PY
