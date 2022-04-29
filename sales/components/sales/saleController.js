const SaleService = require("./saleService");

class SaleController {
  getAll(req, res, next) {
    res.send(SaleService.getAll());
  }

  create(req, res, next) {
    const { quantity, amount, date, vehicleId, userId } = req.body;
    res.send(SaleService.generateSale({quantity, amount, date, vehicleId, userId}));
    
  }
}

module.exports = new SaleController();
