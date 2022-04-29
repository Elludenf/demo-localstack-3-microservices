var express = require('express');
var router = express.Router();

const { VehicleController } = require('../components/vehicles');

/* GET vehicles listing. */
router.get('/', VehicleController.getAll);





module.exports = router;
