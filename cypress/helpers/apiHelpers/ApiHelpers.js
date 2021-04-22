/* eslint-disable */
import { localStorageHelpers } from '../LocalStorageHelpers';
import { environmentHelpers } from '../EnvironmentHelpers';

class ApiHelpers {
  api_basic_request(requestType, requestPath, payload = JSON.parse('{}'), isCoreApi = false, isFormData = false) {
    assert.isDefined(requestPath, 'Path is passed');
    // Get request url
    let baseUrl = Cypress.config().baseUrl;
    if (isCoreApi) {
      baseUrl = Cypress.env('baseApiUrl');
    }
    const full_url = `${baseUrl}${requestPath}`;
    // Log data
    cy.log(`Request link is: '${full_url}'`);
    cy.log(`Request payload is: '${JSON.stringify(payload)}'`);
    // Send request
    return cy
      .request({
        method: requestType,
        url: full_url,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'x-request-verification-token': environmentHelpers.getXRequestVerificationToken(),
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${localStorageHelpers.getSkyToken()}`,
        },
        form: isFormData,
        body: payload,
      })
      .then(($response) => {
        expect($response.body).not.null;
        cy.wrap($response.body);
      });
  }

  // API calls
  api_GET(requestPath, isCoreApi = false) {
    return this.api_basic_request('GET', requestPath, JSON.parse('{}'), isCoreApi);
  }

  api_POST_JSON_string_return_response_body(requestPath, payload, isCoreApi = false) {
    return this.api_basic_request('POST', requestPath, payload, isCoreApi);
  }

  api_PUT_JSON_string(requestPath, payload, isCoreApi) {
    return this.api_basic_request('PUT', requestPath, payload, isCoreApi);
  }

  // Form data API calls
  api_form_data_POST_JSON_string_return_response_body(requestPath, payload) {
    return this.api_basic_request('POST', requestPath, payload, true, true);
  }

  // HR API calls
  api_hr_basic_request(
    requestType,
    requestPath,
    payload = null,
    isFormData = false,
    wrapBody = true,
    failOnBad = true,
  ) {
    return cy
      .request({
        method: requestType,
        url: environmentHelpers.getHrBaseUrl() + requestPath,
        failOnStatusCode: failOnBad,
        headers: {
          'accept': 'application/json, text/plain, */*',
          'x-requested-with': 'XMLHttpRequest',
        },
        form: isFormData,
        body: payload,
      })
      .then((response) => {
        if (wrapBody === true) {
          cy.wrap(response.body);
        } else {
          cy.wrap(response);
        }
      });
  }

  api_hr_GET_return_response(requestPath, wrapBody = true) {
    return this.api_hr_basic_request('GET', requestPath, null, false, wrapBody);
  }

  api_hr_POST_JSON_string_return_response(requestPath, payload, isFormData, wrapBody, failOnBad) {
    return this.api_hr_basic_request('POST', requestPath, payload, isFormData, wrapBody, failOnBad);
  }
}

export default ApiHelpers;
