const HELPER = require("../utils/helper")
const Joi = require("joi")
const Config = require("../config")
const WorkspaceResearcherController = require("../controllers").WorkspaceResearcherController

const createWorkspaceResearcher = {
  method: "POST",
  path: "/api/ws/{id}/researchers",
  config: {
    description: "Add a researcher to a workspace",
    auth: 'UserAuth',
    tags: ["api", "ws"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceResearcherController.createWorkspaceResearcher(request, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      payload: {
        emailId: Joi.string().required().description("User ID to add")
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

const getAllWorkspaceResearchers = {
  method: "GET",
  path: "/api/ws/{id}/researchers",
  config: {
    description: "Get all workspaces researchers",
    auth: 'UserAuth',
    tags: ["api", "ws"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceResearcherController.getAllWorkspaceResearchers(request, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      headers: HELPER.authorizationHeaderObj,
      failAction: HELPER.failActionFunction,
      params: {
        id: Joi.number().required()
      },
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          HELPER.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
}

const getWorkspaceResearcher = {
  method: "GET",
  path: "/api/ws/{workspace_id}/researchers/{id}",
  config: {
    description: "Get specific workspace researcher",
    auth: 'UserAuth',
    tags: ["api", "ws"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceResearcherController.getWorkspaceResearcher(request, function (err, data) {
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

//TODO: Enable this in future
const putWorkspaceResearcher = {
  method: "PUT",
  path: "/api/ws/{workspace_id}/researchers/{id}",
  config: {
    description: "Update specific workspace researcher",
    auth: 'UserAuth',
    tags: ["api", "ws"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceResearcherController.putWorkspaceResearcher(request, function (err, data) {
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
        // TODO: Add role here or anything relevant.
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

const deleteWorkspaceResearcher = {
  method: "DELETE",
  path: "/api/ws/{workspace_id}/researchers/{id}",
  config: {
    description: "Delete a specific workspace researcher",
    auth: 'UserAuth',
    tags: ["api", "ws"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceResearcherController.deleteWorkspaceResearcher(request, function (err, data) {
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
  createWorkspaceResearcher,
  getAllWorkspaceResearchers,
  getWorkspaceResearcher,
  // putWorkspaceResearcher,
  deleteWorkspaceResearcher,
]
