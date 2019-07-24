'use strict'

const MODELS = require('../models')

module.exports.getLookups = function (request, callback) {
  MODELS.GenericLookups.findAll({
    where: {
      ...request.query
    }
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}
