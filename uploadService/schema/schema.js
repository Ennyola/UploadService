const graphql = require('graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLSchema, GraphQLBoolean, GraphQLNonNull, GraphQLList } = graphql
const { GraphQLUpload } = require('graphql-upload')
var fs = require('fs');
const cloudinary = require('cloudinary').v2;
const byte = require('bytes')

const { sendImageToDb, getImage } = require('../controllers/firestoreControllers')


cloudinary.config({
    cloud_name: 'enny',
    api_key: '256698143997345',
    api_secret: 'bFDo0j2JwTGBGqMgWUFuOs5bYB8'
});


const FileType = new GraphQLObjectType({
    name: 'File',
    fields: () => ({
        userId: { type: GraphQLID },
        name: { type: GraphQLString },
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
            resolve(parents, args) {
                return queryFile(args)

            }
        },
        getfiles: {
            type: new GraphQLList(FileType),
            args: { username: { type: GraphQLString } },
            resolve(parent, { username }) {
                return getImage(username)
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        addFile: {
            type: FileType,
            args: {
                filename: { type: new GraphQLNonNull(GraphQLString) },
                url: { type: new GraphQLNonNull(GraphQLString) },
                size: { type: new GraphQLNonNull(GraphQLFloat) },
                username: { type: new GraphQLNonNull(GraphQLString) },
                userId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parents, args) {
                return sendFilesToDb(args)
            }
        },

        deleteFile: {
            type: FileType,
            args: {
                filename: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parents, { filename }) {
                return deleteFiles(filename)
            }
        },
        uploadImage: {
            description: 'Uploads an image.',
            type: FileType,
            args: {
                image: {
                    description: 'Image file.',
                    type: GraphQLUpload
                },
                username: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, { image, username }) {
                const { filename, mimetype, createReadStream } = await image
                let upload_stream = cloudinary.uploader.upload_stream((error, result) => {
                    const { bytes, secure_url } = result
                    var size = byte(bytes)
                    return sendImageToDb(filename, size, secure_url, username)
                })
                const stream = createReadStream()
                stream.pipe(upload_stream)
                return ({
                    name: filename
                })

            }
        }
    }


})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})