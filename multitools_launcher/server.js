// Servidor estático mínimo (sin dependencias) para Railway.
// Solo sirve archivos de una lista cerrada y añade cabeceras de seguridad.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const FILES = new Set([
  'index.html', 'tools.json', 'favicon.svg', 'robots.txt', '.well-known/security.txt',
  'legal/legal.css',
  'legal/terminos/index.html', 'legal/privacidad/index.html', 'legal/derechos-de-autor/index.html',
]);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.css': 'text/css; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join('; ');

const SECURITY = {
  'Content-Security-Policy': CSP,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

function send(res, status, headers, body) {
  res.writeHead(status, Object.assign({}, SECURITY, headers));
  res.end(body);
}

http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain' }, 'Method Not Allowed');
  }
  let p;
  try { p = decodeURIComponent((req.url || '/').split('?')[0]); }
  catch (e) { return send(res, 400, { 'Content-Type': 'text/plain' }, 'Bad Request'); }

  if (p === '/health') return send(res, 200, { 'Content-Type': 'text/plain' }, 'ok');

  let name = p.replace(/^\/+/, '');
  if (name === '') name = 'index.html';
  else if (name.endsWith('/')) name += 'index.html';
  else if (!FILES.has(name) && FILES.has(name + '/index.html')) {
    return send(res, 301, { Location: '/' + name + '/' }, '');
  }
  if (!FILES.has(name)) return send(res, 302, { Location: '/' }, '');

  fs.readFile(path.join(ROOT, name), (err, buf) => {
    if (err) return send(res, 500, { 'Content-Type': 'text/plain' }, 'Error');
    const dynamic = name === 'index.html' || name === 'tools.json' || name.startsWith('legal/') && name.endsWith('.html');
    send(res, 200, {
      'Content-Type': TYPES[path.extname(name)] || 'application/octet-stream',
      'Cache-Control': dynamic ? 'no-cache' : 'public, max-age=86400',
    }, req.method === 'HEAD' ? '' : buf);
  });
}).listen(PORT, () => console.log('Multi-Tools launcher en puerto ' + PORT));
