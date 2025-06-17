
import secureArea from "../pages/secureArea";

class Login {
  constructor() {
    this.formLogin = "form#login";
    this.inputUserName = "input#username";
    this.inputPassword = "input#password";
    this.buttonLogin = "button[type='submit']";
    this.textErrorMsg = "div#flash";

  }
  userLogin(username, password, errorText="", isValidLogin = false) {
    cy.get(this.formLogin, {timeout: 60000}).should("be.visible");
    cy.get(this.inputUserName).clear().type(username, {force: true});
    cy.get(this.inputPassword).clear().type(password, {force: true});
    cy.get(this.buttonLogin).click();
    cy.get(this.textErrorMsg).should("contains.text", errorText);
    if(isValidLogin){
        cy.url().should("contains", "/secure");
        secureArea.verifySecureLogin();
    } 
  }
}

export default new Login;