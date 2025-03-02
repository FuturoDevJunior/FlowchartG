/// <reference types="cypress" />

import { DATA_TEST_IDS } from '../../src/constants/testIds';

// Comando para esperar o carregamento completo do canvas
Cypress.Commands.add('waitForCanvas', (timeout = 10000) => {
  cy.get(`canvas[data-cy="${DATA_TEST_IDS.CANVAS}"]`, { timeout }).should('be.visible');
});

// Comando para selecionar uma ferramenta da barra de ferramentas
Cypress.Commands.add('selectTool', (toolName: string) => {
  cy.get(`[data-cy="${DATA_TEST_IDS.TOOL_BUTTON(toolName)}"]`).click();
});

// Comando para criar um nó no canvas nas coordenadas especificadas
Cypress.Commands.add('createNode', (type: string, x: number, y: number) => {
  cy.selectTool(type);
  cy.get(`canvas[data-cy="${DATA_TEST_IDS.CANVAS}"]`).click(x, y);
});

// Comando para verificar se um nó existe no canvas
Cypress.Commands.add('nodeExists', (nodeId: string) => {
  cy.get(`[data-cy="${DATA_TEST_IDS.NODE(nodeId)}"]`).should('exist');
});

// Comando para alternar o tema
Cypress.Commands.add('toggleTheme', () => {
  cy.get(`[data-cy="${DATA_TEST_IDS.THEME_TOGGLE_BUTTON}"]`).click();
});

// Comando para verificar o tema atual
Cypress.Commands.add('checkTheme', (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    cy.get('html').should('have.class', 'dark');
  } else {
    cy.get('html').should('not.have.class', 'dark');
  }
});

// Comando para exportar o diagrama
Cypress.Commands.add('exportDiagram', (type: 'png' | 'svg' | 'json') => {
  cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_BUTTON}"]`).click();
  cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_OPTION(type)}"]`).click();
});

// Tipos para os comandos personalizados
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Espera até que o canvas esteja carregado e visível
       * @param timeout Tempo máximo de espera em ms
       */
      waitForCanvas(timeout?: number): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Seleciona uma ferramenta na barra de ferramentas
       * @param toolName Nome da ferramenta a ser selecionada
       */
      selectTool(toolName: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Cria um nó no canvas
       * @param type Tipo do nó (rectangle, circle, diamond, etc.)
       * @param x Coordenada X
       * @param y Coordenada Y
       */
      createNode(type: string, x: number, y: number): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Verifica se um nó existe no canvas
       * @param nodeId ID do nó a ser verificado
       */
      nodeExists(nodeId: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Alterna entre tema claro e escuro
       */
      toggleTheme(): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Verifica se o tema atual é o esperado
       * @param theme Tema esperado ('light' ou 'dark')
       */
      checkTheme(theme: 'light' | 'dark'): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Exporta o diagrama para o formato especificado
       * @param type Formato de exportação (png, svg, json)
       */
      exportDiagram(type: 'png' | 'svg' | 'json'): Chainable<JQuery<HTMLElement>>;
    }
  }
}