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
      const startTime = headerFile[2].substr(headerFile[2].lastIndexOf(' ')).trim()
      const startDate = headerFile[3].substr(headerFile[3].lastIndexOf(' ')).trim()
      const epochArr = headerFile[4].substr(headerFile[4].lastIndexOf(' ')).trim().split(':')
      const mode = headerFile[8].substr(headerFile[8].lastIndexOf(' '));
      //Handle dates entered in mm/dd/yyyy format through dat file
      let datearray = startDate.split('/');
      let newDate = datearray[1] + '/' + datearray[0] + '/' + datearray[2]

      // Calculate total seconds in the given epochArr.
      const totalS = epochArr[0] * 3600 + epochArr[1] * 60 + epochArr[2]

      
      const binary_mode = createBinaryString(mode).split('');
      console.log(binary_mode);
      const fDate = new Date(`${newDate} ${startTime}`)
      bodyFileData = bodyFileData.map((row, i) => {
        return createObjFromRow(row, fDate, totalS, 'seconds', i, params.id, serialNo, binary_mode)
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

function createObjFromRow(row, initialMoment, amountToAdd, units, index, workspace_id, serialNo, mode) {
  return {
    workspace_id: workspace_id,
    user_id: '12345',
    deviceId: serialNo,
    timestamp: moment(new Date(initialMoment)).add(amountToAdd * index, units).format("YYYY-MM-DD HH:mm:ss.SSSZ"),
    s1: row[0],
    s2: mode[3] === '1' ? row[1] : 0,
    s3: mode[2] === '1' ? row[2] : 0,
    s4: mode[5] === '1' ? row[3] : 0,
    s5: mode[4] === '1' ? row[4] : 0,
    s6: mode[1] === '1' ? row[5] : 0,
    s7: mode[0] === '1' ? row[6] : 0, 
    s8: mode[0] === '1' ? row[7] : 0,
    s9: mode[0] === '1' ? row[8]: 0
  }
}

/**
 * Description: Method to convert mode to 8 bit binary number
 * Author: Somanshu Kalra
 * @param nMask 
 */
function createBinaryString (nMask) {
  
  for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
      nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
  return sMask.substring(26, 32);
}
