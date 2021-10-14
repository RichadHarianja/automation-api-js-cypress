/// <reference types="cypress" />

describe('Demonstrate API Chaining in Cypress', function () {

    it('Chain CRUD USER API requests and validate the response', () => {

        let uName = ""
        cy.fixture('/data/request/requestUserCreateWithList.json').as('userCreateWithList')
        cy.fixture('/data/request/requestUserUpdate.json').as('userUpdate')

        cy.get('@userCreateWithList').then(userCreate=>{
            cy.request({
                method: 'PoST',
                url: '/user/createWithList',
                headers: {
                    'accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body: userCreate
            }).then((response) => {
                cy.log(JSON.stringify(response.body))
                expect(response).property('status').to.equal(200)
                cy.writeFile('cypress/fixtures/data/response/responseUserCreateWithList.json', response.body)
            })
        }).then(()=>{
            cy.log("USERNAME :: "+Cypress.config('defaultUsername'))
            cy.request({
                method: 'GET',
                url: '/user/'+Cypress.config('defaultUsername'),
                headers: {
                    'accept' : 'application/json',
                },

            }).then((response) => {
                cy.log(JSON.stringify(response.body))
                expect(response).property('status').to.equal(200)
                cy.writeFile('cypress/fixtures/data/response/responseGetUserByUsername.json', response)
                uName = response.body['username']
            })
        }).then((uName)=>{
            cy.get('@userUpdate').then(usersUpdate=>{
                cy.request({
                    method: 'PUT',
                    url: '/user/'+uName,
                    headers: {
                        'accept' : 'application/json',
                        'Content-Type' : 'application/json'
                    },
                    body: usersUpdate
                }).then((response) => {
                    cy.log(JSON.stringify(response.body))
                    expect(response).property('status').to.equal(200)
                    cy.writeFile('cypress/fixtures/data/response/responseUserUpdate.json', response.body)
                })
            })
        }).then(()=>{
            cy.request({
                method: 'DELETE',
                url: '/user/'+uName,
                headers: {
                    'accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
            }).then((response) => {
                cy.log(JSON.stringify(response.body))
                expect(response).property('status').to.equal(200)
                cy.writeFile('cypress/fixtures/data/response/responseUserDelete.json', response.body)
            })
        })
    })
})
