class EnvironmentHelpers {
  getCompanyNameEnvironmentKey() {
    return 'companyName';
  }

  getCompanyIdEnvironmentKey() {
    return 'companyId';
  }

  getXRequestVerificationTokenEnvironmentKey() {
    return 'x-request-verification-token';
  }

  setCompanyName(companyName) {
    return Cypress.env(this.getCompanyNameEnvironmentKey(), companyName);
  }

  setCompanyId(companyId) {
    return Cypress.env(this.getCompanyIdEnvironmentKey(), companyId);
  }

  getXRequestVerificationToken() {
    return Cypress.env(this.getXRequestVerificationTokenEnvironmentKey());
  }

  setXRequestVerificationToken(token) {
    return Cypress.env(this.getXRequestVerificationTokenEnvironmentKey(), token);
  }

  getHrBaseUrl() {
    return Cypress.env('baseHrCoreUrl');
  }
}

export const environmentHelpers = new EnvironmentHelpers();
