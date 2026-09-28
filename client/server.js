const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 5173;
const clientRoot = path.resolve(__dirname);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  try {
    const urlPath = new URL(req.url, `http://${req.headers.host}`).pathname;
    const requestedFile = urlPath === '/' ? 'index.html' : decodeURIComponent(urlPath).replace(/^[/\\]+/, '');
    const filePath = path.resolve(clientRoot, requestedFile);

    if (!filePath.startsWith(`${clientRoot}${path.sep}`) && filePath !== clientRoot) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(error.code === 'ENOENT' ? 'Not found' : 'Unable to read file');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream' });
      res.end(content);
    });
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
  }
});

server.listen(PORT, () => console.log(`Client running at http://localhost:${PORT}`));
