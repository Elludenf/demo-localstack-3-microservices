
const SnsHelper= require('../../common/sns/SnsHelper')
const { faker } = require('@faker-js/faker');
class NotificationService {
    
    generateInvoiceForSale({quantity, amount, date, vehicleId, userId}){
        setTimeout(() => {
            console.log(`
            This is an Invoice for user ${userId}

            You just  purchased ${quantity} of the vehicle ${vehicleId}
        `)
        SnsHelper.invoiceCreated({invoice: faker.random.alphaNumeric(30), sale: faker.random.alphaNumeric(30)})
        }, 4000);


    }

    generateAlertForProviderWhenInventoryIsLow(vehicleId){
        console.log(`Sending email to provider for product : ${vehicleId}`)
    }



}

module.exports = new NotificationService()