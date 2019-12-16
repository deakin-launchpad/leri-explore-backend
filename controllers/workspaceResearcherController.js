'use strict'

const MODELS = require('../models')

module.exports.createWorkspaceResearcher = function (request, callback) {
  let researcher_id
  const payload = request.payload

  MODELS.ResearcherEmailLookups.findOne({
    where: {
      email_id: payload.emailId
    }
  })
    .then(data => {
      if (!data) {
        return callback({
          "statusCode": 400,
          "error": "Bad Request",
          "customMessage": `User record with email ID ${payload.emailId} not found`
        })
      }


      researcher_id = data.id

      return MODELS.Workspaces.findOne({
        where: {
          ...request.params
        }
      })
    })
    .then(data => {
      if (!data) {
        return callback({
          "statusCode": 400,
          "error": "Bad Request",
          "customMessage": `Workspace record with workspace ID ${request.params.id} not found`
        })
      }

      return MODELS.ResearcherWorkspaces.findOrCreate({
        where: {
          researcher_id: researcher_id,
          workspace_id: data.dataValues.id
        }
      })
    })
    .then(data => {
      if (data[1] === false) return callback({
        "statusCode": 400,
        "error": "Bad Request",
        "customMessage": `Researcher already exists in this workspace`
      })
      callback(null, data[0])
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.getAllWorkspaceResearchers = function (request, callback) {
  MODELS.ResearcherWorkspaces.findAll({
    where: {
      workspace_id: request.params.id
    },
    include: [{
      model: MODELS.ResearcherEmailLookups,
      as: 'researcher_details',
      required: true
    }]
  })
    .then(data => {
      if (!data) return callback({
        "statusCode": 400,
        "error": "Bad Request",
        "customMessage": "No record found. Please check request parameters."
      })

      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.getWorkspaceResearcher = function (request, callback) {
  MODELS.ResearcherWorkspaces.findOne({
    where: {
      workspace_id: request.params.workspace_id,
      researcher_id: request.params.id
    },
    include: [{
      model: MODELS.ResearcherEmailLookups,
      as: 'researcher_details',
      required: true
    }]
  })
    .then(data => {
      if (!data) return callback({
        "statusCode": 400,
        "error": "Bad Request",
        "customMessage": "No record found. Please check request parameters."
      })

      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.putWorkspaceResearcher = function (request, callback) {
  MODELS.ResearcherWorkspaces.update(
    {
      ...request.payload
    },
    {
      where: {
        workspace_id: request.params.workspace_id,
        researcher_id: request.params.id
      }
    }
  )
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.deleteWorkspaceResearcher = function (request, callback) {
  MODELS.ResearcherWorkspaces.destroy({
    where: {
      id: request.params.id
    }
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}

