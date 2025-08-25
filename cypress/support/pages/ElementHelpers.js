// cypress/support/pages/ElementHelpers.js

export class ElementHelpers {

  /**
   * Finds an input/select/textarea element based on its label text.
   * Supports sibling or child relationships.
   * @param {string} labelText - The visible label text
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
   */
  getElementByLabel(labelText) {
    return cy.contains('label', labelText).then($label => {
      const forAttr = $label.attr('for');

      let element;

      if (forAttr) {
        element = cy.get(`#${forAttr}`);
      } else {
        const wrappedInput = $label.find('input, select, textarea');
        if (wrappedInput.length) {
          element = cy.wrap(wrappedInput);
        } else {
          element = cy.wrap($label)
            .parent()
            .find('input, select, textarea')
            .first();
        }
      }
      // Assert presence and visibility
      return element.should('exist').should('be.visible');
    });
  }

  /**
   * Finds an input by its placeholder text.
   * @param {string} placeholderText
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
   */
  getInputByPlaceholder(placeholderText) {
    return cy.get(`input[placeholder="${placeholderText}"]`)
      .should('exist')
      .should('be.visible');
  }

  /**
   * Finds a button by its visible text.
   * Asserts presence and visibility.
   * @param {string} buttonText - The visible text on the button
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
   */
  getButtonByText(buttonText) {
    return cy.contains('button, input[type="button"], input[type="submit"]', buttonText)
      .filter(':visible')   
      .should('exist')
      .should('be.visible');
  }

  /**
   * Finds a link by its visible text
   */
  getLinkByText(linkText) {
    return cy.contains('a:not(.d-sm-none)', linkText)
      .filter(':visible')   
      .should('exist')
      .should('be.visible');
  }

  /**
   * Type into an input by label
   */
  typeIntoField(labelText, value) {
    this.getElementByLabel(labelText).clear().type(value);
  }

  /**
   * Type into an input by placeholder
   */
  typeInputWithPlaceholder(placeholderText, value) {
    this.getInputByPlaceholder(placeholderText).clear().type(value);
  }

  /**
   * Clicks a button by its visible text
   */
  clickButton(buttonText) {
    this.getButtonByText(buttonText).click();
  }

  /**
   * Clicks a link by its visible text
   */
  clickLink(linkText) {
    this.getLinkByText(linkText).click();
  }

  /**
   * Select from dropdown by label
   */
  selectFromDropdown(labelText, option) {
    this.getElementByLabel(labelText).select(option);
  }

  /**
   * Check a checkbox by label
   */
  checkCheckbox(labelText) {
    this.getElementByLabel(labelText).check();
  }

  /**
   * Verify a specific cell value in a table by row and column
   */
  verifyTableCell(tableSelector, rowIndex, colIndex, expectedValue) {
    cy.get(`${tableSelector} tr`)
      .eq(rowIndex)
      .find('td')
      .eq(colIndex)
      .should('contain.text', expectedValue);
  }

  /**
   * Verify a cell value exists in any row (no row index given)
   */
  verifyTableCellInAnyRow(tableSelector, colIndex, expectedValue) {
    let found = false;
    cy.get(`${tableSelector} tr`).each(($row) => {
      cy.wrap($row)
        .find('td')
        .eq(colIndex)
        .then(($cell) => {
          if ($cell.text().includes(expectedValue)) {
            found = true;
            expect($cell.text()).to.include(expectedValue);
          }
        });
    }).then(() => {
      expect(found, `Value "${expectedValue}" should exist in column ${colIndex}`).to.be.true;
    });
  }

  /**
   * Select (click) a specific row by index
   */
  selectTableRow(tableSelector, rowIndex) {
    cy.get(`${tableSelector} tr`).eq(rowIndex).click().should('exist');
  }

  /**
   * Select a row by matching a cell value
   */
  selectRowByCellValue(tableSelector, colIndex, matchValue) {
    let clicked = false;
    cy.get(`${tableSelector} tr`).each(($row) => {
      cy.wrap($row)
        .find('td')
        .eq(colIndex)
        .then(($cell) => {
          if ($cell.text().includes(matchValue)) {
            cy.wrap($row).click();
            clicked = true;
          }
        });
    }).then(() => {
      expect(clicked, `Row with value "${matchValue}" should be clicked`).to.be.true;
    });
  }

