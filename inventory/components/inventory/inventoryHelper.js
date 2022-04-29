const { faker } = require('@faker-js/faker');

const Inventory = require('./inventory')
const vehicles = require('./inventory.json');



const getInventory = function(){
    return vehicles
   }

module.exports = {
    getInventory
}