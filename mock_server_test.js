const http = require('http');
const port = 4010;

function sendJson(res, statusCode, body) {
  const text = JSON.stringify(body);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(text)
  });
  res.end(text);
}

const server = http.createServer((req, res) => {
  const now = new Date().toISOString();
  if (req.method === 'GET' && req.url === '/health') {
    return sendJson(res, 200, {
      ok: true,
      data: { status: 'ok', services: { db: 'ok', extractor: 'ok' } },
      meta: { requestId: 'req_mock', locale: 'en', degraded: false, timestamp: now }
    });
  }

  if (req.method === 'POST' && req.url === '/extract/prepare') {
    let raw = '';
    req.on('data', c => raw += c);
    req.on('end', () => {
      let body = {};
      try { body = JSON.parse(raw || '{}'); } catch { body = {}; }
      if (!body.url || !body.platform) {
        return sendJson(res, 400, {
          ok: false,
          error: { code: 'INVALID_REQUEST', message: 'url and platform are required', details: {} },
          meta: { requestId: 'req_mock', locale: 'en', degraded: false, timestamp: now }
        });
      }
      return sendJson(res, 202, {
        ok: true,
        data: { jobId: 'job_mock_001', status: 'queued', pollAfterMs: 1200 },
        meta: { requestId: 'req_mock', locale: body.locale || 'en', degraded: false, timestamp: now }
      });
    });
    return;
  }

  return sendJson(res, 404, {
    ok: false,
    error: { code: 'NOT_FOUND', message: 'route not found', details: {} },
    meta: { requestId: 'req_mock', locale: 'en', degraded: false, timestamp: now }
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`mock listening on ${port}`);
});
