'use strict'

// const MODELS = require('../models')
// const Parser = require('../lib/parser')
// const sequelizeInstance = require('../utils/dbHelper').getPGConnection()
// const ERROR = require('../config/appConstants').STATUS_MSG.ERROR
// const async = require('async')
const MongoClient = require("mongoose").mongo.MongoClient

module.exports.getAll = function (request, callback) {

  MongoClient.connect(process.env.IPAN_V2_BACKEND_MONGO_URI, (err, mongoConn) => {
    if (err) return callback(err)

    const options = {
      projection: {
        firstLogin: 0,
        emailVerified: 0,
        isBlocked: 0,
        password: 0,
        OTPCode: 0,
        accessToken: 0,
        phoneNumber: 0,
        codeUpdatedAt: 0,
        _id: 0,
        __v: 0,
        countryCode: 0,
        tempPassword: 0
      }
    }

    mongoConn.db("ipan-v2-backend").collection("users").find({}, options).toArray((err, result) => {
      if (err) return callback(err)

      result = result.map(i => {
        i.age = 22
        i.school_id = 1
        i.user_id = '12345'
        return i
      })
      callback(null, result)
    })
  })
}


// module.exports.get = function (request, callback) {

//   MODELS.WorkspaceQueries.findOne({
//     where: {
//       id: request.params.id
//     }
//   })
//     .then(data => {
//       callback(null, data)
//     }).catch(err => {
//       callback(JSON.stringify(err))
//     })
// }


// module.exports.post = async function (request, callback) {
//   MODELS.WorkspaceQueries.create({
//     workspace_id: request.params.id,
//     ...request.payload
//   })
//     .then(data => {
//       return callback(null, data)
//     })
//     .catch(err => {
//       return callback(JSON.stringify(err))
//     })
// }


// module.exports.put = function (request, callback) {
//   MODELS.WorkspaceQueries.update({
//     ...request.payload
//   }, {
//       where: {
//         id: request.params.id
//       }
//     })
//     .then(data => {
//       callback(null, data)
//     }).catch(err => {
//       callback(JSON.stringify(err))
//     })
// }

// module.exports.delete = function (request, callback) {
//   MODELS.WorkspaceQueries.destroy({
//     where: {
//       id: request.params.id
//     }
//   })
//     .then(data => {
//       callback(null, data)
//     }).catch(err => {
//       callback(JSON.stringify(err))
//     })
// }

// module.exports.upload = function (request, callback) {
//   Parser.processFile(request, (err, data) => {
//     if (err) return callback(err)

//     MODELS.UserSensors.bulkCreate(data, {
//       fields: [
//         "workspace_id",
//         "timestamp",
//         "s1",
//         "s2",
//         "s3",
//         "s4",
//         "s5",
//         "s6",
//         "s7",
//         "s8",
//         "s9"
//       ]
//     }).then(() => {
//       callback()
//     }).catch(err => {
//       callback(JSON.stringify(err))
//     })
//   })
// }
