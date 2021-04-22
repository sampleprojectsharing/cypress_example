import ApiHelpers from './ApiHelpers';
import BasicEndpoints from '../../fixtures/BasicEndpoints';

class CustomersApiHelpers extends ApiHelpers {
  getAllCustomers() {
    return super.api_GET(BasicEndpoints.getAllCustomersUrl());
  }

  getCustomerEmail(companyName) {
    return this.getAllCustomers().then((customersArray) => {
      for (const customer of customersArray) {
        const model = {
          Name: '',
          UserName: '',
        };
        Object.assign(model, customer);
        if (model.Name === companyName) {
          return model.UserName;
        }
      }
    });
  }
}

export const customersApiHelpers = new CustomersApiHelpers();
