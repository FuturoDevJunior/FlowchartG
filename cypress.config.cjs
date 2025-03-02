const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4173', // Atualizando para a porta usada em preview
    supportFile: 'cypress/support/e2e.ts',
  },
}); 