const { faker } = require('@faker-js/faker');
const vehicleDALService = require('../vehicles/vehicleService');
const Sale = require('./sale');



const generateFakeSales = function(){
    const users = []

    for (let index = 0; index < 100; index++) {
    
        const element = new Sale()
        element.id = index
        element.name = faker.name.findName()
        element.name = faker.internet.email()
    
        users.push(element)
    }
    
    return users    
}

const generateSale = function(){
    const users = []

    element.name = faker.random.arrayElement()
    element.name = faker.internet.email()
    return users    
}

module.exports = {
    generateFakeSales
}