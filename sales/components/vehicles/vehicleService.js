
const VehicleDAL = require('./vehicleDAL')


class VehicleService {
    getAll(){
        return VehicleDAL.getAll()
    }
}


module.exports = new VehicleService()