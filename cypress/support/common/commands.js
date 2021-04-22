require('cypress-downloadfile/lib/downloadFileCommand');

Cypress.Commands.overwrite('log', (args, primaryMessage, secondaryMessage) => {
  if (secondaryMessage) {
    primaryMessage = primaryMessage + ', ' + secondaryMessage;
  }

  cy.task('log', primaryMessage);
});

Cypress.Commands.add('upload_file', (fileName, selector, mimeType) => {
  return cy
    .get(selector)
    .then((subject) => {
      return cy
        .fixture(fileName, 'base64')
        .then(Cypress.Blob.base64StringToBlob)
        .then((blob) => {
          const el = subject[0];
          const testFile = new File([blob], fileName, { type: mimeType });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(testFile);
          el.files = dataTransfer.files;
          return subject;
        });
    })
    .trigger('change', { force: true });
});

Cypress.Commands.add('readPdf', (fileName) => {
  cy.log(`Reading PDF file "${fileName}"`);
  return cy.task('getDownloadPath').then((pathToFolder) => {
    return cy.task('getPdfContent', `${pathToFolder}/${fileName}`);
  });
});

Cypress.Commands.add('modifyExcelSheet', (sheetPath, cellAddress, newCellText) => {
  return cy.task('modifyExcelSheet', { sheetPath, cellAddress, newCellText });
});

Cypress.Commands.add('getExcelSheetCellValue', (sheetPath, cellAddress) => {
  return cy.task('getExcelSheetCellValue', { sheetPath, cellAddress });
});

/**
 * @return Cypress.Chainable<any>
 */
Cypress.Commands.add('generateOTP', (secret) => {
  return cy.task('generateOTP', secret.toString().replace(/-/g, ''));
});
