import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/duffel-search-airports': {
        target: 'https://ytraidksgwxttjeevjuc.functions.supabase.co/duffel-search-airports',
        changeOrigin: true,
       secure: false,
        rewrite: (path) => path.replace(/^\/api\/duffel-search-airports/, ''),
      },
      '/api/duffel-search-flights': {
        target: 'https://ytraidksgwxttjeevjuc.functions.supabase.co/duffel-search-flights',
        changeOrigin: true,
       secure: false,
        rewrite: (path) => path.replace(/^\/api\/duffel-search-flights/, ''),
      },
      '/api/tripcom-flights': {
        target: 'https://ytraidksgwxttjeevjuc.functions.supabase.co/tripcom-flights',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/tripcom-flights/, ''),
      },
      '/api/tripcom-hotels': {
        target: 'https://ytraidksgwxttjeevjuc.functions.supabase.co/tripcom-hotels',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/tripcom-hotels/, ''),
      },
      '/api/tripcom-cars': {
        target: 'https://ytraidksgwxttjeevjuc.functions.supabase.co/tripcom-cars',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/tripcom-cars/, ''),
      },
      '/api/tripcom-flights-dynamic': {
        target: 'https://ytraidksgwxttjeevjuc.functions.supabase.co/tripcom-flights-dynamic',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/tripcom-flights-dynamic/, ''),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
