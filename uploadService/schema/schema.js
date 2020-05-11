const graphql = require('graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLSchema, GraphQLBoolean, GraphQLNonNull, GraphQLList } = graphql
const { GraphQLUpload } = require('graphql-upload')
var fs = require('fs');
const cloudinary = require('cloudinary').v2;
const byte = require('bytes')

const { sendImageToDb, getImage, deleteImage, queryFile, sendVideoToDb, sendrawFilesToDb, sendMusicToDb } = require('../controllers/firestoreControllers')


cloudinary.config({
    cloud_name: 'enny',
    api_key: '256698143997345',
    api_secret: 'bFDo0j2JwTGBGqMgWUFuOs5bYB8'
});

//to get the actual filename from the url returned in cloudinary
const getFileName = (url) => {
    for (var i = 0; i <= url.length; i++) {
        if (url[i] == '/') {
            url = url.replace(url[i], " ")
        }
        if (url[i] == '.') {
            url = url.replace(url[i], " ")
        }
    }
    let urlArray = url.split(' ')
    let urlArrayIndex = urlArray.length - 2
    let fileName = urlArray[urlArrayIndex]
    return fileName
}

const imageFormats = ['ai', 'gif', 'webp', 'bmp', 'djvu', 'ps', 'ept', 'eps', 'eps3', 'fbx', 'flif', 'gif', 'gltf',
    'heif', 'heic', 'ico', 'indd', 'jpg', 'jpe', 'jpeg', 'jp2', 'wdp', 'jxr', 'hdp',
    'pdf', 'png', 'psd', 'arw', 'cr2', 'svg', 'tga', 'tif,', 'tiff'
]
const videoFormats = ['	3g2', '3gp', 'avi', '	flv', 'm3u8', 'ts', 'm2ts', 'mts', 'mov', 'mkv', 'mp4', 'mpeg', 'mpd', 'mxf', 'ogv', 'webm', 'wmv']
const musicFormats = ['aac', 'aiff', 'amr', 'flac', 'm4a', 'mp3', 'ogg', 'opus', 'wav', '']

const FileType = new GraphQLObjectType({
    name: 'File',
    fields: () => ({
        id: { type: GraphQLString },
        user: { type: GraphQLString },
        url: { type: GraphQLString },
        size: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getfile: {
            type: FileType,
            args: { filename: { type: GraphQLString } },
            resolve(parents, { filename }) {
                return queryFile(filename)

            }
        },
        getfiles: {
            type: new GraphQLList(FileType),
            args: { username: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parent, { username }) {
                return getImage(username)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        deleteImage: {
            type: FileType,
            args: {
                url: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, { url }) {
                const name = getFileName(url)
                cloudinary.uploader.destroy(name, function(err, result) {
                    console.log(err, result)
                })
                return deleteImage(url)

            }
        },

        uploadFile: {
            description: 'Uploads a File.',
            type: FileType,
            args: {
                file: {
                    description: 'Any file.',
                    type: new GraphQLNonNull(GraphQLUpload)
                },
                username: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, { file, username }) {
                const { filename, mimetype, createReadStream } = await file
                const stream = createReadStream()
                fileFormat = mimetype.split('/').pop().toLowerCase()
                console.log(fileFormat)

                if (imageFormats.includes(fileFormat)) {
                    const cloudinaryWrap = () => {
                        return new Promise((res, rej) => {
                            const upload_stream = cloudinary.uploader.upload_stream((error, result) => {
                                const { bytes, secure_url } = result
                                var size = byte(bytes)
                                sendImageToDb(filename, size, secure_url, username)
                                res({
                                    size,
                                    url: secure_url
                                })
                            })
                            stream.pipe(upload_stream)
                        })
                    }
                    return value = cloudinaryWrap().then((data) => {
                        let { size, url } = data
                        return ({
                            size,
                            url,
                            id: filename
                        })

                    })
                } else if (videoFormats.includes(fileFormat)) {
                    const cloudinaryWrap = () => {
                        return new Promise((res, rej) => {
                            const upload_stream = cloudinary.uploader.upload_stream({ resource_type: "video" }, (error, result) => {
                                console.log(result, error)
                                const { bytes, secure_url } = result
                                var size = byte(bytes)
                                sendVideoToDb(filename, size, secure_url, username)
                                res({
                                    size,
                                    url: secure_url
                                })
                            })
                            stream.pipe(upload_stream)
                        })
                    }
                    return value = cloudinaryWrap().then((data) => {
                        let { size, url } = data
                        return ({
                            size,
                            url,
                            id: filename
                        })

                    })

                } else if (musicFormats.includes(fileFormat)) {
                    const cloudinaryWrap = () => {
                        return new Promise((res, rej) => {
                            const upload_stream = cloudinary.uploader.upload_stream({ resource_type: "video" }, (error, result) => {
                                console.log(result, error)
                                const { bytes, secure_url } = result
                                var size = byte(bytes)
                                sendMusicToDb(filename, size, secure_url, username)
                                res({
                                    size,
                                    url: secure_url
                                })
                            })
                            stream.pipe(upload_stream)
                        })
                    }
                    return value = cloudinaryWrap().then((data) => {
                        let { size, url } = data
                        return ({
                            size,
                            url,
                            id: filename
                        })

                    })
                } else {
                    const cloudinaryWrap = () => {
                        return new Promise((res, rej) => {
                            const upload_stream = cloudinary.uploader.upload_stream({ resource_type: "raw" }, (error, result) => {
                                console.log(result, error)
                                const { bytes, secure_url } = result
                                var size = byte(bytes)
                                sendrawFilesToDb(filename, size, secure_url, username)
                                res({
                                    size,
                                    url: secure_url
                                })
                            })
                            stream.pipe(upload_stream)
                        })
                    }
                    return value = cloudinaryWrap().then((data) => {
                        let { size, url } = data
                        return ({
                            size,
                            url,
                            id: filename
                        })

                    })


                }



            }
        },
        uploadVideo: {
            description: 'Uploads a Video',
            type: FileType,
            args: {
                video: { type: new GraphQLNonNull(GraphQLUpload) },
                username: { type: new GraphQLNonNull(GraphQLString) }

            },
            async resolve(parents, { video, username }) {

                const { filename, mimetype, createReadStream } = await video
                console.log(mimetype)
                const stream = createReadStream()

                const cloudinaryWrap = () => {
                    return new Promise((res, rej) => {
                        const upload_stream = cloudinary.uploader.upload_stream({ resource_type: "video" }, (error, result) => {
                            console.log(result, error)
                            const { bytes, secure_url } = result
                            var size = byte(bytes)
                            sendVideoToDb(filename, size, secure_url, username)
                            res({
                                size,
                                url: secure_url
                            })
                        })
                        stream.pipe(upload_stream)
                    })
                }
                return value = cloudinaryWrap().then((data) => {
                    let { size, url } = data
                    return ({
                        size,
                        url,
                        id: filename
                    })

                })

            }

        }
    }


})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})