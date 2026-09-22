const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PROVIDER_PORT) || 5174;
const clientRoot = path.resolve(__dirname);
const contentTypes = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

http.createServer((req, res) => {
  const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  const requestedFile = urlPath === '/' ? 'provider.html' : decodeURIComponent(urlPath).replace(/^[/\\]+/, '');
  const filePath = path.resolve(clientRoot, requestedFile);
  if (!filePath.startsWith(`${clientRoot}${path.sep}`)) return res.writeHead(403).end('Forbidden');
  fs.readFile(filePath, (error, content) => {
    if (error) return res.writeHead(404).end('Not found');
    res.writeHead(200, { 'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream' });
    res.end(content);
  });
}).listen(PORT, () => console.log(`Provider desk running at http://localhost:${PORT}`));