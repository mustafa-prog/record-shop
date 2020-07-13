const express = require('express');
const router = express.Router();

const { getUsers, addUser, getUser, updateUser, deleteUser } = require('../controllers/usersController');
const validator = require('../middleware/validator');
const userRules = require('../lib/validation/user');

router
  .route('/')
  .get(getUsers)
  .post(validator(userRules), addUser)

router
  .route('/:id')
  .get(getUser)
  .put(validator(userRules), updateUser)
  .delete(deleteUser)

module.exports = router;
