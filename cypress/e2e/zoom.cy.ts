/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DATA_TEST_IDS } from '../../src/constants/testIds';

describe('Zoom Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForCanvas();
  });

  it('should display zoom controls', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_CONTROLS}"]`).should('be.visible');
  });

  it('should have zoom in button', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_IN}"]`).should('be.visible');
  });

  it('should have zoom out button', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_OUT}"]`).should('be.visible');
  });

  it('should have zoom reset button', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_RESET}"]`).should('be.visible');
  });

  it('should zoom in when zoom in button is clicked', () => {
    // Capturar o nível de zoom inicial
    let initialTransform;
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_WRAPPER}"]`).then($wrapper => {
      initialTransform = $wrapper.css('transform') || 'scale(1)';
    });

    // Clicar no botão de zoom in
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_IN}"]`).click();

    // Verificar se o zoom aumentou
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_WRAPPER}"]`).should($wrapper => {
      const newTransform = $wrapper.css('transform') || 'scale(1)';
      // Verificar se a transformação mudou
      expect(newTransform).not.to.equal(initialTransform);
    });
  });

  it('should zoom out when zoom out button is clicked', () => {
    // Primeiro fazer zoom in para depois testar o zoom out
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_IN}"]`).click();
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_IN}"]`).click();

    // Capturar o nível de zoom atual
    let initialTransform;
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_WRAPPER}"]`).then($wrapper => {
      initialTransform = $wrapper.css('transform') || 'scale(1)';
    });

    // Clicar no botão de zoom out
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_OUT}"]`).click();

    // Verificar se o zoom diminuiu
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_WRAPPER}"]`).should($wrapper => {
      const newTransform = $wrapper.css('transform') || 'scale(1)';
      // Verificar se a transformação mudou
      expect(newTransform).not.to.equal(initialTransform);
    });
  });

  it('should reset zoom when reset button is clicked', () => {
    // Primeiro fazer zoom in para depois testar o reset
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_IN}"]`).click();
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_IN}"]`).click();

    // Clicar no botão de reset
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_RESET}"]`).click();

    // Verificar se o zoom voltou ao normal (escala 1)
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_WRAPPER}"]`).should($wrapper => {
      const transform = $wrapper.css('transform') || '';
      // A transformação pode ser 'none', 'matrix(1, 0, 0, 1, 0, 0)' ou similar quando em escala 1
      const isResetZoom = transform === 'none' || 
                          transform.includes('matrix(1, 0, 0, 1') || 
                          transform.includes('scale(1)');
      expect(isResetZoom).to.be.true;
    });
  });

  it('should zoom in with mouse wheel', () => {
    // Capturar o nível de zoom inicial
    let initialTransform;
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_WRAPPER}"]`).then($wrapper => {
      initialTransform = $wrapper.css('transform') || 'scale(1)';
    });

    // Simular o evento de roda do mouse para zoom in
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS}"]`).trigger('wheel', { 
      deltaY: -100, // Valor negativo para zoom in
      ctrlKey: true // Muitos navegadores requerem a tecla Ctrl para zoom
    });

    // Verificar se o zoom aumentou
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_WRAPPER}"]`).should($wrapper => {
      const newTransform = $wrapper.css('transform') || 'scale(1)';
      // Verificar se a transformação mudou
      expect(newTransform).not.to.equal(initialTransform);
    });
  });

  it('should zoom out with mouse wheel', () => {
    // Primeiro fazer zoom in para depois testar o zoom out
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_IN}"]`).click();
    cy.get(`[data-cy="${DATA_TEST_IDS.ZOOM_IN}"]`).click();

    // Capturar o nível de zoom atual
    let initialTransform;
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_WRAPPER}"]`).then($wrapper => {
      initialTransform = $wrapper.css('transform') || 'scale(1)';
    });

    // Simular o evento de roda do mouse para zoom out
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS}"]`).trigger('wheel', { 
      deltaY: 100, // Valor positivo para zoom out
      ctrlKey: true // Muitos navegadores requerem a tecla Ctrl para zoom
    });

    // Verificar se o zoom diminuiu
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_WRAPPER}"]`).should($wrapper => {
      const newTransform = $wrapper.css('transform') || 'scale(1)';
      // Verificar se a transformação mudou
      expect(newTransform).not.to.equal(initialTransform);
    });
  });
}); 