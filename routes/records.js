const express = require('express');
// We need to instantiate an express Router
const router = express.Router();

const { getRecords, addRecord, getRecord, updateRecord, deleteRecord } = require('../controllers/recordsController');
const validator = require('../middleware/validator');
const recordRules = require('../lib/validation/record');

router
    .route('/')
    .get(getRecords)
    .post(validator(recordRules), addRecord);

router
    .route('/:id')
    .get(getRecord)
    .put(validator(recordRules), updateRecord)
    .delete(deleteRecord)

module.exports = router;