// GET ALL participants
// GET participant
// POST participant
// PUT participant
// DELETE participant
// POST participants/upload     TODO: Decide if this will be implemented.
// POST participants/url        TODO: Decide if this will be implemented.

const HELPER = require("../utils/helper")
const Joi = require("joi")
const Config = require("../config")
const ParticipantsController = require("../controllers").ParticipantsController

const getAllParticipants = {
  method: "GET",
  path: "/api/participants",
  config: {
    description: "Get all participants",
    auth: 'UserAuth',
    tags: ["api", "participant"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        ParticipantsController.getAll(request, function (err, data) {
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

const getParticipant = {
  method: "GET",
  path: "/api/participants/{id}",
  config: {
    description: "Get a participant of a workspace",
    auth: 'UserAuth',
    tags: ["api", "ws", "participant"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        ParticipantsController.get(request, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      params: {
        id: Joi.number().required()
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

const postParticipant = {
  method: "POST",
  path: "/api/ws/{id}/participants",
  config: {
    description: "Post a participant to a workspace",
    auth: 'UserAuth',
    tags: ["api", "ws", "participant"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        ParticipantsController.post(request, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      payload: {
        q_type: Joi.string().required(),
        name: Joi.string().required(),
        participant: Joi.object().required()
      },
      params: {
        id: Joi.number().required()
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


const putParticipant = {
  method: "PUT",
  path: "/api/ws/{workspace_id}/participants/{id}",
  config: {
    description: "Update a participant in a workspace",
    auth: 'UserAuth',
    tags: ["api", "ws", "participant"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        ParticipantsController.put(request, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      params: {
        workspace_id: Joi.number().required(),
        id: Joi.number().required()
      },
      payload: {
        q_type: Joi.string().required(),
        name: Joi.string().required(),
        participant: Joi.object().required()
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

const deleteParticipant = {
  method: "DELETE",
  path: "/api/ws/{workspace_id}/participants/{id}",
  config: {
    description: "Update a participant in a workspace",
    auth: 'UserAuth',
    tags: ["api", "ws", "participant"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        ParticipantsController.delete(request, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      params: {
        workspace_id: Joi.number().required(),
        id: Joi.number().required()
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
  getAllParticipants,

  // TODO: DO SOMETHING ABOUT THEEEEEEEEEEEEEESE! Or not. I just wanted to leave a TODO: cuz it's shiny.
  // getParticipant,
  // postParticipant,
  // putParticipant,
  // deleteParticipant
]
