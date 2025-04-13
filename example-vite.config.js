import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable the plugin only in development mode
      babel: {
        plugins: [
          process.env.NODE_ENV !== 'production' && 
            path.resolve(__dirname, './custom-babel-plugin/index.js')
        ].filter(Boolean)
      }
    })
  ],
}); 