'use strict'

const MODELS = require('../models')
const sequelizeInstance = require('../utils/dbHelper').getPGConnection()

module.exports.createWorkspace = function (request, callback) {
  const userData = request.auth && request.auth.credentials && request.auth.credentials.userData
  console.log(userData)

  let researcher_id, finalData

  MODELS.ResearcherEmailLookups.findOne({
    where: {
      email_id: userData.emailId
    }
  })
    .then(data => {
      if (!data) {
        return callback({
          "statusCode": 400,
          "error": "Bad Request",
          "customMessage": `User record with email ID ${userData.emailId} not found`
        })
      }

      researcher_id = data.id
      return MODELS.Workspaces.create({
        ...request.payload
      })
    })
    .then(data => {
      if (!data || !data.id) {
        console.log("Problem creating workspace")
        return callback({ "statusCode": 500 })
      }

      finalData = data

      return MODELS.ResearcherWorkspaces.create({
        researcher_id: researcher_id,
        workspace_id: data.dataValues.id
      })
    })
    .then(() => {
      callback(null, finalData)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.getAllWorkspaces = function (request, callback) {
  let userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null

  const query = `select
      * from workspaces w INNER JOIN researcher_workspaces r
      ON w.id = r.workspace_id
      where researcher_id = (
        select id from researcher_email_lookups r
        where r."email_id" = '${userData.emailId}'
      )`

  sequelizeInstance.query(query)
    .then(data => {
      callback(null, data[0])
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.getWorkspace = function (request, callback) {
  MODELS.Workspaces.findOne({
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


module.exports.putWorkspace = function (request, callback) {
  MODELS.Workspaces.update(
    {
      ...request.payload
    },
    {
      where: {
        id: request.params.id
      }
    }
  )
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.deleteWorkspace = function (request, callback) {
  MODELS.Workspaces.destroy({
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

