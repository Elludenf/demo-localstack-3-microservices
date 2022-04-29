
const VehicleService = require('./vehicleService')


class VehicleController {
    getAll(req, res, next){
        res.send(VehicleService.getAll())
    }
}


module.exports = new VehicleController