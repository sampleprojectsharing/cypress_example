import { addCustomerPage } from '../../pages/administration/AddCustomerPage';
import { AddCustomerData } from '../../fixtures/customers/getDefaultData/CustomersData';
import { customersApiHelpers } from '../../helpers/apiHelpers/CustomersApiHelpers';
import { toastElements } from '../../pages/commonElements/ToastElements';

describe('UI test for Customer creation', function () {
  it('Create new Customer record and validate creation', function () {
    addCustomerPage.openPage();

    addCustomerPage
      .emailInputFillIn(AddCustomerData.companyEmail)
      .companyNameInputFillIn(AddCustomerData.companyName)
      .companyContactInputFillIn(AddCustomerData.companyContact)
      .saveButtonClick();

    toastElements.waitForSuccessToastInvisibility();

    customersApiHelpers.getCustomerEmail(AddCustomerData.companyName).then((customerEmail) => {
      assert.equal(
        customerEmail,
        AddCustomerData.companyEmail,
        `Validating that Customer with email "${AddCustomerData.companyEmail}" was created successfully`,
      );
    });
  });
});
