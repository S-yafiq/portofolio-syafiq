const express = require('express')
const app = express()
const body = require('body-parser')
const port = 3000
const router = require('./router/index')

app.use(body.json())
app.use(body.urlencoded({extended: false}))

app.use('/', router)

app.listen(port, ()=>{
	console.log('connected on port ' + port);
})