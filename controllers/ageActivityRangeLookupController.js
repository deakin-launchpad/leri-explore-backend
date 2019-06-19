'use strict'

const MODELS = require('../models')

module.exports.getAgeActivityRanges = function (params, callback) {
  MODELS.AgeActivityRangeLookups.findAll({
    where: {
      age: params.age
    }
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}
