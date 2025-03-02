/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DATA_TEST_IDS } from '../../src/constants/testIds';

describe('Flowchart Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the application successfully', () => {
    cy.get('h1').should('exist');
    cy.title().should('include', 'FlowchartG');
    
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_CONTAINER}"]`).should('exist');
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_WRAPPER}"]`).should('exist');
    cy.get(`canvas[data-cy="${DATA_TEST_IDS.CANVAS}"]`).should('be.visible');
  });

  it('should have a toolbar with interactive elements', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.TOOLBAR}"]`).should('exist');
    
    cy.get(`[data-cy^="tool-"]`).should('have.length.at.least', 1);
  });

  it('should have a canvas element for drawing', () => {
    cy.get(`canvas[data-cy="${DATA_TEST_IDS.CANVAS}"]`).should('be.visible');
    
    cy.get(`[data-cy="${DATA_TEST_IDS.CANVAS_CONTAINER}"]`)
      .should('have.css', 'height')
      .and('not.eq', '0px');
  });

  it('should have footer elements with information', () => {
    cy.get('footer, [data-cy$="footer"]').should('exist');
  });
  
  it('should handle window resizing properly', () => {
    cy.viewport('iphone-6');
    cy.wait(200);
    cy.get(`canvas[data-cy="${DATA_TEST_IDS.CANVAS}"]`).should('be.visible');
    
    cy.viewport('macbook-15');
    cy.wait(200);
    cy.get(`canvas[data-cy="${DATA_TEST_IDS.CANVAS}"]`).should('be.visible');
  });
});