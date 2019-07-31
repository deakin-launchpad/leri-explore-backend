const HELPER = require("../utils/helper")
const Joi = require("joi")
const Config = require("../config")
const WorkspaceQueryController = require("../controllers").WorkspaceQueryController

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
  testRoute
]
