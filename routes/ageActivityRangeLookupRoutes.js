const HELPER = require("../utils/helper")
const Joi = require("joi")
const Config = require("../config")
const AgeActivityRangeLookupController = require("../controllers").AgeActivityRangeLookupController

const getAgeActivityRanges = {
  method: "GET",
  path: "/api/age_activity_ranges/{age}",
  config: {
    description: "Query API step 1",
    auth: 'UserAuth',
    tags: ["api", "ws", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        AgeActivityRangeLookupController.getAgeActivityRanges(request.params, function (err, data) {
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
  getAgeActivityRanges
]
