/// <reference types="cypress" />

import login from "../pages/login";

describe('Regression test for Login module', () => {

   beforeEach(() => {
    cy.visit("/login");
  });

  it  ('As a user, should be able to successfully login with valid credentials', () => {
    login.userLogin(Cypress.env("USERNAME"), Cypress.env("PASSWORD"), "You logged into a secure area!", "Login", true,);
  })

  it('As a user, should show correct validation for failed login with invalid username', () => {
    login.userLogin("invalidUserName", Cypress.env("PASSWORD"), "Your username is invalid!", "Login");
  })

  it('As a user, should show correct validation for failed login with invalid password', () => {
    login.userLogin(Cypress.env("USERNAME"), "invalidPassword", "Your password is invalid!", "Login");
  })
})