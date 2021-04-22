import './common/commands';
import 'cypress-file-upload';
import 'cypress-axe';
import LoginApiHelpers from '../helpers/apiHelpers/LoginApiHelpers';
import TokenHelpers from '../helpers/apiHelpers/TokenHelpers';
import CookiesHelpers from '../helpers/CookiesHelpers';
import { environmentHelpers } from '../helpers/EnvironmentHelpers';
require('cypress-xpath');

Cypress.moment = require('moment-timezone');

// screenshots configuration
Cypress.Screenshot.defaults({
  trashAssetsBeforeRuns: true,
  disableTimersAndAnimations: false,
  scale: true,
  size: '15 kb',
  dimensions: {
    width: 1024,
    height: 660,
  },
  capture: 'runner',
});

// To turn off all uncaught exception handling
Cypress.on('uncaught:exception', (err, runnable) => {
  /* jshint -W087 */
  debugger;
  // cy.log('Uncaught exception', err);
  return false;
});

Cypress.on('fail', (error, runnable) => {
  /* jshint -W087 */
  debugger;
  throw error; // throw error to have test still fail
});

// adding screenshots to the report
const addContext = require('mochawesome/addContext');
Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    const screenshotFileName = `${runnable.parent.title} -- ${test.title} (failed).png`;
    addContext(
      {
        test,
      },
      `assets/${Cypress.spec.name}/${screenshotFileName}`,
    );
  }
});

Cypress.LocalStorage.clear = function (keys, ls, rs) {};

const cookiesHelpersObj = new CookiesHelpers();
before(function () {
  cy.clearCookies()
    .then(() => {
      localStorage.clear();
      environmentHelpers.setCompanyName('');
      environmentHelpers.setCompanyId('');
    })
    .then(() => {
      new LoginApiHelpers()
        .loginViaApi()
        .then(() => {
          new TokenHelpers().visitPageAndSetHeaderVerificationToken();
        })
        .then(() => {
          cookiesHelpersObj.preserveCookies();
        });
    });
});

beforeEach(function () {
  cookiesHelpersObj.preserveCookies();
});
