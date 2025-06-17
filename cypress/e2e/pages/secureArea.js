const h2Label = " Secure Area";
const h4Label = "Welcome to the Secure Area. When you are done click logout below.";

class SecureArea {
  constructor() {
    this.h2Text = "h2";
    this.h4SubHeader = "h4.subheader";
  }

  verifySecureLogin() {
    cy.get(this.h2Text).should("have.text", h2Label);
    cy.get(this.h4SubHeader).should("have.text", h4Label);   
  }
}

export default new SecureArea;