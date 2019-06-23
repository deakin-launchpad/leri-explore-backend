'use strict'

const MODELS = require('../models')
const sequelizeInstance = require('../utils/dbHelper').getPGConnection()

module.exports.createWorkspace = function (request, callback) {
  MODELS.Workspaces.create({
    ...request.payload
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.getAllWorkspaces = function (request, callback) {
  let userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null

  const query = `select
      * from researcher_workspaces
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

