const { InventoryService } = require("../../../components/inventory")

module.exports = function ({ quantity,amount, date, vehicleId, userId }) {
    console.log("SNS event received: Sales:created")
    InventoryService.updateInventory({quantity,amount, date, vehicleId, userId})
}
