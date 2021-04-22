# General Description

The goal of this test framework is to cover test application (AUT) with automation tests.

# Requirements

Requires `Node.js` and `npm` to be installed

# Installation

The following steps assume you are creating a folder named `cypress_test`. Feel free to change the name
according to your liking

```bash
mkdir cypress_test
cd cypress_test
git clone git@bitbucket.org:cypress_test.git .
npm install
npm install --save-dev
```

# How to Run Cypress Tests

You can find `npm` scripts in the "scripts" section of the `package.json` file. There are different scripts to open 
Cypress Runner or to run tests depending on your chosen environment

For example:

```bash
./node_modules/.bin/cypress run --config-file cypress/cypress-dev.json
```

# Framework Philosophy

### General Principles

This framework is inspired by popular [Page Object design pattern](https://www.selenium.dev/documentation/en/guidelines_and_recommendations/page_object_models/).
Test scripts are divided from the page elements locators, page interaction logic, API requests etc. Each test should
match a common test design structure and contain so called "Three-A" parts:

- **arrange**, which means some preconditions, like log in the app, create all necessary data, clear variables etc.
- **act**, or app interactions, i.e., perform some actions which result we want to test
- **assert**, that is the test itself; commonly it's a validation of the current AUT state

Ideally, test should only contain other classes methods calls and use test data stored in fixtures or obtained from
helper classes. There shouldn't be any logic implementation inside the test script.

Other important principles that are considered while implementing this test framework are [SOLID](https://www.baeldung.com/solid-principles)
and [OOP principles](https://www.indeed.com/career-advice/career-development/what-is-object-oriented-programming).
Each class should only contain methods to work with the specific task, e.g., all datetime-related operations should be
stored in the specific `DateTimeHelper` object - but this object shouldn't contain anything else. Each page class 
should contain only page elements like locators, getters and simple operations (click, type, open etc.) and 
should not have any complicated actions. Complex actions should be moved to a proper helper file (i.e., to store 
login actions chain you should create `LoginHelper` instead of putting "type email - type password - click login button" 
chain in the separate method in `LoginPage` class).

If some classes have similar purpose and may use similar methods(e.g.: all API helpers use same API request logic) then 
a parent class should be created to group the similar classes. This parent class should be used to inherit and reuse 
the methods. Examples can be found in all page classes and API helpers.

For other cases as well, try using SOLID and OOP principles as much as possible.

### Framework Structure

- Root folder. Contains `eslintrc`, `jshintrc` and `prettierrc` files for code linters; `cypress.json` for basic Cypress
  configuration; `dataprep_test_runner.js` for running tests in command line (Jenkins);`reporterConfig.json` for
  "mochawesome-report" plugin
    - _cypress_ folder. Main project folder. Contains `cypress-{environmentName}.json` files for different environments'
      configuration; `jsconfig.json` to describe which modules to import; all main project folders
        - _fixtures_ folder. Contains files with basic URLs, API endpoints, aliases to wait for (i.e., aliases for page
        load and popup load) and data to log in the app. Also, it contains sub-folders with test data, files to import
        and files to store data
            - entity-named folders. Are used to divide test data according to the entity to which they belong
                - _getDefaultData_ folder. Contains .js file with test data variables, i.e., Employees names, payment
                  values etc.
                - _importData_ folder. Contains files that will be imported to the AUT during some test
                - _saveData_ folder. Is used to write data that will be used later to the .json file
        - _helpers_ folder. Is used to store different helper files divided by purpose of use: `CookiesHelpers.js` 
        contains methods to work with cookies; `EnvironmentHelpers.js` contains methods to operate with **Cypress.env()** 
        global variables; `FileHelpers.js` is used to store file paths, mime-types and perform some file-related actions;
        `FixtureHelpers.js` contains methods to read/write fixtures; `LocalStorageHelpers.js` is used to operate with 
        browser local storage; `TestHelpers.js` contains methods to make assertions for common cases in tests
            - _apiHelpers_ folder. Is used to store various API helper files. All API helper classes extend 
            `ApiHelpers.js` class to re-use parent methods. Filename convention: `(optional){entityName}ApiHelpers.js`
        - _integration_ folder. Contains test files. Test file name convention: `{testNumber in 001 format}. {testName}Test.js`
        - _pages_ folder. Contains `BasePage.js` file with methods that are used in page classes and sub-folders (named
        by AUT section or elements group) with page classes that extend `BasePage` class. Page file name convention:
        `{pageName}Page.js`. As mentioned above, page classes should only contain page element locators and simple
        methods to interact with the page and its elements
        - _plugins_ folder. Contains files to export connected plugins
        - _support_ folder. Contains `index.js` file that is used to configure Cypress behavior on the test run; _common_
        folder that contains `commands.js` file to add/edit Cypress commands; `index.d.ts` file to describe custom
        Cypress commands (it's needed to be able to use IntelliSense in different IDEs)
    - _mochawesome-report_ folder. Is used to store test run reports
    - _node-modules_ folder. Default folder to store project dependencies