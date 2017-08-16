let db = require('../db/db.js')

// endpoint: POST /api/items
// request: {"name": chips, "price": 100, "stock": 5}
//
// add item to vending machine
exports.add = function(req, res, next) {
    console.log("-- add item --")
    console.log(req.body)

    let name = req.body.name
    let price = req.body.price
    let stock = req.body.stock
    
    // check if req.body is empty
    if(Object.keys(req.body).length === 0) {
        res.json({"status": "fail", "item": "not readable"})
    } else {
        db.query('INSERT INTO items (name, price, stock) VALUES (?, ?, ?)', [name, price, stock], function(err, results, fields) {
                if(!err) {
                    res.json({"status": "success"})
                } else {
                    res.json({"status": "fail", "item": "unable to add item"})
                }
                
            }// function
        ) //db.query
    } // if
} // exports.add


// endpoint: PATCH /api/items/:id
// request: {"name": "Chips", "price": 100, "stock": 5}
//      all request key/value pairs are optional, will default to existing values
//
// update item in vending machine
exports.update = function(req, res, next) {
    console.log("-- update item --")
    console.log(req.body)
    let id = req.params["id"]
    
    // get current values
    db.query('SELECT * FROM items WHERE id = ?', [id], valuesResults)
    function valuesResults(err, results, fields) {
        let name = results[0].name
        let price = results[0].price
        let stock = results[0].stock

        if(req.body.name) {name = req.body.name}
        if(req.body.price) {price = req.body.price}
        if(req.body.stock) {stock = req.body.stock}

        // update item
        db.query('UPDATE items SET name = ?, price = ?, stock = ? WHERE id = ?', [name, price, stock, id], updateResults)

    }
    function updateResults(err, results, fields) {
        res.json({"status": "success"})
    }

}

// endpoint: GET /api/transactions
// request: {}
// response: {"id": 2, "name": "Chips", "price": 100, "money_provided": 100, "change_returned": 0, "stock": 5, "ledger": 2500}
//
// get list of transactions
exports.transactions = function(req, res, next) {
    
    db.query('SELECT * FROM transactions', transactionsResults)
    function transactionsResults(err, results, fields) {
        console.log("-- transactions --")
        console.log(results)

        res.json({"transactions": results})
    }

}

// endpoint: GET /api/money
// request: {}
// response: {"total_money": 2500}
//
// get total amount of money in vending machine
exports.money = function(req, res, next) {
    let total_money
    db.query('SELECT ledger FROM transactions ORDER BY ID DESC LIMIT 1', moneyResults)
    function moneyResults(err, results, fields) {
        total_money = results[0].ledger

        console.log("-- total money --")
        console.log(`total_money: ${total_money}`)
        res.json({"total_money": total_money})
    }
    
}