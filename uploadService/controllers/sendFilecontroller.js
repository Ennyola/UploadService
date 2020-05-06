const express = require('express');
const cloudinary = require('cloudinary').v2;
const bytes = require('bytes')
const download = require('download')
const fetch = require('node-fetch');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { sendImageToDb } = require('./firestoreControllers')


const app = express()

cloudinary.config({
    cloud_name: 'enny',
    api_key: '256698143997345',
    api_secret: 'bFDo0j2JwTGBGqMgWUFuOs5bYB8'
});



















const postImage = (req, res) => {
    if (req.file) {
        console.log(req.file)
        let filePath = req.file.path
        let originalName = req.file.originalname
        let size = req.file.size

        size = bytes(size)

        // upload using the file path to cloudinary
        cloudinary.uploader.upload(filePath, (error, result) => {
            console.log(result, error)
            let fileUrl = result.secure_url
            res.render('homepage', { filename: originalName, fileLink: fileUrl, size })

            //this allows us send the url returned by cloudinary to firestore
            let sentFile = docRef.set({
                filename: originalName,
                imageUrl: fileUrl,
                size: size
            }).then(() => {
                console.log(`${fileUrl} saved to firestore`);
            }).catch((err) => {
                console.log(err);
            })
        });
    } else {
        res.send("No file sent")
    }
}

const sendImage = (upload.single(''), (req, res) => {

    console.log(req.file)


})




// This fetches the recently uploaded file from thr database
const getImage = (req, res) => {
    // const getFile = docRef.onSnapshot((doc) => {
    //     if (doc && doc.exists) {
    //         let myData = doc.data().imageUrl
    //         let size = doc.data().size
    //         let originalName = doc.data().filename
    //         res.render('homepage', { filename: originalName, fileLink: myData, size })
    //     } else {
    //         res.render('homepage', { filename: false, filelink: false, imageUrl: false })
    //     }
    // })
    res.render('homepage', { filename: false, filelink: false, imageUrl: false })

}

// const downloadImage = (req, res) => {
//     const getFile = docRef.onSnapshot((doc) => {
//         if (doc && doc.exists) {
//             let myData = doc.data().imageUrl
//             console.log(myData)
//             let size = doc.data().size
//             let originalName = doc.data().filename
//             download(myData, 'C:/Downloads')
//                 .then((data) => {
//                     console.log(data);
//                     res.render('homepage', { filename: originalName, fileLink: myData, size })
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 })
//         }
//     })

// }

module.exports.postImage = postImage
module.exports.getImage = getImage