// server.js
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { h } from 'lithent';
import { renderToString } from './dist/lithentSsr.mjs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function createServer() {
  const app = express();

  // Vite 서버 생성 및 미들웨어 적용
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' },
    root: process.cwd(), // 프로젝트 루트 디렉터리 설정 (옵션)
    plugins: [], // 필요한 Vite 플러그인 추가 (옵션)
    resolve: {
      alias: {
        '@': '/src', // 경로 별칭 설정 (옵션)
      },
    },
  });

  app.use('/dist', express.static(path.resolve(__dirname, 'dist')));

  // 기본 라우트 설정
  app.get('/', async (_req, res) => {
    try {
      // React 컴포넌트를 가져와서 렌더링
      const { default: Root } = await vite.ssrLoadModule(
        '@/tests/tostring.tsx'
      );
      const appHtml = renderToString(h(Root));

      const html = `
        <!DOCTYPE html>
        ${appHtml}
        <script>
          const { run } =  window.lithentSsr

          run(document.documentElement);
        </script>
      `;
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.use(vite.middlewares);

  app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
  });
}

createServer();
