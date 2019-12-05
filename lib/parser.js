const { exec } = require('child_process')
const moment = require('moment-timezone')
const MODELS = require('../models')
const Papa = require('papaparse')
const fs = require('fs')

function createTempDirr(dirr) {
  return new Promise((resolve, reject) => {
    exec(
      `mkdir ${dirr}`,

      function (error, stdout, stderr) {
        if (error || stderr) return reject(error || stderr)
        resolve()
      })
  })
}

function seperateHeaderAndBody(dirr, filePath, index = 0) {
  const headerFilePath = `${dirr}/${index}/header.txt`
  const bodyFilePath = `${dirr}/${index}/body.txt`

  return new Promise((resolve, reject) => {
    exec(
      `mkdir ${dirr + '/' + index} && 
      head -n 10 ${filePath} > ${headerFilePath} && 
      tail -n +11 ${filePath} > ${bodyFilePath}`,

      function (error, stdout, stderr) {
        if (error || stderr) return reject(error || stderr)
        resolve({ headerFilePath, bodyFilePath })
      })
  })
}

function findMaxTS() {
  return new Promise((resolve, reject) => {
    MODELS.UserSensors.max('timestamp')//, { where: { user_id: "asd" } })
    .then(data => {
      resolve(null, data)
    }).catch(err => {
      reject(JSON.stringify(err))
    })
  })
}

function processHeader(headerFilePath, bodyFileData, params) {
  return new Promise((resolve, reject) => {
    fs.readFile(headerFilePath, "utf8", (err, headerFile) => {
      if (err) return reject(err)

      headerFile = headerFile.split('\n')
      const serialNo = headerFile[1].substr(headerFile[1].lastIndexOf(' ')).trim()
      console.log('serialNo:', serialNo)
      const startTime = headerFile[2].substr(headerFile[2].lastIndexOf(' ')).trim()
      const startDate = headerFile[3].substr(headerFile[3].lastIndexOf(' ')).trim()
      const epochArr = headerFile[4].substr(headerFile[4].lastIndexOf(' ')).trim().split(':')

      // Calculate total seconds in the given epochArr.
      const totalS = epochArr[0] * 3600 + epochArr[1] * 60 + epochArr[2]

      const fDate = new Date(`${startDate} ${startTime}`)

      console.log(params.id)
      bodyFileData = bodyFileData.map((row, i) => {
        return createObjFromRow(row, fDate, totalS, 'seconds', i, params.id, serialNo)
      })
      resolve({ bodyFileData })
    })
  })
}

function processBody(bodyFilePath) {
  const options = {
    skipEmptyLines: 'greedy',
    delimiter: '\t',
  }

  return new Promise((resolve, reject) => {
    fs.readFile(bodyFilePath, "utf8", (err, bodyFile) => {
      if (err) return reject(err)

      extractData(bodyFile, options, (err, data) => {
        if (err) return reject(err)

        try {
          data.data = data.data.map(row => row[0].split(' ').filter(i => i !== '').map(i => parseInt(i)))
          bodyFileData = data.data
          resolve({ bodyFileData })
        } catch (e) {
          return reject(e)
        }
      })
    })
  })
}

function findFirstValidRecord() {

}

function deleteTempDirr(dirr) {
  return new Promise((resolve, reject) => {
    exec(`rm -rf ${dirr}`,
      function (error, stdout, stderr) {
        if (error || stderr) return reject(error || stderr)
        resolve()
      })
  })
}

function parseCSV(file, options) {
  return new Promise(resolve => {
    options['complete'] = function (results) {
      resolve(results)
    }
    options['error'] = function (results) {
      console.log('results in error:', results)
      resolve(results)
    }
    Papa.parse(file, options)
  })
}

async function extractData(file, options, cb) {

  // parse CSV

  let results = await parseCSV(file, options)
  if (!results || !results.data || results.data.length === 0) return cb("No results from parsing!")

  cb(null, results)

}

const processMultipleFiles = async function (payload, params, cb) {
  const root = 'uploads'
  let bodyFileData = []
  const dirr = `${root}/${Date.now()}`
  await createTempDirr(dirr)

  try {
    for (let i = 0; i < payload.file.length; ++i) {
      let headerFilePath, bodyFilePath, tempBodyFileData

      const filePath = payload.file[i].path

      const data = await seperateHeaderAndBody(dirr, filePath, i)
      headerFilePath = data.headerFilePath
      bodyFilePath = data.bodyFilePath

      const data2 = await processBody(bodyFilePath)
      tempBodyFileData = data2.bodyFileData

      const data3 = await processHeader(headerFilePath, tempBodyFileData, params)
      bodyFileData.push(...data3.bodyFileData)

    }

    await deleteTempDirr(dirr)
    cb(null, bodyFileData)

  } catch (err) {
    return cb(err)
  }

}

module.exports.processFile = async function (request, cb) {
  const { payload, params } = request
  if (Array.isArray(payload.file) && payload.file.length > 1) return processMultipleFiles(payload, params, cb)
  if (Array.isArray(payload.file) && payload.file.length === 1) payload.file = payload.file[0]

  const filePath = payload.file.path
  const root = 'uploads'
  const dirr = `${root}/${Date.now()}`
  await createTempDirr(dirr)


  let bodyFileData
  let headerFilePath, bodyFilePath
  try {
    const data = await seperateHeaderAndBody(dirr, filePath)
    headerFilePath = data.headerFilePath
    bodyFilePath = data.bodyFilePath

    const data2 = await processBody(bodyFilePath)
    bodyFileData = data2.bodyFileData

    const data3 = await processHeader(headerFilePath, bodyFileData, params)
    bodyFileData = data3.bodyFileData

    await deleteTempDirr(dirr)
    cb(null, bodyFileData)


  } catch (err) {
    return cb(err)
  }

}

function createObjFromRow(row, initialMoment, amountToAdd, units, index, workspace_id, serialNo) {
  return {
    workspace_id: workspace_id,
    user_id: '12345',
    deviceId: 1,
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
