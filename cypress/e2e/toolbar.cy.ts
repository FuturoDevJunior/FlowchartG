/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DATA_TEST_IDS } from '../../src/constants/testIds';

describe('Toolbar Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForCanvas();
  });

  it('should display the toolbar', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.TOOLBAR}"]`).should('be.visible');
  });

  it('should have all required tools', () => {
    // Verificar se as ferramentas básicas estão presentes
    cy.get(`[data-cy="${DATA_TEST_IDS.TOOLBAR}"]`).within(() => {
      // Ferramentas de desenho
      cy.get(`[data-cy^="tool-"]`).should('have.length.at.least', 3);
      
      // Botões de ação (como desfazer, refazer, etc.)
    });
  });

  it('should select a tool when clicked', () => {
    // Encontrar o primeiro botão de ferramenta e clicar nele
    cy.get(`[data-cy^="tool-"]`).first().as('firstTool');
    cy.get('@firstTool').click();
    
    // Verificar se a ferramenta foi selecionada (pode ter uma classe específica ou atributo)
    cy.get('@firstTool').should('have.attr', 'aria-pressed', 'true');
  });

  it('should deselect previous tool when a new one is selected', () => {
    // Selecionar a primeira ferramenta
    cy.get(`[data-cy^="tool-"]`).first().as('firstTool');
    cy.get('@firstTool').click();
    
    // Selecionar a segunda ferramenta
    cy.get(`[data-cy^="tool-"]`).eq(1).as('secondTool');
    cy.get('@secondTool').click();
    
    // Verificar se a primeira ferramenta foi desselecionada
    cy.get('@firstTool').should('not.have.attr', 'aria-pressed', 'true');
    
    // Verificar se a segunda ferramenta foi selecionada
    cy.get('@secondTool').should('have.attr', 'aria-pressed', 'true');
  });

  it('should enable undo button after an action', () => {
    // Inicialmente o botão de desfazer deve estar desabilitado
    cy.get(`[data-cy="${DATA_TEST_IDS.BUTTON('undo')}"]`).should('be.disabled');
    
    // Realizar uma ação (criar um nó)
    cy.createNode('rectangle', 200, 200);
    
    // Verificar se o botão de desfazer foi habilitado
    cy.get(`[data-cy="${DATA_TEST_IDS.BUTTON('undo')}"]`).should('not.be.disabled');
  });

  it('should enable redo button after an undo', () => {
    // Realizar uma ação
    cy.createNode('rectangle', 200, 200);
    
    // Desfazer a ação
    cy.get(`[data-cy="${DATA_TEST_IDS.BUTTON('undo')}"]`).click();
    
    // Verificar se o botão de refazer foi habilitado
    cy.get(`[data-cy="${DATA_TEST_IDS.BUTTON('redo')}"]`).should('not.be.disabled');
  });

  it('should have tooltips for tools', () => {
    // Verificar se as ferramentas têm tooltips
    cy.get(`[data-cy^="tool-"]`).first().trigger('mouseover');
    cy.get('.tooltip').should('be.visible');
  });
});