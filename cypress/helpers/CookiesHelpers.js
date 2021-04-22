class CookiesHelpers {
  setAndPreserveCookiesFromModel(cookiesModel) {
    for (const key in cookiesModel) {
      if (Object.prototype.hasOwnProperty.call(cookiesModel, key)) {
        cy.setCookie(key, cookiesModel[key]);
      }
    }
    return this.preserveCookies();
  }

  preserveCookies() {
    return cy.getCookies().then((cookies) => {
      if (cookies.length !== 0) {
        for (const key in cookies) {
          if (Object.prototype.hasOwnProperty.call(cookies, key)) {
            Cypress.Cookies.preserveOnce(cookies[key].name);
          }
        }
      }
    });
  }
}

export default CookiesHelpers;
