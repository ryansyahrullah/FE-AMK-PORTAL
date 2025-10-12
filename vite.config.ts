import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue()],
    server: {
      port: 5173
    },
    define: {
      __APP_NAME__: JSON.stringify(env.VITE_APP_NAME || 'AMK Portal')
    }
  };
});
