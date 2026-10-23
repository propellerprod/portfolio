import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build' || mode === 'production';
  return {
    plugins: [react()],
    base: process.env.VITE_BASE || (isBuild ? '/portfolio/' : '/'),
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
    },
  };
});
