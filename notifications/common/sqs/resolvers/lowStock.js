const { NotificationService} = require("../../../components/notification")

module.exports = function ({ quantity, amount, date, vehicleId, userId }) {
    NotificationService.generateAlertForProviderWhenInventoryIsLow(vehicleId)
}
