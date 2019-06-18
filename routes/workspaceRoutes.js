const HELPER = require("../utils/helper")
const Joi = require("joi")
const Config = require("../config")
const WorkspaceController = require("../controllers").WorkspaceController

const createWorkspace = {
  method: "POST",
  path: "/api/ws",
  config: {
    description: "Create a new workspace",
    tags: ["api", "ws"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceController.createWorkspace(request.payload, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      payload: {
        title: Joi.string().required()
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

const getAllWorkspaces = {
  method: "GET",
  path: "/api/ws",
  config: {
    description: "Get all workspaces",
    tags: ["api", "ws"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceController.getAllWorkspaces(function (err, data) {
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

const getWorkspace = {
  method: "GET",
  path: "/api/ws/{id}",
  config: {
    description: "Get specific workspace",
    tags: ["api", "ws"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceController.getWorkspace(request.params, function (err, data) {
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

const putWorkspace = {
  method: "PUT",
  path: "/api/ws/{id}",
  config: {
    description: "Update specific workspace",
    tags: ["api", "ws"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceController.putWorkspace(request.params, request.payload, function (err, data) {
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
      payload: {
        title: Joi.string().required()
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

const deleteWorkspace = {
  method: "DELETE",
  path: "/api/ws/{id}",
  config: {
    description: "Delete specific workspace",
    tags: ["api", "ws"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceController.deleteWorkspace(request.params, function (err, data) {
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
  createWorkspace,
  getAllWorkspaces,
  getWorkspace,
  putWorkspace,
  deleteWorkspace,
]
