import { defineConfig,loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import {createHtmlPlugin} from "vite-plugin-html";


 // https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {

    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            GOOGLE_API_KEY: env.VITE_GOOGLE_API_KEY,
          }
        }
      }),
    ],
    define: {
      'process.env.VITE_CLOUD_NAME': JSON.stringify(env.VITE_CLOUD_NAME),
      'process.env.VITE_GOOGLE_API_KEY': JSON.stringify(env.VITE_GOOGLE_API_KEY),
      'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
      'process.env.VITE_NAVER_CLIENT_ID': JSON.stringify(env.VITE_NAVER_CLIENT_ID),
      'process.env.VITE_NAVER_REDIRECT_URI': JSON.stringify(env.VITE_NAVER_REDIRECT_URI),
    }
  }

})


