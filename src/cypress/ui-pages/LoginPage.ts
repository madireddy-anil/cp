class LoginPage {
  enterEmail(emailAddress) {
    const emailField = cy.get("input#1-email");
    emailField.focus().type(emailAddress, { log: false }).blur();
  }

  enterPassword(password) {
    const passwordField = cy.get("input[name='password']");
    passwordField.focus().type(password, { log: false }).blur();
  }

  clickLoginButton() {
    const loginButton = cy.xpath("//span[contains(text(), 'Log In')]");
    loginButton.should("be.visible").click();
  }

  enterOneTimePassword(secretKey) {
    cy.task("generateOTP", secretKey, { log: false }).then((token) => {
      cy.get("input[name='code']").type(token, { log: false }).blur();
    });
  }

  clickOTPLoginButton() {
    const loginButton = cy.get("button[type='submit']");
    loginButton.should("be.visible").click();
  }
}

export default LoginPage;
