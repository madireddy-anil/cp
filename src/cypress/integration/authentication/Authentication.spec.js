/// <reference types="cypress" />
import LoginPage from "../ui-pages/LoginPage";
const lp = new LoginPage();

describe("Authenticate User", () => {
  beforeEach(() => {
    cy.viewport(1536, 960);
    cy.visit(Cypress.env("baseUrl") + "/login");
    lp.enterEmail(Cypress.env("EMAIL"));
    lp.enterPassword(Cypress.env("PASSWORD"));
    lp.clickLoginButton();
    lp.enterOneTimePassword(Cypress.env("TOTP_KEY"));
    lp.clickOTPLoginButton();
  });

  it("Log variables", () => {
    cy.log(Cypress.env());
  });
});
