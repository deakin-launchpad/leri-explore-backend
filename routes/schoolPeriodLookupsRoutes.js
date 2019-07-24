const HELPER = require("../utils/helper")
const Joi = require("joi")
const Config = require("../config")
const SchoolPeriodLookupsController = require("../controllers").SchoolPeriodLookupsController

const getSchoolPeriods = {
  method: "GET",
  path: "/api/school_periods/{school_id}",
  config: {
    description: "Query API step 2",
    auth: 'UserAuth',
    tags: ["api", "ws", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        SchoolPeriodLookupsController.getSchoolPeriods(request.params, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      params: {
        school_id: Joi.number().required()
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
  getSchoolPeriods
]
