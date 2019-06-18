'use strict'

const MODELS = require('../models')

module.exports.createWorkspace = function (payload, callback) {
  MODELS.Workspace.create({
    ...payload
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.getAllWorkspaces = function (callback) {
  MODELS.Workspace.findAll({
    limit: 100
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.getWorkspace = function (params, callback) {
  MODELS.Workspace.findOne({
    where: {
      id: params.id
    }
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.putWorkspace = function (params, payload, callback) {
  MODELS.Workspace.update({
    ...payload
  }, {
    where: {
      id: params.id
    }
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.deleteWorkspace = function (params, callback) {
  MODELS.Workspace.destroy({
    where: {
      id: params.id
    }
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}

