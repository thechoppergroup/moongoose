// Serves the built styleguide (docs/) with history-mode fallback to index.html. Plain Node, so it
// runs inside the Playwright container, where the host's native Vite binaries don't.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [dir = 'docs', port = '4173'] = process.argv.slice(2);
const root = path.resolve(dir);
const types = {
    '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff'
};

http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(root, url);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        file = path.join(root, 'index.html');
    }
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
}).listen(Number(port), '127.0.0.1');
