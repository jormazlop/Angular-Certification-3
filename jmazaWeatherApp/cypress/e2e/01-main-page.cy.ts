/// <reference types="cypress" />

export {};

describe('Test Main Page', () => {

   beforeEach(() => {
      cy.visit('http://localhost:4200');
      cy.get('[data-cy=clear-cache]').click();
      cy.get('[data-cy=remove-locations]').click();
   });

   it('Test page load', () => {
      cy.get('.well h2').should('be.visible');
      cy.get('.well h2').contains('Enter a zipcode:');
   });

   it('Add a empty location', () => {
      cy.get('[data-cy=add-location]').click();
      cy.wait(1000);
      cy.get('[data-cy=error-message]').should('be.visible');
      cy.get('[data-cy=error-message]').contains('Incorrect Search!');
   });

   it('Search for non-existent zip', () => {
      cy.intercept('GET', 'weather?zip=11111**').as('getLocation');
      cy.get('[data-cy=input-location]').type('11111');
      cy.get('[data-cy=add-location]').click();
      cy.wait('@getLocation').its('response.statusCode').should('eq', 404);
   });

   it('Search existing zip code', () => {
      cy.intercept('GET', 'weather?zip=10001**').as('getLocation');
      cy.get('[data-cy=input-location]').type('10001');
      cy.get('[data-cy=add-location]').click();
      cy.wait('@getLocation').its('response.statusCode').should('eq', 200);
   });

   it('Search 2 times, first call made, second is cached', () => {
      cy.intercept('GET', 'weather?zip=11111**', cy.spy().as('locationSpy'));
      cy.get('[data-cy=input-location]').type('11111');
      cy.get('[data-cy=add-location]').click();
      cy.get('@locationSpy').its('callCount').should('equal', 1);
      cy.get('[data-cy=add-location]').click();
      cy.get('@locationSpy').its('callCount').should('equal', 1);
   });

   it('Search 2 times, first call made, then click on clean cache buton, then second call is also made', () => {
      cy.intercept('GET', 'weather?zip=11111**', cy.spy().as('locationSpy'));
      cy.get('[data-cy=input-location]').type('11111');
      cy.get('[data-cy=add-location]').click();
      cy.get('@locationSpy').its('callCount').should('equal', 1);
      cy.wait(1000);
      cy.get('[data-cy=clear-cache]').click();
      cy.get('[data-cy=add-location]').click();
      cy.get('@locationSpy').its('callCount').should('equal', 2);
   });

   it('Search 2 times, first call made, then set refresh cache in one second and wait 2 seconds, then second call is also made', () => {
      cy.intercept('GET', 'weather?zip=11111**', cy.spy().as('locationSpy'));
      cy.get('[data-cy=input-location]').type('11111');
      cy.get('[data-cy=add-location]').click();
      cy.get('@locationSpy').its('callCount').should('equal', 1);
      cy.wait(1000);
      cy.get('[data-cy=update-cache-input]').clear().type('1');
      cy.get('[data-cy=update-cache]').click();
      cy.wait(2000);
      cy.get('[data-cy=add-location]').click();
      cy.get('@locationSpy').its('callCount').should('equal', 2);
   });

});