'use strict'

const MODELS = require('../models')

module.exports.createWorkspace = function (payload, callback) {
  MODELS.Workspaces.create({
    ...payload
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.getAllWorkspaces = function (callback) {
  MODELS.Workspaces.findAll({
    limit: 100
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}


module.exports.getWorkspace = function (params, callback) {
  MODELS.Workspaces.findOne({
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
  MODELS.Workspaces.update({
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
  MODELS.Workspaces.destroy({
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

