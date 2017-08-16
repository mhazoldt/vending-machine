let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let expressValidator = require('express-validator')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let mRoutes = require('./routes/mainRoutes')
app.use('/', mRoutes)

app.listen(3000, function(){
  console.log("App running on port 3000")
})