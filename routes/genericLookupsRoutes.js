const HELPER = require("../utils/helper")
const Joi = require("joi")
const Config = require("../config")
const GenericLookupsController = require("../controllers").GenericLookupsController

const getLookups = {
  method: "GET",
  path: "/api/lookups",
  config: {
    description: "Query API step lol",
    auth: 'UserAuth',
    tags: ["api", "ws", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        GenericLookupsController.getLookups(request, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      query: {
        entity_id: Joi.string().required(),
        lookup_name: Joi.string().required()
      },
      headers: HELPER.authorizationHeaderObj,
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

const testRoute = {
  method: "POST",
  path: "/api/testRoute",
  config: {
    description: "Query API step 2",
    auth: 'UserAuth',
    tags: ["api", "ws", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        

        resolve(
          HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT)
        )

      })
    },
    validate: {
      payload: {
        data: Joi.string()
      },
      headers: HELPER.authorizationHeaderObj,
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
  getLookups,
  testRoute
]
