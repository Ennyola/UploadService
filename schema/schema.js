const graphql = require('graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLSchema, GraphQLBoolean, GraphQLNonNull, GraphQLList } = graphql
const { GraphQLUpload } = require('graphql-upload')
const cloudinary = require('cloudinary').v2;
var fs = require('fs');
const byte = require('bytes')


const {
    sendImageToDb,
    getImage,
    deleteImage,
    getVideos,
    sendVideoToDb,
    deleteVideo,
    deleteAudio,
    getAudios,
    sendrawFilesToDb,
    sendMusicToDb,
    deleteRawFiles,
    getRawFiles
} = require('../controllers/firestoreControllers')






//to get the actual filename from the url returned in cloudinary
const getFileName = (url) => {
    return name = url.split('/').pop().split('.').shift()
}

const imageFormats = ['ai', 'gif', 'webp', 'bmp', 'djvu', 'ps', 'ept', 'eps', 'eps3', 'fbx', 'flif', 'gif', 'gltf',
    'heif', 'heic', 'ico', 'indd', 'jpg', 'jpe', 'jpeg', 'jp2', 'wdp', 'jxr', 'hdp',
    'pdf', 'png', 'psd', 'arw', 'cr2', 'svg', 'tga', 'tif,', 'tiff'
]
const videoFormats = ['	3g2', '3gp', 'avi', '	flv', 'm3u8', 'ts', 'm2ts', 'mts', 'mov', 'mkv', 'mp4', 'mpd', 'mxf', 'ogv', 'webm', 'wmv']
const musicFormats = ['aac', 'aiff', 'amr', 'flac', 'm4a', 'mp3', 'ogg', 'opus', 'wav', 'mpeg']

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
        queryVideos: {
            type: new GraphQLList(FileType),
            args: { username: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parent, { username }) {
                return getVideos(username)
            }

        },
        getfiles: {
            type: new GraphQLList(FileType),
            args: { username: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parent, { username }) {
                return getImage(username)
            }
        },
        queryMusic: {
            type: new GraphQLList(FileType),
            args: { username: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parent, { username }) {
                return getAudios(username)
            }
        },
        getRawFiles: {
            type: new GraphQLList(FileType),
            args: { username: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parent, { username }) {
                return getRawFiles(username)
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
                cloudinary.uploader.destroy(name, function(err, result) {})
                return deleteImage(url)

            }
        },
        deleteVideo: {
            type: FileType,
            args: {
                url: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parents, { url }) {
                const name = getFileName(url)
                cloudinary.uploader.destroy(name, { resource_type: "video" }, function(err, result) {})
                return deleteVideo(url)
            }
        },
        deleteAudio: {
            type: FileType,
            args: {
                url: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parents, { url }) {
                const name = getFileName(url)
                cloudinary.uploader.destroy(name, { resource_type: "video" }, function(err, result) {})
                return deleteAudio(url)
            }

        },
        deleteRawFiles: {
            type: FileType,
            args: {
                url: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parents, { url }) {
                const name = url.split('/').pop()
                cloudinary.uploader.destroy(name, { resource_type: "raw" }, function(err, result) {})

                return deleteRawFiles(url)
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
        }
    }


})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})