/// <reference types="cypress" />

export {};

describe('Test forecast page', () => {

   beforeEach(() => {
      cy.visit('http://localhost:4200');
      cy.get('[data-cy=clear-cache]').click();
      cy.get('[data-cy=remove-locations]').click();
      cy.visit('http://localhost:4200/forecast/10001');
   });

   it('Test page load', () => {
      cy.get('[data-cy=forecast-title]').should('be.visible');
   });

   it('Test Back to main page button', () => {
      cy.wait(1000);
      cy.get('[data-cy=back-button]').click();
      cy.location('pathname').should('not.include', 'forecast');
   });

});