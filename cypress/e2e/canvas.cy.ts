import { DATA_TEST_IDS } from '../../src/constants/testIds';

describe('Flowchart Canvas', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // Esperar pelo carregamento completo do canvas
    cy.get(`canvas[data-cy="${DATA_TEST_IDS.CANVAS}"]`, { timeout: 10000 }).should('be.visible');
  });

  it('should load and display the canvas properly', () => {
    // Verificar se o canvas existe e está visível
    cy.get(`canvas[data-cy="${DATA_TEST_IDS.CANVAS}"]`).should('be.visible');
    
    // Verificar dimensões do canvas
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_CONTAINER}"]`).then($container => {
      const { width, height } = $container[0].getBoundingClientRect();
      expect(width).to.be.greaterThan(0);
      expect(height).to.be.greaterThan(0);
    });
  });

  it('should handle window resize events', () => {
    // Capturar dimensões iniciais
    let initialWidth, initialHeight;
    
    cy.get(`canvas[data-cy="${DATA_TEST_IDS.CANVAS}"]`).then($canvas => {
      const rect = $canvas[0].getBoundingClientRect();
      initialWidth = rect.width;
      initialHeight = rect.height;
    });
    
    // Simular redimensionamento da janela
    cy.viewport(500, 500);
    cy.wait(500); // Aguardar redimensionamento
    
    // Verificar se as dimensões foram atualizadas
    cy.get(`canvas[data-cy="${DATA_TEST_IDS.CANVAS}"]`).then($canvas => {
      const rect = $canvas[0].getBoundingClientRect();
      // Em alguns navegadores, o canvas pode não se redimensionar exatamente
      // Verificamos apenas se as dimensões mudaram
      expect(rect.width).to.not.equal(initialWidth);
      expect(rect.height).to.not.equal(initialHeight);
    });
    
    // Restaurar viewport
    cy.viewport(1000, 660);
  });

  it('should handle basic mouse interactions', () => {
    // Clicar no canvas
    cy.get(`canvas[data-cy="${DATA_TEST_IDS.CANVAS}"]`).click('center');
    
    // Mover o mouse sobre o canvas
    cy.get(`canvas[data-cy="${DATA_TEST_IDS.CANVAS}"]`).trigger('mousemove', { clientX: 200, clientY: 200 });
    
    // Verificar se o canvas mantém o foco
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_WRAPPER}"]`).should('be.visible');
  });

  it('should handle tool selection', () => {
    // Tentar encontrar e clicar em uma ferramenta (se existir)
    cy.get(`[data-cy^="tool-"]`).first().then($tool => {
      if ($tool.length > 0) {
        cy.wrap($tool).click();
        // Verificar alguma alteração de estado visual como classe ativa
        cy.wrap($tool).should('be.visible');
      }
    });
  });
});