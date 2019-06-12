/**
 * Created by Navit on 15/11/16.
 */
const UniversalFunctions = require("../utils/UniversalFunctions")
const Joi = require("joi")
const Config = require("../config")
const Controllers = require("../controllers")

const getAgeActivityRanges = {
  method: "GET",
  path: "/api/age_activity_ranges/{age}",
  config: {
    description: "Query API step 1",
    tags: ["api", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        Controllers.QueryController.getAgeActivityRanges(request.params, function (err, data) {
          if (err) return reject(UniversalFunctions.sendError(err))
          resolve(
            UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      params: {
        age: Joi.number().required()
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

const postQuery = {
  method: "POST",
  path: "/api/query",
  config: {
    description: "Query API",
    tags: ["api", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        Controllers.QueryController.getResults(request.payload, function (err, data) {
          if (err) return reject(UniversalFunctions.sendError(err))
          resolve(
            UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      payload: {
        groups: Joi.array().items(Joi.string()),
        cases: Joi.string().trim().required(),
        sensor: Joi.number().required()
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

const uploadFile = {
  method: "POST",
  path: "/api/upload",
  config: {
    description: "Upload file API",
    tags: ["api", "upload"],
    payload: {
      maxBytes: 20715200,
      output: 'file',
      parse: true,
      allow: 'multipart/form-data'
    },

    handler: function (request, h) {
      const payload = request.payload
      return new Promise((resolve, reject) => {
        Controllers.QueryController.uploadFile(payload, function (err, data) {
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
  getAgeActivityRanges,
  postQuery,
  uploadFile
]
