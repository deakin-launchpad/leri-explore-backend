'use strict'

const MODELS = require('../models')
const sequelizeInstance = require('../utils/dbHelper').getPGConnection()

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

module.exports.getLookupNames = function (request, callback) {
  sequelizeInstance.query("SELECT DISTINCT lookup_name from generic_lookups")
    .then(data => {
      callback(null, data[0])
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}
