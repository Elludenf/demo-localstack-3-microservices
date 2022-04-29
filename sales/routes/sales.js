var express = require('express');
const SaleController = require('../components/sales/saleController');
var router = express.Router();

/* GET sales listing. */
router.get('/', SaleController.getAll);

/* POST sales listing. */

router.post('/', SaleController.create);



module.exports = router;
