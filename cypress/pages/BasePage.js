class BasePage {
  clearInputElementAndTypeText(elementLocator, textToType, clickOptions) {
    return cy
      .get(elementLocator)
      .should('be.visible')
      .click(clickOptions)
      .focused()
      .clear()
      .should('have.value', '')
      .type(textToType);
  }

  clickElementByElementLocator(elementLocator) {
    return cy.get(elementLocator).click();
  }
}

export default BasePage;
