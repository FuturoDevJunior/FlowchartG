/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DATA_TEST_IDS } from '../../src/constants/testIds';

describe('Flowchart Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the application successfully', () => {
    cy.title().should('include', 'FlowchartG');
    
    // Verificar elementos essenciais da aplicação
    cy.get('[data-cy="local-mode-banner"]').should('be.visible')
      .and('contain', 'Modo local');
  });

  it('should have a toolbar with interactive elements', () => {
    // Testando a presença de algum elemento de toolbar
    cy.get('button').should('have.length.at.least', 1);
  });

  it('should have a canvas or container for drawing', () => {
    // Verificar a presença de algum container para o fluxograma
    cy.get('canvas').should('have.length.at.least', 1);
  });

  it('should have footer elements with information', () => {
    cy.get('footer').should('exist');
  });
  
  it('should handle window resizing properly', () => {
    // Teste de responsividade
    cy.viewport('iphone-6');
    cy.wait(200);
    
    // A aplicação deve continuar visível
    cy.get('[data-cy="local-mode-banner"]').should('be.visible');
    
    cy.viewport('macbook-15');
    cy.wait(200);
    cy.get('[data-cy="local-mode-banner"]').should('be.visible');
  });
});