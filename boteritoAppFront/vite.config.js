import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server : {
    //cors: true,
    allowedHosts: true,
    proxy : {
       '/api':{
         target: 'http://192.168.1.244:8080',
         changeOrigin: true,
         secure: false
       },
       '/auth':{
         target: 'http://192.168.1.244:8080',
         changeOrigin: true,
	 secure: false
       },
    },
  },
})