  /**
   * Get a nested child inside a parent by parent text
   */
  getChildByParentText(parentSelector, parentText, childSelector) {
    return cy.get(parentSelector)
      .contains(parentText)
      .parent()
      .find(childSelector)
      .should('exist')
      .should('be.visible');
  }

  /**
   * Click a nested child (multi-level) inside parent → child → child
   * Example: clickNestedChild('.parent', 'Parent Text', ['.child', 'a'])
   */
  clickNestedChild(parentSelector, parentText, childSelectors) {
    let element = cy.get(parentSelector).contains(parentText).parent();
    childSelectors.forEach(sel => {
      element = element.find(sel);
    });
    element.should('exist').should('be.visible').click();
  }

  /**
   * Smart element finder with multiple fallback strategies
   * @param {string} fieldName - The field name to find
   * @param {string} elementType - The type of element to find (default: 'input')
   * @returns {Cypress.Chainable} The found element
   */
  findElementSmart(fieldName, elementType = 'input') {
    // Strategy 1: Try to find by label
    cy.get('body').then(($body) => {
      if ($body.find(`label:contains("${fieldName}")`).length > 0) {
        return this.getElementByLabel(fieldName);
      }
    });
    
    // Strategy 2: Try to find parent div/span containing text, then input
    cy.get('body').then(($body) => {
      const parentSelectors = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      
      for (const selector of parentSelectors) {
        if ($body.find(`${selector}:contains("${fieldName}")`).length > 0) {
          return this.getChildByParentText(selector, fieldName, elementType);
        }
      }
    });
    
    // Strategy 3: Try to find by placeholder
    cy.get('body').then(($body) => {
      if ($body.find(`input[placeholder*="${fieldName}"]`).length > 0) {
        return this.getInputByPlaceholder(fieldName);
      }
    });
    
    // Strategy 4: Try to find by name attribute
    cy.get('body').then(($body) => {
      if ($body.find(`[name*="${fieldName.toLowerCase()}"]`).length > 0) {
        return cy.get(`[name*="${fieldName.toLowerCase()}"]`);
      }
    });
    
    // Strategy 5: Try to find by id attribute
    cy.get('body').then(($body) => {
      if ($body.find(`#${fieldName.toLowerCase().replace(/\s+/g, '-')}`).length > 0) {
        return cy.get(`#${fieldName.toLowerCase().replace(/\s+/g, '-')}`);
      }
    });
    
    // Final fallback: Generic search
    return cy.get(elementType).filter(`:contains("${fieldName}")`).first();
  }

  /**
   * Debug helper: List all available form fields on the current page
   * Useful for understanding what fields are actually available
   */
  static debugAvailableFields() {
    cy.get('body').then(($body) => {
      const availableFields = [];
      
      // Find all labels
      $body.find('label').each((i, el) => {
        const text = Cypress.$(el).text().trim();
        if (text) availableFields.push(`Label: "${text}"`);
      });
      
      // Find all divs/span/p with text that might be field labels
      $body.find('div, span, p').each((i, el) => {
        const text = Cypress.$(el).text().trim();
        if (text && text.length < 50 && !text.includes('\n')) {
          availableFields.push(`Text: "${text}"`);
        }
      });
      
      // Find all placeholders
      $body.find('input[placeholder]').each((i, el) => {
        const placeholder = Cypress.$(el).attr('placeholder');
        if (placeholder) availableFields.push(`Placeholder: "${placeholder}"`);
      });
      
      // Find all input names
      $body.find('input[name]').each((i, el) => {
        const name = Cypress.$(el).attr('name');
        if (name) availableFields.push(`Name: "${name}"`);
      });
      
      // Return unique fields
      const uniqueFields = [...new Set(availableFields)];
      return uniqueFields;
    });
  }

  /**
   * Debug helper: List all available form fields (instance method)
   */
  debugAvailableFields() {
    return ElementHelpers.debugAvailableFields();
  }

  /**
   * Type into field using smart element finding with fallbacks
   * @param {string} fieldName - The field name to find
   * @param {string} value - The value to type
   * @param {string} elementType - The type of element (default: 'input')
   * @returns {Cypress.Chainable} The element after typing
   */
  typeIntoFieldSmart(fieldName, value, elementType = 'input') {
    return this.findElementSmart(fieldName, elementType)
      .should('be.visible')
      .clear()
      .type(value);
  }
}

export default ElementHelpers;