/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DATA_TEST_IDS } from '../../src/constants/testIds';

describe('Export Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForCanvas();
    
    // Criar um diagrama simples para exportar
    cy.createNode('rectangle', 200, 200);
    cy.createNode('circle', 400, 200);
  });

  it('should display export button', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_BUTTON}"]`).should('be.visible');
  });

  it('should open export menu when clicked', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_BUTTON}"]`).click();
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_MENU}"]`).should('be.visible');
  });

  it('should have PNG export option', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_BUTTON}"]`).click();
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_OPTION('png')}"]`).should('exist');
  });

  it('should have SVG export option', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_BUTTON}"]`).click();
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_OPTION('svg')}"]`).should('exist');
  });

  it('should have JSON export option', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_BUTTON}"]`).click();
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_OPTION('json')}"]`).should('exist');
  });

  it('should close export menu when clicking outside', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_BUTTON}"]`).click();
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_MENU}"]`).should('be.visible');
    
    // Clicar fora do menu
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS}"]`).click();
    
    // Verificar se o menu foi fechado
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_MENU}"]`).should('not.exist');
  });

  // Testes para verificar se os downloads são iniciados
  // Nota: Não podemos verificar o conteúdo dos arquivos baixados diretamente no Cypress
  // mas podemos verificar se o processo de download é iniciado

  it('should trigger download when PNG export is clicked', () => {
    // Interceptar solicitações de download
    cy.intercept('GET', '**/download*').as('downloadRequest');
    
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_BUTTON}"]`).click();
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_OPTION('png')}"]`).click();
    
    // Verificar se o download foi iniciado
    // Nota: Esta é uma verificação simplificada, a implementação real pode variar
    cy.wait('@downloadRequest').its('response.statusCode').should('eq', 200);
  });

  it('should trigger download when SVG export is clicked', () => {
    // Interceptar solicitações de download
    cy.intercept('GET', '**/download*').as('downloadRequest');
    
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_BUTTON}"]`).click();
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_OPTION('svg')}"]`).click();
    
    // Verificar se o download foi iniciado
    cy.wait('@downloadRequest').its('response.statusCode').should('eq', 200);
  });

  it('should trigger download when JSON export is clicked', () => {
    // Interceptar solicitações de download
    cy.intercept('GET', '**/download*').as('downloadRequest');
    
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_BUTTON}"]`).click();
    cy.get(`[data-cy="${DATA_TEST_IDS.EXPORT_OPTION('json')}"]`).click();
    
    // Verificar se o download foi iniciado
    cy.wait('@downloadRequest').its('response.statusCode').should('eq', 200);
  });
}); 