const express = require('express');
const router = express.Router();

const { getOrders, addOrder, getOrder, updateOrder, deleteOrder } = require('../controllers/ordersController');
const validator = require('../middleware/validator');
const orderRules = require('../lib/validation/order');

router
  .route('/')
  .get(getOrders)
  .post(validator(orderRules), addOrder)

router
  .route('/:id')
  .get(getOrder)
  .put(validator(orderRules), updateOrder)
  .delete(deleteOrder)

module.exports = router;