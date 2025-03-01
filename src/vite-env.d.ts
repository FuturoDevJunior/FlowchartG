/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_SUPABASE_SERVICE_ROLE_KEY?: string;
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
    [key: string]: string | boolean | undefined;
  };
}
