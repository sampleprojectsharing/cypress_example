const { onTaskCleanDownloads } = require(`./downloads`);
const { downloadFile } = require('cypress-downloadfile/lib/addPlugin');
const fs = require('fs');
const pdf = require('pdf-parse');
const XLSX = require('xlsx');

const parsePdf = async (absolutePdfPathname) => {
  const dataBuffer = fs.readFileSync(absolutePdfPathname);
  return await pdf(dataBuffer); // use async/await since pdf returns a promise
};

const getPdfContent = async (absolutePdfPathname) => {
  const pdf = await parsePdf(absolutePdfPathname);

  return pdf.text;
};

const readExcelSheet = (sheetPath) => {
  return XLSX.readFile(sheetPath);
};

const getExcelSheetCellValue = ({ sheetPath, cellAddress }) => {
  const workbook = readExcelSheet(sheetPath);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  return worksheet[cellAddress].v;
};

const modifyExcelSheet = ({ sheetPath, cellAddress, newCellText }) => {
  const workbook = readExcelSheet(sheetPath);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  worksheet[cellAddress].v = newCellText;
  workbook.Sheets[firstSheetName] = worksheet;
  XLSX.writeFile(workbook, sheetPath);
  return null;
};

module.exports = (on, config) => {
  on('task', {
    log(message) {
      // eslint-disable-next-line no-console
      console.log(message);
      return null;
    },
    ...onTaskCleanDownloads(config),
    getPdfContent,
    downloadFile,
    generateOTP: require('cypress-otp'),
    modifyExcelSheet,
    getExcelSheetCellValue,
  });
};
