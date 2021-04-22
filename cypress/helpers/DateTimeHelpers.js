class DateTimeHelpers {
  getYyyyMmDdHhMmFormattedDate(dateToFormat) {
    return Cypress.moment(dateToFormat).format('YYYY-MM-DD_HH:mm');
  }

  getCurrentMoment() {
    return Cypress.moment();
  }
}

export const dateTimeHelpers = new DateTimeHelpers();
