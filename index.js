const express = require('express')
const expressGraphQl = require('express-graphql')
const { graphqlUploadExpress } = require('graphql-upload')
const cloudinary = require('cloudinary').v2;
const cors = require('cors')
require('dotenv').config()
const schema = require('./schema/schema')


const app = express()
const port = process.env.PORT || 4000;

var whitelist = ['https://awploder.herokuapp.com']
var corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}


app.use('/graphiql',
    cors(corsOptions),
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    expressGraphQl({
        graphiql: false,
        schema,
    }))


if (typeof(process.env.CLOUDINARY_URL) === 'undefined') {
    console.warn('!! cloudinary config is undefined !!');
    console.warn('export CLOUDINARY_URL or set dotenv file');
} else {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET

    })
}

app.listen(port, () => {
    console.log(`app is listening on port ${port}`)

})