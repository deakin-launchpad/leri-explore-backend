/**
 * Created by Navit on 15/11/16.
 */
const HELPER = require("../utils/helper")
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
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      params: {
        age: Joi.number().required()
      },
      failAction: HELPER.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          HELPER.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}

const getQueries = {
  method: "GET",
  path: "/api/queries",
  config: {
    description: "Get queries",
    tags: ["api", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        Controllers.QueryController.getQueries(function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      failAction: HELPER.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          HELPER.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}

const postQuery = {
  method: "POST",
  path: "/api/query",
  config: {
    description: "Query API step 2",
    tags: ["api", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        Controllers.QueryController.getResults(request.payload, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      payload: {
        groups: Joi.array().items(Joi.string()),
        cases: Joi.array().items(Joi.object().keys(
          {
            min: Joi.number(),
            max: Joi.number()
          }
        )),
        sensor: Joi.number().required()
      },
      failAction: HELPER.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          HELPER.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
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
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
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
      failAction: HELPER.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          HELPER.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}


module.exports = [
  getAgeActivityRanges,
  getQueries,
  postQuery,
  uploadFile
]
