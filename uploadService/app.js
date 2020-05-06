const express = require('express')
const homepageRouter = require('./routes/routes')
const expressGraphQl = require('express-graphql')
const { graphqlUploadExpress } = require('graphql-upload')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const path = require('path')
const sendController = require('./controllers/sendFilecontroller')
const cloudinary = require('cloudinary').v2;
const cors = require('cors')
require('dotenv').config()
var jwt = require('jsonwebtoken');
const schema = require('./schema/schema')


const app = express()
app.use(cors())
const port = process.env.PORT || 4000;
const { postImage } = sendController


app.use('/graphiql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    expressGraphQl({
        graphiql: true,
        schema,
    }))
app.use('/homepage', homepageRouter)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public/')))
app.set('views', './views');
app.set('view engine', 'ejs')


// save the file to the uploads folder using multer
app.post('/homepage', upload.single('myFile'), (postImage))
    // app.get('/download', (downloadImage))

app.listen(port, () => {
    console.log(`app is listening on port ${port}`)

})