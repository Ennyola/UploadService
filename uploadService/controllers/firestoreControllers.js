const admin = require('firebase-admin');

const serviceAccount = require('../uploadservice-4e08a-firebase-adminsdk-ss19v-9d875a9e6d.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

var docRefFiles = db.collection('Files')


const sendImageToDb = (filename, size, secure_url, username) => {
    // let docRefUsers = db.collection('Users').doc(username)
    let sendFile = docRefFiles.doc(filename).set({
        id: filename,
        url: secure_url,
        size,
        user: username
    }).then(() => {
        console.log('files saved to  firestore');
    }).catch((err) => {
        console.log(err);
    })

    return ({
        id: filename,
        size,
        url: secure_url,
        user: username
    })

}


const getDocDetail = (filename) => {
    docRefFiles.doc(filename).get()
}

const queryFile = (filename) => {
    async function query() {
        let result = await docRefFiles.doc(filename).get()
        return ({
            id: result.data().id,
            url: result.data().url,
            size: result.data().size
        })
    };
    console.log('i am seeing')
    console.log(filename)

    return (query())

}
const getImage = (username) => {
    let imageArray = []
    let query = docRefFiles.where('user', '==', username).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }

            snapshot.forEach(doc => {
                imageArray.push(doc.data())
            });

            return (imageArray)

        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    return (query)

}

const deleteImage = (url) => {
    let id, size
    async function query() {
        let imageToBeDeleted = await docRefFiles.where('url', '==', url).get()
        imageToBeDeleted.forEach(doc => {
            // console.log(doc.data().name)
            id = doc.data().id
            url = doc.data().url
            size = doc.data().size
            docRefFiles.doc(doc.data().id).delete()
        })

        return ({
            id,
            url,
            size
        })
    }

    return (query())

}
module.exports.sendImageToDb = sendImageToDb
module.exports.queryFile = queryFile
module.exports.getImage = getImage
module.exports.deleteImage = deleteImage