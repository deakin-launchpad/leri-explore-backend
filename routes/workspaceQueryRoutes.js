const HELPER = require("../utils/helper")
const Joi = require("joi")
const Config = require("../config")
const WorkspaceQueryController = require("../controllers").WorkspaceQueryController

const getAllQueries = {
  method: "GET",
  path: "/api/ws/{id}/queries",
  config: {
    description: "Get all queries of a workspace",
    auth: 'UserAuth',
    tags: ["api", "ws", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceQueryController.getAll(request, function (err, data) {
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

const getQuery = {
  method: "GET",
  path: "/api/ws/{workspace_id}/queries/{id}",
  config: {
    description: "Get a query of a workspace",
    auth: 'UserAuth',
    tags: ["api", "ws", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceQueryController.get(request, function (err, data) {
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

const postQuery = {
  method: "POST",
  path: "/api/ws/{id}/queries",
  config: {
    description: "Post a query to a workspace",
    auth: 'UserAuth',
    tags: ["api", "ws", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceQueryController.post(request, function (err, data) {
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
        query: Joi.object().required()
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


const postRunQuery = {
  method: "POST",
  path: "/api/ws/{id}/queries/run",
  config: {
    description: "Run a query without saving it in a workspace",
    auth: 'UserAuth',
    tags: ["api", "ws", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceQueryController.postRun(request, function (err, data) {
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
        name: Joi.string(),
        query: Joi.object().required()
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


const putQuery = {
  method: "PUT",
  path: "/api/ws/{workspace_id}/queries/{id}",
  config: {
    description: "Update a query in a workspace",
    auth: 'UserAuth',
    tags: ["api", "ws", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceQueryController.put(request, function (err, data) {
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
        query: Joi.object().required()
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

const deleteQuery = {
  method: "DELETE",
  path: "/api/ws/{workspace_id}/queries/{id}",
  config: {
    description: "Delete a query in a workspace",
    auth: 'UserAuth',
    tags: ["api", "ws", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceQueryController.delete(request, function (err, data) {
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


// TODO: Move this and it's controller to their correct file(s).
const uploadFile = {
  method: "POST",
  path: "/api/ws/{id}/upload",
  config: {
    description: "Upload file(s) API",
    auth: 'UserAuth',
    tags: ["api", "upload"],
    payload: {
      maxBytes: 20715200,
      output: 'file',
      parse: true,
      allow: 'multipart/form-data'
    },

    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceQueryController.uploadFile(request, function (err, data) {
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
          .description('Data file(s)')
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

const v2Query = {
  method: "POST",
  path: "/api/v2/query",
  config: {
    description: "Parameterised query v2",
    auth: 'UserAuth',
    tags: ["api", "ws", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        WorkspaceQueryController.postQueryV2(request, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })

      })
    },
    validate: {
      payload: {
        where: Joi.string().description("Where condition for sensor data. NOTE: Not safe from SQL injection"),
        sensor_id: Joi.number().required(),
        dictionary: Joi.array().min(1).required().description("Array of objects of mappings and lookups"),
        run: Joi.boolean().default(false).description("Do you want to run the query?"),
        groups: Joi.array(),
        users: Joi.array().min(1),
        having: Joi.string()
      },
      failAction: HELPER.failActionFunction,
      headers: HELPER.authorizationHeaderObj
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
  getAllQueries,
  getQuery,
  postQuery,
  postRunQuery,
  putQuery,
  deleteQuery,
  uploadFile,
  v2Query
]
