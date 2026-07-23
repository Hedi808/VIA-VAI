import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.resolve(__dirname, '../frontend');
const PORT = Number(process.env.PORT) || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(JSON.stringify(data));
}

function safeFrontendPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath);
  const requestedPath = decodedPath === '/' ? '/index.html' : decodedPath;
  const normalizedPath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
  const absolutePath = path.resolve(FRONTEND_DIR, `.${normalizedPath}`);

  return absolutePath.startsWith(FRONTEND_DIR) ? absolutePath : null;
}

async function serveStaticFile(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  let filePath = safeFrontendPath(url.pathname);

  if (!filePath) {
    sendJson(response, 403, { error: 'Forbidden path.' });
    return;
  }

  try {
    const fileStats = await stat(filePath);
    if (fileStats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const file = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();

    response.writeHead(200, {
      'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=3600'
    });
    response.end(file);
  } catch (error) {
    if (error.code === 'ENOENT') {
      sendJson(response, 404, { error: 'Page not found.' });
      return;
    }

    console.error(error);
    sendJson(response, 500, { error: 'Internal server error.' });
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'GET' && url.pathname === '/api/status') {
    sendJson(response, 200, {
      online: true,
      project: 'VIA VAI',
      message: 'The Node.js backend is connected.',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/greeting') {
    const name = (url.searchParams.get('name') || 'traveler').trim().slice(0, 40);
    sendJson(response, 200, {
      greeting: `Welcome, ${name}. Your next idea starts here.`
    });
    return;
  }

  if (!['GET', 'HEAD'].includes(request.method)) {
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  await serveStaticFile(request, response);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`VIA VAI is running at http://localhost:${PORT}`);
});
