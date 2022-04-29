const { faker } = require('@faker-js/faker');
const path =  require('path')
const fs =  require('fs')

const Vehicle = require('./vehicle');
const vehicles = require('./vehicles.json');


const generateVehicles = function(){
    const vehicles = []

    for (let index = 0; index < 20; index++) {
    
        const element = new Vehicle()
        element.id = index
        element.type = faker.vehicle.type()
        element.model = faker.vehicle.model()
        element.name = faker.vehicle.vehicle()
        element.quantity = faker.random.number({ max: 100 })
        element.price = faker.random.float({min: 10000})
    
        vehicles.push(element)
    }
    
    return vehicles    
}

const getAllVehicles = function(){
 return vehicles
}

module.exports = {
    generateVehicles,
    getAllVehicles
}