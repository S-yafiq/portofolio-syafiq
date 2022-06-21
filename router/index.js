const route = require('color-convert/route')
const express = require('express')
const router = express.Router()
const routerController = require('../controller/routerController')

router.use('/', routerController)

module.exports = router