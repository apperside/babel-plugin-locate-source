import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// https://vite.dev/config/
export default defineConfig({
  // ..rest of your config,
  plugins: [
    // ...rest of your plugins
    react({
      
      babel: {
        plugins: [
          [
            /**
             * the plugin, by default, is enabled if
             * 
             * process.env.NODE_ENV === 'development'
             * 
             * you can pass the enabled parameter to fit your custom rules
             */
            "babel-plugin-locate-source",
            { 
              enabled: true,
              devTools: true // Enable dev tools source locations
            },
          ],
        ],
      },
    }),
  ],
});
