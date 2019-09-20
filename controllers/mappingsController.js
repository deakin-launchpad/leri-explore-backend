'use strict'

const MODELS = require('../models')
// const sequelizeInstance = require('../utils/dbHelper').getPGConnection()

module.exports.getMappings = function (request, callback) {
  MODELS.Mappings.findAll({
    attributes: ['id', 'map_name', 'group_bys']
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}
