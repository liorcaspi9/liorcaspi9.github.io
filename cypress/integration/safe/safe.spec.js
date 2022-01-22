/// <reference types="cypress" />

describe('example to-do app', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
    })

    it('Safe should show "1---" when clicking 1', () => {
        cy.get('.keypad-wrapper > :nth-child(1)').click();
        cy.get('.digit').should('have.text', '1---');
    })

    it('Safe should show "11--" when clicking 11', () => {
        cy.get('.keypad-wrapper > :nth-child(1)').click();
        cy.get('.keypad-wrapper > :nth-child(1)').click();
        cy.get('.digit').should('have.text', '11--');
    })

    it('Safe should show "111-" when clicking 111', () => {
        cy.get('.keypad-wrapper > :nth-child(1)').click();
        cy.get('.keypad-wrapper > :nth-child(1)').click();
        cy.get('.keypad-wrapper > :nth-child(1)').click();
        cy.get('.digit').should('have.text', '111-');
    })

    it('Safe should not open with incorrect code', () => {
        cy.intercept(
            {
                method: 'GET',
                url: 'http://localhost:3001/correctCode',
            },
            ["1234"]
        ).as('getCode')
        cy.get('.keypad-wrapper > :nth-child(1)').click();
        cy.get('.keypad-wrapper > :nth-child(1)').click();
        cy.get('.keypad-wrapper > :nth-child(1)').click();
        cy.get('.keypad-wrapper > :nth-child(1)').click();
        cy.get('.digit').should('have.text', '****')
    })

    it('Safe should open with correct code', () => {
        cy.intercept(
            {
                method: 'GET',
                url: 'http://localhost:3001/correctCode',
            },
            ["1234"]
        ).as('getCode')
        cy.get('.keypad-wrapper > :nth-child(1)').click();
        cy.get('.keypad-wrapper > :nth-child(2)').click();
        cy.get('.keypad-wrapper > :nth-child(3)').click();
        cy.get('.keypad-wrapper > :nth-child(4)').click();
        cy.get('.door-Wrapper').should('have.class', 'open')
    })

    it('Safe should show error when server is down', () => {
        cy.intercept(
            {
                method: 'GET',
                url: 'http://localhost:3001/correctCode',
            },
            { statusCode: 401 }
        ).as('getCode')
        cy.get('.keypad-wrapper > :nth-child(1)').click();
        cy.get('.keypad-wrapper > :nth-child(2)').click();
        cy.get('.keypad-wrapper > :nth-child(3)').click();
        cy.get('.keypad-wrapper > :nth-child(4)').click();
        cy.get('.digit').should('have.text', 'err1')
        cy.get('.digit').should('have.text', '----')
    })
})