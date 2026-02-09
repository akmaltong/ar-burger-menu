const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const selfsigned = require('selfsigned');

const PORT_HTTPS = 8443;
const PORT_HTTP = 8080;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.patt': 'text/plain',
  '.wasm': 'application/wasm',
  '.bin': 'application/octet-stream',
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

function handleRequest(req, res) {
  let filePath = '.' + decodeURIComponent(req.url.split('?')[0]);
  if (filePath === './') filePath = './index.html';

  // Security: prevent directory traversal
  const resolvedPath = path.resolve(filePath);
  const rootDir = path.resolve('.');
  if (!resolvedPath.startsWith(rootDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found: ' + filePath);
      } else {
        res.writeHead(500);
        res.end('Server error: ' + err.code);
      }
      return;
    }

    const mimeType = getMimeType(filePath);
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}

// Get local IP address
function getLocalIP() {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const localIP = getLocalIP();

// Generate self-signed certificate
console.log('Generating selfsigned SSL certificate... - server.js:83');
const attrs = [{ name: 'commonName', value: localIP }];
const pems = selfsigned.generate(attrs, {
  algorithm: 'sha256',
  days: 365,
  keySize: 2048,
  extensions: [
    {
      name: 'subjectAltName', altNames: [
        { type: 2, value: 'localhost' },
        { type: 7, ip: '127.0.0.1' },
        { type: 7, ip: localIP },
      ]
    }
  ]
});

// Start HTTP server
const httpServer = http.createServer(handleRequest);
httpServer.listen(PORT_HTTP, '0.0.0.0', () => {
  console.log('');
  console.log('=== Burger AR Menu Server === - server.js:102');
  console.log('');
  console.log('HTTP server: - server.js:104');
  console.log('Local:   http://localhost: - server.js:105' + PORT_HTTP);
  console.log('Network: http:// - server.js:106' + localIP + ':' + PORT_HTTP);
});

// Start HTTPS server
const httpsOptions = {
  key: pems.private,
  cert: pems.cert,
};

const httpsServer = https.createServer(httpsOptions, handleRequest);
httpsServer.listen(PORT_HTTPS, '0.0.0.0', () => {
  console.log('');
  console.log('HTTPS server (camera will work!): - server.js:118');
  console.log('Local:   https://localhost: - server.js:119' + PORT_HTTPS);
  console.log('Network: https:// - server.js:120' + localIP + ':' + PORT_HTTPS);
  console.log('');
  console.log('==> Open on your phone: https:// - server.js:122' + localIP + ':' + PORT_HTTPS);
  console.log('');
  console.log('Accept the selfsigned certificate warning in browser. - server.js:124');
  console.log('Then allow camera access when prompted. - server.js:125');
  console.log('Point camera at a HIRO marker to see the burger! - server.js:126');
  console.log('');
  console.log('HIRO marker: https:// - server.js:128' + localIP + ':' + PORT_HTTPS + '/hiro-marker.html');
  console.log('');
  console.log('Press Ctrl+C to stop - server.js:130');
});

