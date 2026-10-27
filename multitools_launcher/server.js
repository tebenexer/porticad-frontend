// Servidor estático mínimo (sin dependencias) para Railway.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const ALLOWED = new Set(['index.html', 'tools.json', 'favicon.svg']);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p === '/health') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }
  if (p === '/') p = '/index.html';
  const name = p.replace(/^\/+/, '');
  if (!ALLOWED.has(name)) {
    res.writeHead(302, { Location: '/' });
    return res.end();
  }
  fs.readFile(path.join(ROOT, name), (err, buf) => {
    if (err) { res.writeHead(500); return res.end('Error'); }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(name)] || 'application/octet-stream',
      'Cache-Control': name === 'index.html' || name === 'tools.json' ? 'no-cache' : 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    res.end(buf);
  });
}).listen(PORT, () => console.log('Multi-Tools launcher en puerto ' + PORT));
