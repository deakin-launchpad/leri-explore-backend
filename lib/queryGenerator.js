'use strict'

const MODELS = require('../models')

const evalExpressionTypeDelegates = {
  range: (str, keys, data) => {
    keys.forEach(k => {
      str = str.replace('!@#$' + k, data[k])
    })
    return str
  }
}

async function generateCases(map, lookup_data) {
  console.log(map.eval_expr_type)
  let arr = []
  lookup_data.forEach(i => {
    let keys = Object.keys(i)
    let str = "" + map.eval_expr
    str = evalExpressionTypeDelegates[map.eval_expr_type](str, keys, i)
    arr.push(str)
  })
  return "case " + arr.join(', ') + ` end AS ${map.end_as}`
}


async function getLookupData(dictionaryItem) {
  let data = await MODELS.GenericLookups.findAll({
    where: { lookup_name: dictionaryItem.lookup_name, entity_id: dictionaryItem.entity_id }
  })

  return data.map((item) => item.dataValues.criteria)
}


async function processMapping(dictionaryItem) {
  let map = await MODELS.Mappings.findOne({
    where: { map_name: dictionaryItem.map_name }
  })
  if (!map) throw `Map '${dictionaryItem.map_name}' not found`

  let lookup_data = await getLookupData(dictionaryItem)

  let casesArr = await generateCases(map, lookup_data)
  if (!casesArr || casesArr.length === 0) throw "No cases generated"

  return casesArr
}


async function generateSubQuery(payload) {
  if (payload.dictionary.length === 1) return await processMapping(payload.dictionary[0])
  
  let arr = []
  for (let i = 0; i < payload.dictionary.length ; i++) {
    let item = payload.dictionary[i]
    item = await processMapping(item)
    arr.push(item)
  }
  return "SELECT " + arr.join(',') + `, selectedSensor, tstp \
  from ( \
     SELECT s${payload.sensor_id} as selectedSensor, timestamp AS tstp FROM user_sensors \
     WHERE workspace_id = 1 \
     ${payload.where ? `AND ${payload.where}` : ''} \
  ) AS foo`
}


async function processSubQueries(payload) {
  // TODO: Implement this.
}


module.exports.wrapEverything = async function (payload) {
  try {
    return [null, await generateSubQuery(payload)]
  } catch (err) {
    return [err]
  }
}
