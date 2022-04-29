const SnsHelper = require('../../common/sns/SnsHelper')

class SaleService {
    
    generateSale({quantity, amount, date, vehicleId, userId}){
        SnsHelper.salesCreated({quantity,amount, date, vehicleId, userId})
        
    }


}

module.exports = new SaleService()