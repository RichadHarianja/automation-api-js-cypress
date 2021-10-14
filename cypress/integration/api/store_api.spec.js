/// <reference types="cypress" />

describe('Demonstrate API Chaining in Cypress', function () {

    it('Chain CRUD Store API requests and validate the response', () => {

        cy.fixture('/data/request/requestStoreOrder.json').as('requestStoreOrder')

        cy.request({
            method: 'GET',
            url: '/store/inventory',
            headers: {
                'accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
        }).then((response) => {
            cy.log(JSON.stringify(response.body))
            expect(response).property('status').to.equal(200)
            cy.writeFile('cypress/fixtures/data/response/responseStoreInventory.json', response.body)
        }). then(()=>{
            cy.get('@requestStoreOrder').then(storeOrder=>{
                cy.request({
                    method: 'POST',
                    url: '/store/order',
                    headers: {
                        'accept' : 'application/json',
                        'Content-Type' : 'application/json'
                    },
                    body: storeOrder
                }).then((response) => {
                    cy.log(JSON.stringify(response.body))
                    expect(response).property('status').to.equal(200)
                    cy.writeFile('cypress/fixtures/data/response/responseStoreOrder.json', response.body)
                })
            }).then(()=>{
                cy.log("PET ID :: "+Cypress.config('defaultOrderId'))
                cy.request({
                    method: 'GET',
                    url: '/store/order/'+Cypress.config('defaultOrderId'),
                    headers: {
                        'accept' : 'application/json',
                    },

                }).then((response) => {
                    cy.log(JSON.stringify(response.body))
                    expect(response).property('status').to.equal(200)
                    cy.writeFile('cypress/fixtures/data/response/responseFindPurchaseOrderByOrderId.json', response)
                })
            }).then(()=>{
                cy.log("PET ID :: "+Cypress.config('defaultOrderId'))
                cy.request({
                    method: 'DELETE',
                    url: '/store/order/'+Cypress.config('defaultOrderId'),
                    headers: {
                        'accept' : 'application/json',
                    },

                }).then((response) => {
                    cy.log(JSON.stringify(response.body))
                    expect(response).property('status').to.equal(200)
                    cy.writeFile('cypress/fixtures/data/response/responseDeleteOrderByOrderId.json', response)
                })
            })
        })
    })
})
