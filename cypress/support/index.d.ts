/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Assigns file to the file input
     * @example
     * cy.upload_file('/pathToFileFromFixturesFolder/file.txt', 'input.file-upload', 'text/plain')
     */
    upload_file(filePath: string, inputLocator: string, fileMimeType: string): Chainable<any>;
    getDownload(filePath: string): Chainable<any>;
    readPdf(filePath: string): String;
    generateOTP(secret: string): Chainable<any>;
    modifyExcelSheet(sheetPath: string, cellAddress: string, newCellText: string): null;
    getExcelSheetCellValue(sheetPath: string, cellAddress: string): null;
  }
}
