import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4173',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implementar event listeners aqui
      return config;
    }
  },
});