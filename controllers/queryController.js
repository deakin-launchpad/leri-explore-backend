var UniversalFunctions = require("../utils/UniversalFunctions")
var async = require("async")
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
var MODELS = require('../models')
var Parser = require("../lib/parser")


var getResults = function (payload, callback) {
  // if (!payload.query || payload.query === '') return
  MODELS.UserSensor.findAll({ limit: 100, orer: "DESC" })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      return callback(JSON.stringify(err))
    })
}

function createObjFromRow(row) {
  return {
    s1: row[0],
    s2: row[1],
    s3: row[2],
    s4: row[3],
    s5: row[4],
    s6: row[5],
    s7: row[6],
    s8: row[7],
    s9: row[8]
  }
}

var uploadFile = function (payload, callback) {
  Parser.processStream(payload, (err, data) => {
    if (err) return callback(err)

    data = data.map(row => {
      return createObjFromRow(row)
    })

    MODELS.UserSensor.bulkCreate(data, {
      fields: [
        "s1",
        "s2",
        "s3",
        "s4",
        "s5",
        "s6",
        "s7",
        "s8",
        "s9"
      ]
    }).then(() => {
      callback()
    }).catch(err => {
      return callback(JSON.stringify(err))
    })

  })
}

module.exports = {
  getResults: getResults,
  uploadFile: uploadFile
}
