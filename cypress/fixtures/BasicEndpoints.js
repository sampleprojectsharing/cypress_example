class BasicEndpoints {
  // Login endpoints
  static setUserNameUrl() {
    return '/api/User/Name';
  }

  static setLoginCompanyDefaultUrl() {
    return '/api/Company/LoginCompany/default';
  }

  static setTokenUrl() {
    return '/api/token';
  }

  // customers
  static getAllCustomersUrl() {
    return '/api/Company/All';
  }

  // HR Core
  static hrLoginCheckUrl() {
    return '/login_check';
  }

  static hrLogoutUrl() {
    return '/logout';
  }
}

export default BasicEndpoints;
