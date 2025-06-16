import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement en fonction du mode (dev, prod, etc.)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [tailwindcss(), sveltekit()],
    // Assure que les variables d'environnement chargées sont disponibles dans le client
    define: {
      'import.meta.env.PUBLIC_SUPABASE_URL': JSON.stringify(env.PUBLIC_SUPABASE_URL),
      'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.PUBLIC_SUPABASE_ANON_KEY)
    }
  };
});
