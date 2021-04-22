import ApiHelpers from './ApiHelpers';
import { BasicUrls } from '../../fixtures/BasicUrls';
import { environmentHelpers } from '../EnvironmentHelpers';

class TokenHelpers {
  visitPageAndSetHeaderVerificationToken(pageUrl = BasicUrls.dashboardPageUrl) {
    new ApiHelpers().api_GET(pageUrl).then((pageSource) => {
      const page = document.createElement('html');
      page.innerHTML = pageSource.toString();
      const token = page.getElementsByTagName('input')[0].getAttribute('value');
      environmentHelpers.setXRequestVerificationToken(token);
    });
  }

  hrcGetCsrfToken() {
    return new ApiHelpers().api_hr_GET_return_response('/').then((body) => {
      const csrfToken = Cypress.$(body.toString()).find('[name="_csrf_token"]').val();
      cy.wrap(csrfToken);
    });
  }
}

export default TokenHelpers;
