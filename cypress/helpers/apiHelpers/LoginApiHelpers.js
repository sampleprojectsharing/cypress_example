import { LoginData } from '../../fixtures/LoginData';
import BasicEndpoints from '../../fixtures/BasicEndpoints';
import CookiesHelpers from '../CookiesHelpers';
import { localStorageHelpers } from '../LocalStorageHelpers';
import ApiHelpers from './ApiHelpers';
import TokenHelpers from './TokenHelpers';

const userNameResponseModel = {
  ApplicationId: '',
  UserId: '',
  UserName: '',
  LoweredUserName: '',
  LastActivityDate: '',
  LastCompanyUsed: '',
  UserRole: '',
  ChangePassword: true,
  IsMfaEnabled: false,
  IsMfaMandatory: true,
  NeedMfaChallenge: false,
};

const loginCompanyDefaultModel = {
  0: [
    {
      Username: '',
      ValidUser: true,
      RedirectRegion: '',
      CompanyID: '',
      UserId: '',
      LastActivityDate: '',
      TaxCountry: '',
    },
  ],
};

class LoginApiHelpers extends ApiHelpers {
  loginViaApi(username = LoginData.username, password = LoginData.password) {
    return this.apiPostUserName(username, password).then((userNameResponseBody) => {
      this.apiPutLoginCompanyDefault(userNameResponseBody.LastCompanyUsed, username, password).then(
        (loginCompanyDefaultResponseBody) => {
          const mappedLoginCompanyResponse = loginCompanyDefaultModel;
          Object.assign(mappedLoginCompanyResponse, loginCompanyDefaultResponseBody);
          return this.apiPostToken(btoa(userNameResponseBody.UserId), mappedLoginCompanyResponse['0'].LastActivityDate);
        },
      );
    });
  }

  apiPostUserName(username, password) {
    const moment = Cypress.moment();
    moment.add(1, 'day');

    const requestPayload = {
      UserName: `${btoa(`${username}:${password}`)}`,
    };

    return super
      .api_POST_JSON_string_return_response_body(BasicEndpoints.setUserNameUrl(), requestPayload)
      .then((response) => {
        const mappedResponseBody = userNameResponseModel;
        Object.assign(mappedResponseBody, response);

        // setting and preserving cookies
        this.setAndPreserveCookies(mappedResponseBody);

        // setting localStorage data
        this.setLocalStorageItems(mappedResponseBody, moment.toISOString(), username);

        return cy.wrap(mappedResponseBody);
      });
  }

  apiPutLoginCompanyDefault(lastCompanyUsedId, username, password) {
    const body = {
      credentials: `${btoa(`${username}:${password}`)}`,
      thirdpartyUser: 'default',
      lastCompanyUsed: lastCompanyUsedId,
    };
    return super.api_PUT_JSON_string(BasicEndpoints.setLoginCompanyDefaultUrl(), body).then(($response) => {
      return cy.wrap($response);
    });
  }

  apiPostToken(userIdBase64, lastActivityDateBase64) {
    return super
      .api_form_data_POST_JSON_string_return_response_body(BasicEndpoints.setTokenUrl(), {
        username: userIdBase64,
        password: lastActivityDateBase64,
      })
      .then(($response) => {
        return localStorage.setItem('sky_token', JSON.stringify($response));
      });
  }

  setLocalStorageItems(responseBodyModel, moment, username) {
    const localStorageModel = {
      userID: '',
      userKey: '',
      companyID: '',
      localStorageExpirations: '',
    };
    localStorageModel.userID = btoa(username);
    localStorageModel.userKey = responseBodyModel.UserId;
    localStorageModel.companyID = responseBodyModel.LastCompanyUsed;
    localStorageModel.localStorageExpirations =
      `userID^${moment}|userKey^${moment}|companyID^${moment}` + `|SelectedPayCycle^${moment}`;

    localStorageHelpers.setLocalStorageData(localStorageModel);
  }

  setAndPreserveCookies(responseBodyModel) {
    const cookiesModel = {
      companyID: '',
      thirdpartyUser: 'default',
      skyApiPath: '',
    };
    cookiesModel.companyID = responseBodyModel.LastCompanyUsed;
    cookiesModel.skyApiPath = `${Cypress.env('baseCoreApiUrl')}/`;

    new CookiesHelpers().setAndPreserveCookiesFromModel(cookiesModel);
  }

  // HR Core
  hrcLoginCheck(csrfToken, username, password) {
    const payload = {
      _username: username,
      _password: password,
      _csrf_token: csrfToken,
    };
    return super.api_hr_POST_JSON_string_return_response(BasicEndpoints.hrLoginCheckUrl(), payload, true, false, false);
  }

  hrcSetSessionCookies(loginCheckResponse) {
    for (const headerElement of loginCheckResponse.headers['set-cookie']) {
      cy.setCookie(headerElement.toString().split('=')[0], headerElement.toString().split('=')[1].split(';')[0], {
        domain: 'test.com',
      });
    }
  }

  hrcLogOut() {
    return super.api_hr_GET_return_response(BasicEndpoints.hrLogoutUrl(), false).then((response) => {
      const responseModel = {
        status: '',
      };
      Object.assign(responseModel, response);
      assert.equal(
        responseModel.status,
        200,
        `Validating that HRC Logout response status is OK. Expected: 200, actual: ${responseModel.status}`,
      );
    });
  }

  hrcLogInAs(credentials, isLogOut = true) {
    if (isLogOut) {
      this.hrcLogOut();
    }
    return new TokenHelpers().hrcGetCsrfToken().then((csrfToken) => {
      return this.hrcLoginCheck(csrfToken, credentials.username, credentials.password).then((response) => {
        if (response.body.success === false) {
          return this.hrcLogInAs(credentials, isLogOut);
        } else {
          this.hrcSetSessionCookies(response);
        }
      });
    });
  }
}

export default LoginApiHelpers;
