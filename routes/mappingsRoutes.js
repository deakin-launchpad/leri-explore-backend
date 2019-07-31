const HELPER = require("../utils/helper")
const Joi = require("joi")
const Config = require("../config")
const MappingsController = require("../controllers").MappingsController

const getMappings = {
  method: "GET",
  path: "/api/mappings/names",
  config: {
    description: "Get lookup names",
    auth: 'UserAuth',
    tags: ["api", "ws", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        MappingsController.getMappings(request, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
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
  getMappings
]
