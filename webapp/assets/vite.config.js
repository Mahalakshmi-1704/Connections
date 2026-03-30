import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  base: "/connectionGame/",
  /*build: {
    outDir: '/Users/maha-nts0448/eclipse-workspace/connectionGame/webapp'
  }*/
})