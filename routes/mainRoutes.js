var express = require('express')
var router = express.Router()

let customersController = require('../controllers/customersController')
let vendorsController = require('../controllers/vendorsController')

//// customer routes

// get list of items
router.get('/api/items', customersController.items)

// purchase item
router.post('/api/items/purchase', customersController.purchase)


//// vendor routes

// add item
router.post('/api/items', vendorsController.add)

// update item
router.patch('/api/items/:id', vendorsController.update)

// get transactions
router.get('/api/transactions', vendorsController.transactions)

// get money
router.get('/api/money', vendorsController.money)

module.exports = router