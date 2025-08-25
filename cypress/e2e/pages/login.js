
import secureArea from "../pages/secureArea";
import { LoginHelpers } from "../../support/pages/LoginHelpers";

const loginHelper = new LoginHelpers();

class Login {
  constructor() {
    this.textErrorMsg = "div#flash";
  }
  userLogin(username, password, errorText="", buttonText, isValidLogin = false, ) {
    loginHelper.login("Username", username, password, buttonText);
    cy.get(this.textErrorMsg).should("contains.text", errorText);
    if(isValidLogin){
        cy.url().should("contains", "/secure");
        secureArea.verifySecureLogin();
    } 
  }
}

export default new Login;