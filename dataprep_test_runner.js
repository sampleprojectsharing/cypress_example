const cypress = require('cypress');
const yargs = require('yargs');
const { merge } = require('mochawesome-merge');
const marge = require('mochawesome-report-generator');
const rm = require('rimraf');
const cypressConfig = require('./cypress');
const ls = require('ls');
const scriptsdir = cypressConfig.integrationFolder;
const argv = yargs
  .options({
    browser: {
      alias: 'b',
      describe: 'choose the browser for test execution',
      default: 'chrome',
      choices: ['chrome', 'electron'],
    },
    spec: {
      alias: 's',
      describe: 'run test with specific file or sequence',
      default: 'cypress/integration/DataPreparation/*.js',
    },
    configFile: {
      alias: 'e',
      describe: 'run on specific environment',
      default: 'cypress/cypress-preprod.json',
    },
  })
  .help().argv;

const reportDir = require('./' + cypressConfig.reporterOptions.configFile);
const reportFiles = `${reportDir.mochawesomeReporterOptions.reportDir}/*.json`;

// list and delete all existing report files
ls(
  reportFiles,
  {
    recurse: true,
  },
  (file) => console.log(`removing ${file.full}`),
);
rm(reportFiles, (error) => {
  if (error) {
    console.error(`Error while removing existing report files: ${error}`);
    process.exit(1);
  }
  console.log('Removing all existing report files successfully!');
});

cypress
  .run({
    browser: argv.browser,
    spec: argv.spec,
    configFile: argv.configFile,
  })
  .then((results) => {
    const reporterOptions = {
      reportDir: results.config.reporterOptions.reportDir,
    };
    generateReport(reporterOptions);
  })
  .catch((error) => {
    console.error('errors: ', error);
    process.exit(1);
  });

// merging all the generated reports for each test
function generateReport(options) {
  return merge(options).then((report) => {
    marge.create(report, options);
  });
}
