const admin = require('firebase-admin');

const serviceAccount = require('../uploadservice-4e08a-firebase-adminsdk-ss19v-9d875a9e6d.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

var docRefFiles = db.collection('Files'),
    docRefImages = db.collection('Images'),
    docRefMusic = db.collection('Music'),
    docRefVideos = db.collection('Videos'),
    docRefDocuments = db.collection('Documents')



const sendImageToDb = (filename, size, secure_url, username) => {
    // let docRefUsers = db.collection('Users').doc(username)
    // let sendFiletoFilesDoc = docRefFiles.doc(filename).set({
    //     id: filename,
    //     url: secure_url,
    //     size,
    //     user: username
    // }).then(() => {
    //     console.log('files saved to  firestore');
    // }).catch((err) => {
    //     console.log(err);
    // })
    let sendFiletoImagesDoc = docRefImages.doc(filename).set({
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


const sendVideoToDb = (filename, size, secure_url, username) => {
    // let docRefUsers = db.collection('Users').doc(username)
    // let sendFiletoFilesDoc = docRefFiles.doc(filename).set({
    //     id: filename,
    //     url: secure_url,
    //     size,
    //     user: username
    // }).then(() => {
    //     console.log('files saved to  firestore');
    // }).catch((err) => {
    //     console.log(err);
    // })
    let sendFiletoVideosDoc = docRefVideos.doc(filename).set({
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

const sendMusicToDb = (filename, size, secure_url, username) => {
    // let docRefUsers = db.collection('Users').doc(username)
    // let sendFiletoFilesDoc = docRefFiles.doc(filename).set({
    //     id: filename,
    //     url: secure_url,
    //     size,
    //     user: username
    // }).then(() => {
    //     console.log('files saved to  firestore');
    // }).catch((err) => {
    //     console.log(err);
    // })
    let sendFiletoMusicDoc = docRefMusic.doc(filename).set({
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

const sendrawFilesToDb = (filename, size, secure_url, username) => {
    // let docRefUsers = db.collection('Users').doc(username)
    // let sendFiletoFilesDoc = docRefFiles.doc(filename).set({
    //     id: filename,
    //     url: secure_url,
    //     size,
    //     user: username
    // }).then(() => {
    //     console.log('files saved to  firestore');
    // }).catch((err) => {
    //     console.log(err);
    // })
    let sendrawFileToFilesDoc = docRefDocuments.doc(filename).set({
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

    return (query())

}
const getImage = (username) => {
    let imageArray = []
    let query = docRefImages.where('user', '==', username).get()
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

const getVideos = (username) => {
    let videoArray = []
    let query = docRefVideos.where('user', '==', username).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }

            snapshot.forEach(doc => {
                videoArray.push(doc.data())
            });

            return (videoArray)

        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    return (query)

}
const getAudios = (username) => {
    let audioArray = []
    let query = docRefMusic.where('user', '==', username).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }

            snapshot.forEach(doc => {
                audioArray.push(doc.data())
            });

            return (audioArray)

        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    return (query)
}
const getRawFiles = (username) => {
    let rawFilesArray = []
    let query = docRefDocuments.where('user', '==', username).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }

            snapshot.forEach(doc => {
                rawFilesArray.push(doc.data())
            });

            return (rawFilesArray)

        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    return (query)

}

const deleteImage = (url) => {
    let id, size
    async function query() {
        let imageToBeDeletedFromFiles = await docRefFiles.where('url', '==', url).get()
        imageToBeDeletedFromFiles.forEach(doc => {

            id = doc.data().id
            url = doc.data().url
            size = doc.data().size
            docRefFiles.doc(doc.data().id).delete()
        })
        let imageToBeDeletedFromImages = await docRefImages.where('url', '==', url).get()
        imageToBeDeletedFromImages.forEach(doc => {

            id = doc.data().id
            url = doc.data().url
            size = doc.data().size
            docRefImages.doc(doc.data().id).delete()
        })


        return ({
            id,
            url,
            size
        })
    }

    return (query())

}
const deleteVideo = (url) => {
    let id, size
    async function query() {
        let videoToBeDeletedFromFiles = await docRefFiles.where('url', '==', url).get()
        videoToBeDeletedFromFiles.forEach(doc => {

            id = doc.data().id
            url = doc.data().url
            size = doc.data().size
            docRefFiles.doc(doc.data().id).delete()
        })

        let videoToBeDeletedFromVideoCol = await docRefVideos.where('url', '==', url).get()
        videoToBeDeletedFromVideoCol.forEach(doc => {
            id = doc.data().id
            url = doc.data().url
            size = doc.data().size
            docRefVideos.doc(doc.data().id).delete()
        })




        return ({
            id,
            url,
            size
        })
    }

    return (query())

}
const deleteAudio = (url) => {
    let id, size
    async function query() {
        let audioToBeDeletedFromFiles = await docRefFiles.where('url', '==', url).get()
        audioToBeDeletedFromFiles.forEach(doc => {

            id = doc.data().id
            url = doc.data().url
            size = doc.data().size
            docRefFiles.doc(doc.data().id).delete()
        })

        let audioToBeDeletedFromAudioCol = await docRefMusic.where('url', '==', url).get()
        audioToBeDeletedFromAudioCol.forEach(doc => {
            id = doc.data().id
            url = doc.data().url
            size = doc.data().size
            docRefMusic.doc(doc.data().id).delete()
        })
        return ({
            id,
            url,
            size
        })
    }

    return (query())
}
const deleteRawFiles = (url) => {
    let id, size
    async function query() {
        let rawFilesToBeDeletedFromFilesCol = await docRefFiles.where('url', '==', url).get()
        rawFilesToBeDeletedFromFilesCol.forEach(doc => {

            id = doc.data().id
            url = doc.data().url
            size = doc.data().size
            docRefFiles.doc(doc.data().id).delete()
        })

        let rawFilesToBeDeletedFromDocumentsCol = await docRefDocuments.where('url', '==', url).get()
        rawFilesToBeDeletedFromDocumentsCol.forEach(doc => {
            id = doc.data().id
            url = doc.data().url
            size = doc.data().size
            docRefDocuments.doc(doc.data().id).delete()
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
module.exports.getVideos = getVideos
module.exports.getImage = getImage
module.exports.getAudios = getAudios
module.exports.getRawFiles = getRawFiles
module.exports.deleteImage = deleteImage
module.exports.sendVideoToDb = sendVideoToDb
module.exports.sendMusicToDb = sendMusicToDb
module.exports.sendrawFilesToDb = sendrawFilesToDb
module.exports.deleteVideo = deleteVideo
module.exports.deleteAudio = deleteAudio
module.exports.deleteRawFiles = deleteRawFiles