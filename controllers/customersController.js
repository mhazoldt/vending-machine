let db = require('../db/db.js')

// endpoint: GET /api/items
// request: {}
// response: {"id": 2, "item": "Chips", "price": 100, "stock": 5}
//
// get list of items
exports.items = function(req, res, next) {

    db.query('SELECT * FROM items', function(err, results, fields) {
        console.log("-- get items --")
        console.log(results)
        
        let count = 0
        let jsonRes = []
        // rename name to item
        while(count < results.length) {
            jsonRes.push({"id": results[count].id, "item": results[count].name, "price": results[count].price, "stock": results[count].stock})
            count++
        }
        res.json(jsonRes)
    })

}

// endpoint: POST /api/items/purchase
// request: {"name": "Chips", "money": 200}
// response: {"status": "success", "item": "Chips", "price": 125, "money_provided": 200, "change": 75}
//
// purchase an item
exports.purchase = function(req, res, next) {
    console.log("-- purchase item --")

    // transaction record values
    let item = req.body.item
    console.log(`item: ${item}`)

    let price = null
    let money_provided = req.body.money
    console.log(`money_provided: ${money_provided}`)

    let change_returned = null
    let stock = null
    let ledger = null

    // get cost of item
    db.query('SELECT price FROM items WHERE name = ?', [item], priceResults)
    function priceResults(err, results, fields) {
    
        // check that item exits
        if(results.length < 1) {
            res.json({"status": "fail", "item": "not available"})
        
          // check to make sure they have provided enough money
        } else if((money_provided - price) < 0) {
            price = results[0].price
            res.json({"status": "fail", "item": item, "price": price, "money_provided": money_provided})

        } else {
            price = results[0].price
            console.log(`price: ${price}`)

            // get current ledger amount and stock
            db.query('SELECT * FROM transactions ORDER BY ID DESC LIMIT 1', ledgerResults)
        }
    } 
    function ledgerResults(err, results, fields) {
        console.log("-- ledger results --")
        console.log(results)
        
        // check that item is in stock
        stock = results[0].stock

        if(stock < 1) {
            res.json({"status": "fail", "item": item, "stock": 0})
        } else {
            ledger = results[0].ledger
            stock = results[0].stock
            stock = stock - 1
            change_returned = money_provided - price

            // increase the total amount of money in the machine
            ledger = ledger + price

            // update stock on items table
            db.query('UPDATE items SET stock = ? WHERE name = ?', [stock, item], (err, results, fields) => {console.log("items updated")})

            // create new transaction in database
            console.log(item + " " + price + " " + money_provided + " " + change_returned + " " + ledger)
            db.query('INSERT INTO transactions (item, price, money_provided, change_returned, stock, ledger) VALUES (?, ?, ?, ?, ?, ?)', [item, price, money_provided, change_returned, stock, ledger], transactionResults)
        }
    } 
    function transactionResults(err, results, fields) {
        // get transation details to return
        db.query('SELECT item, price, money_provided, change_returned FROM transactions ORDER BY ID DESC LIMIT 1', selectResults)        
    } 
    function selectResults(err, results, fields) {
        // return json object
        console.log("-- select results --")
        results[0].status = "Success"
        console.log(results)

        res.json(results)
    }

}

