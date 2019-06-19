'use strict'

const MODELS = require('../models')

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
  MODELS.Workspaces.findAll({
    limit: 100
  })
    .then(data => {
      callback(null, data)
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
  MODELS.Workspaces.update({
    ...request.payload
  }, {
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

