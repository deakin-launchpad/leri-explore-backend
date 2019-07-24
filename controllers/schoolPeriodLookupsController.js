'use strict'

const MODELS = require('../models')

module.exports.getSchoolPeriods = function (params, callback) {
  MODELS.SchoolPeriodLookups.findAll({
    where: {
      school_id: params.school_id
    }
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}
