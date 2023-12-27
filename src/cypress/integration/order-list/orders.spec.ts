// import LoginPage from "../../ui-pages/LoginPage";
// const lp = new LoginPage();

// describe("login", () => {
//   it("should successfully log into our app", () => {
//     cy.login()
//       .then((resp) => {
//         return resp.body;
//       })
//       .then((body) => {
//         const { access_token, expires_in, id_token } = body;
//         console.log(body);
//         cy.log(`BODY:  ${body}`);

//         const auth0State = {
//           nonce: "",
//           state: "some-random-state"
//         };
//         const callbackUrl = `/callback#access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;
//         cy.visit(callbackUrl, {
//           onBeforeLoad(win) {
//             win.document.cookie =
//               "com.auth0.auth.some-random-state=" + JSON.stringify(auth0State);
//           }
//         });
//       });
//   });
// });

// describe("Check orders", () => {
//   it("Should Login and go to orders page", () => {
//     cy.viewport(1536, 960);
//     cy.visit(Cypress.env("baseUrl") + "/orders");
//     lp.enterEmail(Cypress.env("EMAIL"));
//     lp.enterPassword(Cypress.env("PASSWORD"));
//     lp.clickLoginButton();
//     lp.enterOneTimePassword(Cypress.env("TOTP_KEY"));
//     lp.clickOTPLoginButton();
//     // cy.wait(30000);

//     // Use Mocked data
//     cy.intercept(
//       "GET",
//       "https://pp-efx-orders.tst.payperform.com/orders?limit=0",
//       {
//         fixture: "orders.json"
//       }
//     ).as("getOrders");

//     // Go to orders page
//     cy.get(".ant-menu-title-content").within(() => {
//       cy.get("a").contains("Exotic FX").click();
//     });

//     // Wait orders to load
//     cy.wait("@getOrders").then((inter) => {
//       cy.log(JSON.stringify(inter));
//       console.log(JSON.stringify(inter));
//     });
//   });

// it("Should go to /order/deposit page after clicking 'New EFX Order' button", () => {
//   cy.get("button.button_button__jfsN5").contains("New EFX Order").click();

//   cy.location().should((location) => {
//     expect(location.pathname).to.eq("/order/deposit");
//   });
// });

// it("Should open filters after clicking 'Filters' button", () => {
//   cy.get("button.button_button__jfsN5").contains("Filters").click();
//   cy.get(".ant-drawer").should("have.class", "ant-drawer-open");
// });

// it("Should Show a list of orders on the table", () => {
//   cy.get(".ant-picker-range input[placeholder*='From Date']")
//     .focus()
//     .type("2022-04-14");

//   cy.get(".ant-picker-range input[placeholder*='To Date']")
//     .focus()
//     .type("2022-04-16");

//   cy.get(".ant-drawer-body button.button_button__jfsN5")
//     .eq(1)
//     .focus()
//     .click();
// });

// it("Should Show an empty list of orders on the table", () => {});

// it("Should filter by execution Date Range", () => {});

// it("Should filter by Client", () => {});

// it("Should filter by Account Type", () => {});

// it("Should filter by Order Reference", () => {});

// it("Should filter by Deposit Currency", () => {});

// it("Should filter by Amount", () => {});

// it("Should filter by Status", () => {});
// });
