import BasePage from '../BasePage';

const toastElementsLocators = {
  successToastElementLocator: 'div.toast-success',
};

class ToastElements extends BasePage {
  waitForSuccessToastInvisibility() {
    cy.get(toastElementsLocators.successToastElementLocator).should('exist');
    return cy.get(toastElementsLocators.successToastElementLocator).should('not.exist');
  }
}

export const toastElements = new ToastElements();
