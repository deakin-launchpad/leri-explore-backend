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

var uploadFile = function (payload, callback) {
  Parser.processFile(payload, (err, data) => {
    if (err) return callback(err)

    MODELS.UserSensor.bulkCreate(data, {
      fields: [
        "timestamp",
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
