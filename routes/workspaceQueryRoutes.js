const HELPER = require("../utils/helper")
const Joi = require("joi")
const Config = require("../config")
const Controllers = require("../controllers")

const getAgeActivityRanges = {
  method: "GET",
  path: "/api/age_activity_ranges/{age}",
  config: {
    description: "Query API step 1",
    auth: 'UserAuth',
    tags: ["api", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        Controllers.WorkspaceQueryController.getAgeActivityRanges(request.params, function (err, data) {
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

const getAllQueries = {
  method: "GET",
  path: "/api/ws/{id}/queries",
  config: {
    description: "Get queries",
    auth: 'UserAuth',
    tags: ["api", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        Controllers.WorkspaceQueryController.getAllQueries(request, function (err, data) {
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

const getQuery = {
  method: "GET",
  path: "/api/ws/{workspace_id}/queries/{id}",
  config: {
    description: "Update a query in a workspace",
    auth: 'UserAuth',
    tags: ["api", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        Controllers.WorkspaceQueryController.getQuery(request, function (err, data) {
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
    tags: ["api", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        Controllers.WorkspaceQueryController.postQuery(request, function (err, data) {
          if (err) return reject(HELPER.sendError(err))
          resolve(
            HELPER.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, data)
          )
        })
      })
    },
    validate: {
      payload: {
        workspace_id: Joi.number().required(),
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

const putQuery = {
  method: "PUT",
  path: "/api/ws/{workspace_id}/queries/{id}",
  config: {
    description: "Update a query in a workspace",
    auth: 'UserAuth',
    tags: ["api", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        Controllers.WorkspaceQueryController.putQuery(request, function (err, data) {
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
        title: Joi.string().required()
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
    description: "Update a query in a workspace",
    auth: 'UserAuth',
    tags: ["api", "query"],
    handler: function (request, h) {
      return new Promise((resolve, reject) => {
        Controllers.WorkspaceQueryController.deleteQuery(request, function (err, data) {
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

const uploadFile = {
  method: "POST",
  path: "/api/upload",
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
      const payload = request.payload
      return new Promise((resolve, reject) => {
        Controllers.WorkspaceQueryController.uploadFile(payload, function (err, data) {
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
  getAgeActivityRanges,
  getAllQueries,
  getQuery,
  postQuery,
  putQuery,
  deleteQuery,
  uploadFile
]