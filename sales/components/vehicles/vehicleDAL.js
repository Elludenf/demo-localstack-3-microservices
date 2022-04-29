
const {getAllVehicles} = require('./vehicleHelper')

class VehicleDAL {
    getAll(){
        return getAllVehicles()
    }
}


module.exports = new VehicleDAL()