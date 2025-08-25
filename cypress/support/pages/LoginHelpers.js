// cypress/support/pages/LoginHelpers.js

import { ElementHelpers } from './ElementHelpers';

const helpers = new ElementHelpers();

export class LoginHelpers extends ElementHelpers {

  /**
   * Login with email and password using label, div text, placeholder, or generic selectors
   * @param {string} email - The email to enter
   * @param {string} password - The password to enter
   */
  login(elementLabel, email, password, buttonText) {
    cy.get('body').then($body => {
      if ($body.find('label:contains("' + elementLabel + '")').length) {
        this.loginByLabel(elementLabel, email, password, buttonText);
      } else if ($body.find('div:contains("' + elementLabel + '")').length) {
        this.loginByDivText(elementLabel, email, password, buttonText);
      } else if ($body.find('input[placeholder*="' + elementLabel + '")').length) {
        this.loginByPlaceholder(elementLabel, email, password, buttonText);
      } else {
        this.loginGeneric(email, password, buttonText);
      }
    });
  }
  
  
  /**
   * Login with email and password using labels
   * @param {string} email - The email to enter
   * @param {string} password - The password to enter
   */
  loginByLabel(elementLabel, email, password, buttonText) {
    helpers.typeIntoField(elementLabel, email);
    helpers.typeIntoField("Password", password);
    helpers.clickButton(buttonText);
  }

  /**
   * Login using div text as parent selector (for frameworks without labels)
   * @param {string} email - The email to enter
   * @param {string} password - The password to enter
   */
  loginByDivText(elementLabel, email, password, buttonText) {
    // Find email field by looking for div containing "Email" text, then find input
    helpers.getChildByParentText('div', elementLabel, 'input').clear().type(email);
    helpers.getChildByParentText('div', 'Password', 'input').clear().type(password);
    helpers.clickButton(buttonText);
  }


  /**
   * Alternative login method using placeholder text
   * @param {string} email - The email to enter
   * @param {string} password - The password to enter
   */
  loginByPlaceholder(elementLabel, email, password, buttonText) {
    helpers.typeInputWithPlaceholder(elementLabel, email);
    helpers.typeInputWithPlaceholder("Password", password);
    helpers.clickButton(buttonText);
  }

  /**
   * Login using generic input selectors (fallback method)
   * @param {string} email - The email to enter
   * @param {string} password - The password to enter
   */
  loginGeneric(user, password, buttonText) {
    cy.get('input[type="text"], input[type="email"]').first().clear().type(user);
    cy.get('input[type="password"]').first().clear().type(password);
    helpers.clickButton(buttonText);
  }
}