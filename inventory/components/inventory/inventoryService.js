const SnsHelper = require('../../common/sns/SnsHelper')
const InventoryDAL = require('./inventoryDAL')
const { faker } = require('@faker-js/faker');

const inventory = InventoryDAL.getInventory()
class InventoryService {

    updateInventory({quantity,amount, date, vehicleId, userId}){
        try {
            const itemIndex = inventory.findIndex((item)=> item.vehicleId === vehicleId)
            if(itemIndex<0){
                SnsHelper.sendMissingProduct({vehicleId})
            }
            if(inventory[itemIndex]){
                inventory[itemIndex].quantity = inventory[itemIndex].quantity  -quantity
                const newQuantity = inventory[itemIndex].quantity
                console.log('new quantity', newQuantity)
                if(newQuantity < 5){
                    SnsHelper.sendLowStockAlertForProvider({vehicleId, quantity, provider: faker.random.alphaNumeric(30)})
                }
            }
            
        } catch (error) {
            console.error(error)
        }

    }

    get(){
        return inventory
    }

}

module.exports = new InventoryService()