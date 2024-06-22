import { defineConfig,loadEnv} from 'vite'
import react from '@vitejs/plugin-react'


 // https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.CLOUD_NAME': JSON.stringify(env.CLOUD_NAME)
    },
    plugins: [react()],
  }
})


