
const {getInventory} = require('./inventoryHelper')

class InventoryDAL {
    getInventory(){
        return getInventory()
    }
}


module.exports = new InventoryDAL()