const express = require('express')

const controller = require('../controllers/sendFilecontroller')

const { getImage } = controller

const homepageRouter = express.Router()

homepageRouter.get("/", (getImage))

module.exports = homepageRouter;