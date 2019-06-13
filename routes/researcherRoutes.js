const UniversalFunctions = require("../utils/UniversalFunctions")
const Joi = require("joi")
const Config = require("../config")
const Controllers = require("../controllers")

const researcherLogin = {
  method: "POST",
  path: "/api/researcher/login",
  config: {
    description: "Researcher Login API",
    tags: ["api", "researcher"],
    handler: (request, reply) => {
      return new Promise((resolve, reject) => {
        if (!UniversalFunctions.verifyEmailFormat(request.payload.emailId))
          return reject(UniversalFunctions.sendError(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));

        Controllers.ResearcherController.researcherLogin(request.payload, function (err, data) {
          if (err) return reject(UniversalFunctions.sendError(err))

          resolve(
            UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      payload: {
        emailId: Joi.string().required(),
        password: Joi.string().required()
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

const researcherRegister = {
  method: "POST",
  path: "/api/researcher/register",
  config: {
    description: "Researcher Register API",
    tags: ["api", "researcher"],
    handler: (request, h) => {
      return new Promise((resolve, reject) => {
        if (!UniversalFunctions.verifyEmailFormat(request.payload.emailId))
          return reject(UniversalFunctions.sendError(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));

        Controllers.ResearcherController.researcherRegister(request.payload, function (err, data) {
          if (err) return reject(UniversalFunctions.sendError(err))

          resolve(
            UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      payload: {
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        emailId: Joi.string().required(),
        password: Joi.string().required()
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
  researcherLogin,
  researcherRegister
]
