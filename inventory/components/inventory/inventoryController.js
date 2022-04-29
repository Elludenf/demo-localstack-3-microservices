
const InventoryService = require('./inventoryService')


class InventoryController {
    get(req, res, next){
        res.send(InventoryService.get())
    }
}


module.exports = new InventoryController