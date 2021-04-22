import BasePage from '../BasePage';
import { BasicUrls } from '../../fixtures/BasicUrls';

const addCustomerPageLocators = {
  emailInputLocator: '#emailAddress',
  companyNameInputLocator: '#companyName',
  companyContactInputLocator: '#companyContact',
  saveButtonLocator: '#create',
};

class AddCustomerPage extends BasePage {
  openPage() {
    return cy.visit(BasicUrls.administration.addCustomerPageUrl);
  }

  emailInputFillIn(textToType) {
    super.clearInputElementAndTypeText(addCustomerPageLocators.emailInputLocator, textToType);
    return this;
  }

  companyNameInputFillIn(textToType) {
    super.clearInputElementAndTypeText(addCustomerPageLocators.companyNameInputLocator, textToType);
    return this;
  }

  companyContactInputFillIn(textToType) {
    super.clearInputElementAndTypeText(addCustomerPageLocators.companyContactInputLocator, textToType);
    return this;
  }

  saveButtonClick() {
    return super.clickElementByElementLocator(addCustomerPageLocators.saveButtonLocator);
  }
}

export const addCustomerPage = new AddCustomerPage();
