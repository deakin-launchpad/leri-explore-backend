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

function getUsersFromCSV(file, options, cb) {

  // parse CSV

  parseCSV(file, options, (results) => {
    if (!results || !results.data || results.data.length === 0) return cb("No results from parsing!")

    cb(null, results)

  })
}

function processStream(payload, cb) {
  const options = {
    skipEmptyLines: 'greedy',
    delimiter: '\t',
  }

  fs.readFile(payload.file.path, "utf8", (err, data1) => {
    if (err) return cb(err)

    getUsersFromCSV(data1, options, (err, data) => {
      if (err) return cb(err)

      try {
        data.data = data.data.map(row => row[0].split(' ').filter(i => i !== '').map(i => parseInt(i)))
      } catch (e) {
        return cb(e)
      }

      cb(null, data.data)
    })
  })

}

module.exports.processStream = processStream
