/// <reference types="cypress" />

describe('Demonstrate API Chaining in Cypress', function () {

  it('Chain CRUD Pet API requests and validate the response', () => {

    cy.fixture('/data/request/requestCreatePet.json').as('requestCreatePet')
    cy.fixture('/data/request/requestUpdatePet.json').as('requestUpdatePet')

      cy.get('@requestCreatePet').then(createNewPet => {
          cy.request({
            method: 'POST',
            url: '/pet',
                headers: {
              'accept' : 'application/json',
                  'Content-Type' : 'application/json'
            },
            body: createNewPet

          }).then((response) => {
            cy.log(JSON.stringify(response.body))
            expect(response).property('status').to.equal(200)
            expect(response.body).property('name').eq('doggie')
            expect(response.body).property('id').to.not.be.oneOf([null, ""])
            cy.writeFile('cypress/fixtures/data/response/responseCreatePet.json', response.body)
          })
        }).then(()=> {
            cy.get('@requestUpdatePet').then(updatePet =>{
                cy.request({
                    method: 'PUT',
                    url: '/pet',
                    headers: {
                        'accept' : 'application/json',
                        'Content-Type' : 'application/json'
                    },
                    body: updatePet
                }).then((response) => {
                    cy.log(JSON.stringify(response.body))
                    expect(response).property('status').to.equal(200)
                    expect(response.body).property('name').eq('doggie')
                    expect(response.body).property('id').to.not.be.oneOf([null, ""])
                    cy.writeFile('cypress/fixtures/data/response/responseUpdatePet.json', response.body)
                })
            })
        }).then(()=>{
            cy.log("STATUS :: "+Cypress.config('defaultStatus'))
              cy.request({
                  method: 'GET',
                  url: '/pet/findByStatus?status=available',
                  headers: {
                      'accept' : 'application/json',
                  },

              }).then((response) => {
                  cy.log(JSON.stringify(response.body))
                  expect(response).property('status').to.equal(200)
                  cy.writeFile('cypress/fixtures/data/response/responseFindPetByStatus.json', response.body)
            })
        }). then(()=>{
          cy.log("PET ID :: "+Cypress.config('defaultPetId'))
            cy.request({
               method: 'GET',
               url: '/pet/2',
               headers: {
                  'accept' : 'application/json',
               },

            }).then((response) => {
               cy.log(JSON.stringify(response.body))
               expect(response).property('status').to.equal(200)
               cy.writeFile('cypress/fixtures/data/response/responseFindPetById.json', response.body)
          })
      })
    })
})

