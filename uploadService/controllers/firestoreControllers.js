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
        name: filename,
        url: secure_url,
        size,
        userId: username
    }).then(() => {
        console.log('files saved to  firestore');
    }).catch((err) => {
        console.log(err);
    })

    // let sendUser = docRefUsers.set({
    //     id: userId,
    //     username
    // }).then(() => {
    //     console.log(`${username} saved to firestore`);
    // }).catch((err) => {
    //     console.log(err);
    // })

    return ({
        name: filename,
        size,
        url: secure_url,
        userId: username
    })

}

const deleteFiles = (filename) => {
    let docRefFiles = db.collection('Files').doc(filename).delete()
    return ({
        name: filename
    })
}
const queryFile = ({ filename }) => {
    async function query() {

        let docRefFiles = db.collection('Files').doc(filename)
        let result = await docRefFiles.get()
        return ({
            name: result.data().name,
            url: result.data().url,
            size: result.data().size
        })
    };

    return (query())



}
const queryFiles = () => {
    let name = []
    let docRefFiles = db.collection('Files')
    let allFiles = docRefFiles.get()
        .then(snapsho => {
            snapsho.forEach(dc => {
                name.push(dc.id)
                console.log(name)
            });
            return (name)
        })

    return (allFiles)
}

const getImage = (username) => {
    let imageArray = []
    let query = docRefFiles.where('userId', '==', username).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }

            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                imageArray.push(doc.data())
            });

            return (imageArray)

        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    return (query)

}

module.exports.sendImageToDb = sendImageToDb
module.exports.deleteFiles = deleteFiles
module.exports.queryFile = queryFile
module.exports.queryFiles = queryFiles
module.exports.getImage = getImage