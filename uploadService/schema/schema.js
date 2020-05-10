const graphql = require('graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLSchema, GraphQLBoolean, GraphQLNonNull, GraphQLList } = graphql
const { GraphQLUpload } = require('graphql-upload')
var fs = require('fs');
const cloudinary = require('cloudinary').v2;
const byte = require('bytes')

const { sendImageToDb, getImage, deleteImage, queryFile } = require('../controllers/firestoreControllers')


cloudinary.config({
    cloud_name: 'enny',
    api_key: '256698143997345',
    api_secret: 'bFDo0j2JwTGBGqMgWUFuOs5bYB8'
});

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

        uploadImage: {
            description: 'Uploads an image.',
            type: FileType,
            args: {
                image: {
                    description: 'Image file.',
                    type: new GraphQLNonNull(GraphQLUpload)
                },
                username: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, { image, username }) {
                const { filename, mimetype, createReadStream } = await image
                const stream = createReadStream()

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









            }
        }
    }


})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})