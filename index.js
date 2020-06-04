const express = require('express')
const expressGraphQl = require('express-graphql')
const { graphqlUploadExpress } = require('graphql-upload')
const cloudinary = require('cloudinary').v2;
const cors = require('cors')
require('dotenv').config()
const schema = require('./schema/schema')


const app = express()
app.use(cors())
const port = process.env.PORT || 4000;


app.use('/graphiql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    expressGraphQl({
        graphiql: true,
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