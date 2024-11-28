import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';

dotenv.config();
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    replace({
      preventAssignment: true,
      values: {
        'REACT_APP_SCHOOL_API_URL': JSON.stringify(process.env.REACT_APP_SCHOOL_API_URL),
      },
    }),
  ],
})
