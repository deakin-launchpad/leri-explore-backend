/**
 * Created by Navit on 15/11/16.
 */
var UniversalFunctions = require("../utils/UniversalFunctions")
var Joi = require("joi")
var Config = require("../config")
var Controller = require("../controllers")

var getQuery = {
  method: "POST",
  path: "/api/query/",
  config: {
    description: "Query API",
    tags: ["api", "query"],
    handler: function (request, h) {
      var payload = request.payload
      return new Promise((resolve, reject) => {
        Controller.QueryController.getResults(payload, function (err, data) {
          if (err) return reject(UniversalFunctions.sendError(err))
          resolve(
            UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      payload: {
        query: Joi.string().required()
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}

var uploadFile = {
  method: "POST",
  path: "/api/upload/",
  config: {
    description: "Upload file API",
    tags: ["api", "upload"],
    payload: {
      maxBytes: 20715200,
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    },

    handler: function (request, h) {
      var payload = request.payload
      return new Promise((resolve, reject) => {
        Controller.QueryController.uploadFile(payload, function (err, data) {
          if (err) return reject(UniversalFunctions.sendError(err))
          resolve(
            UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      payload: {
        file: Joi.any()
          .meta({ swaggerType: 'file' })
          .required()
          .description('Data file')
      },
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}


module.exports = [
  getQuery,
  uploadFile
]
