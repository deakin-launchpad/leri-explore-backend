const exec = require('child_process').exec
const moment = require('moment-timezone')
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
      // Get timestamp and date from header and use that to set the timestamp of every record.
      fs.readFile(headerFilePath, "utf8", (err, headerFile) => {
        if (err) return cb(err)

        headerFile = headerFile.split('\n')
        const startTime = headerFile[2].substr(headerFile[2].lastIndexOf(' '))
        const startDate = headerFile[3].substr(headerFile[3].lastIndexOf(' '))
        const epochArr = headerFile[4].substr(headerFile[4].lastIndexOf(' ')).split(':')

        // Calculate total seconds in the given epochArr.
        const totalS = epochArr[0] * 3600 + epochArr[1] * 60 + epochArr[2]

        const fDate = new Date(`${startDate} ${startTime}`)

        bodyFileData = bodyFileData.map((row, i) => {
          return createObjFromRow(row, fDate, totalS, 'seconds', i)
        })
        cb()
      })
    },


    function (cb) {
      // Delete the temp dirr created.
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

function createObjFromRow(row, initialMoment, amountToAdd, units, index) {
  return {
    timestamp: moment(new Date(initialMoment)).add(amountToAdd * index, units).format("YYYY-MM-DD HH:mm:ss.SSSZ"), // SSS and Z aint working m8
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

module.exports.processFile = processFile
