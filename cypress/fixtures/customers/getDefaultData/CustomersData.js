import { dateTimeHelpers } from '../../../helpers/DateTimeHelpers';

let dateTimeValue = dateTimeHelpers.getYyyyMmDdHhMmFormattedDate(dateTimeHelpers.getCurrentMoment());
dateTimeValue = dateTimeValue.replace(':', '-');

export const AddCustomerData = {
  companyEmail: `test_customer_${dateTimeValue}@test.com`,
  companyName: `test_customer_${dateTimeValue}`,
  companyContact: 'Test customer',
};
