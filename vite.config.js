import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { pathToFileURL } from 'url'

function vercelApiPlugin() {
  return {
    name: 'vercel-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next();

        try {
          const url = new URL(req.url, 'http://localhost');
          const endpointName = url.pathname.replace(/^\/api\//, '').split('?')[0];
          const filePath = path.resolve(process.cwd(), `api/${endpointName}.js`);

          if (!fs.existsSync(filePath)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: `API route /api/${endpointName} not found` }));
          }

          let body = {};
          if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const rawBody = Buffer.concat(buffers).toString('utf8');
            if (rawBody) {
              try {
                body = JSON.parse(rawBody);
              } catch {
                body = {};
              }
            }
          }

          req.body = body;
          req.query = Object.fromEntries(url.searchParams.entries());

          res.status = function(code) {
            this.statusCode = code;
            return this;
          };
          res.json = function(data) {
            this.setHeader('Content-Type', 'application/json');
            this.end(JSON.stringify(data));
          };

          // File URL for dynamic import on Windows
          const fileUrl = pathToFileURL(filePath).href;
          const module = await import(`${fileUrl}?t=${Date.now()}`);
          const handler = module.default;
          await handler(req, res);
        } catch (err) {
          console.error('[Vite API Middleware Error]:', err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
          }
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), tailwindcss(), vercelApiPlugin()],
    build: {
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) return 'vendor-firebase';
              if (id.includes('framer-motion')) return 'vendor-framer';
              if (id.includes('swiper')) return 'vendor-swiper';
              if (id.includes('lucide-react')) return 'vendor-lucide';
              return 'vendor'; // all other node_modules
            }
          },
        },
      },
    },
  };
});