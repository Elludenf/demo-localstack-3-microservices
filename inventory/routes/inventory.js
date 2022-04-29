var express = require('express');
var router = express.Router();

const { InventoryController } = require('../components/inventory');

/* GET vehicles listing. */
router.get('/', InventoryController.get);





module.exports = router;
