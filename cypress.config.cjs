/* eslint-disable */
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4173', // Atualizando para a porta usada em preview
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implementar event listeners aqui
      return config;
    }
  },
}); 