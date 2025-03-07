
// npm run cy:run:test_match

function fillField(FIELD, TEXT) {
  cy.get(FIELD)
    .should('exist')
    .clear()
    .type(TEXT);
}

function clickButton(FIELD) {
  cy.get(FIELD)
    .last()
    .should('be.visible')
    .click({ force: true });
}

describe('Test Game Match', () => {
  beforeEach(() => {
    cy.visit('/');

    fillField('input#input_nosotros', 'Test Nosotros');
    fillField('input#input_ellos', 'Test Ellos');

    clickButton("button:contains('Empezar')");
  });

  it('Point for Nosotros', () => {
    clickButton("button:contains('Test Nosotros')");
    cy.contains("15").should('exist');
  });

  it('Point for Ellos', () => {
    clickButton("button:contains('Test Ellos')");
    cy.contains("15").should('exist');
  });

  it('Set for Nosotros', () => {
    for (let i = 0; i < 4; i++) {
      clickButton("button:contains('Test Nosotros')");
    }
    cy.contains("1").should('exist');
  });

  it('Set for Ellos', () => {
    for (let i = 0; i < 4; i++) {
      clickButton("button:contains('Test Ellos')");
    }
    cy.contains("1").should('exist');
  });

  it('Undo last action', () => {
    clickButton("button:contains('Atras')");
  });

  it('Reset game', () => {
    clickButton("button:contains('Reset')");
    cy.contains("0").should('exist');
  });

  it('Finish game', () => {
    clickButton("button:contains('Finalizar')");
    cy.contains("🏆 Último ganador").should('exist');
  });
});