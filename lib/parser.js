const Papa = require('papaparse')
const fs = require('fs')


function parseCSV(file, options, cb) {
  options['complete'] = function (results) {
    cb(results)
  }
  options['error'] = function (results) {
    console.log('results in error:', results)
    cb(results)
  }
  Papa.parse(file, options)
}

function getUsersFromCSV(payload, options, cb) {

  // parse CSV

  parseCSV(payload.file, options, (results) => {
    if (!results || !results.data || results.data.length === 0) return cb("No results from parsing!")

    cb(null, results)

  })
}

function processStream(payload, cb) {
  const options = {
    skipEmptyLines: 'greedy',
    delimiter: '\t',
  }

  // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  // console.log(payload.file)

  // payload.file = payload.file.substring(payload.file.indexOf("\n") + 10)

  getUsersFromCSV(payload, options, (err, data) => {
    if (err) return cb(err)
    try {
      data.data = data.data.map(row => row[0].split(' ').filter(i => i !== '').map(i => parseInt(i)))
    } catch (e) {
      return cb(e)
    }

    cb(null, data.data)
  })

}

module.exports.processStream = processStream
