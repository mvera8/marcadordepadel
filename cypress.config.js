import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Change this to your dev server URL
    supportFile: false, // Optional: If you don’t need Cypress’s support file
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
