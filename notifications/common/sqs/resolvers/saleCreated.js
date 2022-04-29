const { NotificationService} = require("../../../components/notification")

module.exports = async function ({ quantity, amount, date, vehicleId, userId }) {
    NotificationService.generateInvoiceForSale({ quantity, amount, date, vehicleId, userId })
}
