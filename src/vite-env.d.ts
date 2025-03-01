/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_LOCAL_STORAGE_KEY: string;
    readonly VITE_APP_VERSION: string;
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
    [key: string]: string | boolean | undefined;
  };
}
