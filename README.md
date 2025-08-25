# Demo-Cypress-Login

Cypress QA Automation Script Demo for Login Functionality

Please follow the following steps to execute this test

git clone repository

npm i

Add cypress.env.json file in the root directory of the cloned directory

Change values to correct values 
{ 
"USERNAME": "changetocorrectvalue", 
"PASSWORD": "changetocorrectvalue" 
}

npx cypress run --spec "cypress/e2e/tests/login.cy.js" -> this will run on electron headless

npx cypress run --spec "cypress/e2e/tests/login.cy.js" --browser chrome --headed -> this will run on chrome browser open
