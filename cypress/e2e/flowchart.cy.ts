describe('Flowchart Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the application', () => {
    cy.contains('FlowchartSaaS').should('be.visible');
  });

  it('should have a toolbar with node creation buttons', () => {
    cy.contains('Rectangle').should('be.visible');
    cy.contains('Circle').should('be.visible');
    cy.contains('Diamond').should('be.visible');
  });

  it('should have a canvas element', () => {
    cy.get('canvas#flowchart-canvas').should('be.visible');
  });

  it('should have a watermark', () => {
    cy.contains('Feito por DevFerreiraG').should('be.visible');
  });
});