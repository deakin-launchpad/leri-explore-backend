const exec = require('child_process').exec
const Papa = require('papaparse')
const async = require('async')
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

function extractData(file, options, cb) {

  // parse CSV

  parseCSV(file, options, (results) => {
    if (!results || !results.data || results.data.length === 0) return cb("No results from parsing!")

    cb(null, results)

  })
}

function processFile(payload, cb) {
  const filePath = payload.file.path
  const root = 'uploads'
  const file = filePath
  const dirr = `${root}/${Date.now()}`
  const headerFilePath = `${dirr}/header.txt`
  const bodyFilePath = `${dirr}/body.txt`

  let bodyFileData

  async.series([
    function (cb) {
      exec(`mkdir ${dirr} && head -n 10 ${file} > ${headerFilePath} && tail -n +11 ${file} > ${bodyFilePath}`,
        function (error, stdout, stderr) {
          if (error || stderr) return cb(error || stderr)
          cb()
        })
    },


    function (cb) {
      const options = {
        skipEmptyLines: 'greedy',
        delimiter: '\t',
      }

      fs.readFile(bodyFilePath, "utf8", (err, bodyFile) => {
        if (err) return cb(err)

        extractData(bodyFile, options, (err, data) => {
          if (err) return cb(err)

          try {
            data.data = data.data.map(row => row[0].split(' ').filter(i => i !== '').map(i => parseInt(i)))
            bodyFileData = data.data
            cb()
          } catch (e) {
            return cb(e)
          }
        })
      })
    },


    function (cb) {
      // TODO: Get timestamp and date from header and use that to set the timestamp of every record
      cb()
    },


    function (cb) {
      // Delete the dirr
      exec(`rm -rf ${dirr}`,
        function (error, stdout, stderr) {
          if (error || stderr) return cb(error || stderr)
          cb()
        })
    }
  ],
    function (err) {
      if (err) return cb(err)
      cb(null, bodyFileData)
    }
  )
}

module.exports.processFile = processFile

// processFile({}, (err, data) => {
//   if (err) return console.log(err)
//   console.log(data)
// })
