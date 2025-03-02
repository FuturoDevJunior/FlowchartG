/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DATA_TEST_IDS } from '../../src/constants/testIds';

describe('Theme System', () => {
  beforeEach(() => {
    // Limpar localStorage para garantir um estado inicial consistente
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should have theme toggle button', () => {
    cy.get(`[data-cy="${DATA_TEST_IDS.THEME_TOGGLE_BUTTON}"]`).should('exist');
  });

  it('should change theme when toggle is clicked', () => {
    // Verificar tema inicial
    cy.get('html').then($html => {
      const initialIsDark = $html.hasClass('dark');
      
      // Clicar no botão de alternar tema
      cy.get(`[data-cy="${DATA_TEST_IDS.THEME_TOGGLE_BUTTON}"]`).click();
      
      // Verificar se o tema mudou
      cy.get('html').should($html => {
        const newIsDark = $html.hasClass('dark');
        expect(newIsDark).to.not.equal(initialIsDark);
      });
      
      // Verificar se o tema foi salvo no localStorage
      cy.window().then(win => {
        const savedTheme = win.localStorage.getItem('theme');
        expect(savedTheme).to.not.be.null;
      });
    });
  });

  it('should persist theme across page reloads', () => {
    // Definir um tema específico
    cy.get('html').then($html => {
      const initialIsDark = $html.hasClass('dark');
      
      // Se não estiver no tema escuro, alternar para o tema escuro
      if (!initialIsDark) {
        cy.get(`[data-cy="${DATA_TEST_IDS.THEME_TOGGLE_BUTTON}"]`).click();
      }
      
      // Recarregar a página
      cy.reload();
      
      // Verificar se o tema persistiu
      cy.get('html').should('have.class', 'dark');
    });
  });

  it('should allow selecting system theme', () => {
    // Verificar se o dropdown de tema existe
    cy.get(`[data-cy="${DATA_TEST_IDS.THEME_DROPDOWN_BUTTON}"]`).should('exist').click();
    
    // Selecionar a opção de tema do sistema
    cy.get(`[data-cy="${DATA_TEST_IDS.THEME_OPTION('system')}"]`).click();
    
    // Verificar se a preferência foi salva
    cy.window().then(win => {
      const savedTheme = win.localStorage.getItem('theme');
      expect(savedTheme).to.equal('system');
    });
  });

  it('should take screenshots in different modes', () => {
    // Capturar screenshot no modo claro
    cy.get('html').then($html => {
      if ($html.hasClass('dark')) {
        cy.get(`[data-cy="${DATA_TEST_IDS.THEME_TOGGLE_BUTTON}"]`).click();
      }
      
      cy.wait(500); // Aguardar transição
      cy.screenshot('light-mode');
      
      // Alternar para modo escuro
      cy.get(`[data-cy="${DATA_TEST_IDS.THEME_TOGGLE_BUTTON}"]`).click();
      
      cy.wait(500); // Aguardar transição
      cy.screenshot('dark-mode');
    });
  });
}); 