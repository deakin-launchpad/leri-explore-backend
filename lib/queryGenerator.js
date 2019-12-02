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
  let arr = []
  lookup_data.forEach(i => {
    let keys = Object.keys(i)
    let str = "" + map.eval_expr
    str = evalExpressionTypeDelegates[map.eval_expr_type](str, keys, i)
    arr.push(str)
  })
  return "case " + arr.join(' ') + ` end AS ${map.end_as}`
}


async function getLookupData(dictionaryItem, map, user) {
  let data = await MODELS.GenericLookups.findAll({
    where: {
      lookup_name: dictionaryItem.lookup_name,
      entity_id: user[map.lookup_key]
    }
  })

  return data.map(item => item.dataValues.criteria)
}


async function processMapping(dictionaryItem, user) {
  let map = await MODELS.Mappings.findOne({
    where: { map_name: dictionaryItem.map_name }
  })
  if (!map) throw `Map '${dictionaryItem.map_name}' not found`

  let lookup_data

  if (dictionaryItem.lookup_name && dictionaryItem.lookup_name.trim().length > 0)
    lookup_data = await getLookupData(dictionaryItem, map, user)
  else lookup_data = dictionaryItem.lookup_data

  let casesArr = await generateCases(map, lookup_data)
  if (!casesArr || casesArr.length === 0) throw "No cases generated"

  return casesArr
}


async function generateSubQuery(payload, user) {
  let arr = []
  for (let i = 0; i < payload.dictionary.length; i++) {
    let item = payload.dictionary[i]
    item = await processMapping(item, user)
    arr.push(item)
  }
  return "SELECT " + arr.join(', ') + `, selectedSensor, tstp \
  FROM ( \
     SELECT s${payload.sensor_id} as selectedSensor, timestamp AS tstp FROM user_sensors \
     WHERE workspace_id = 1 \
     AND user_id = '${user.id}' \
     ${payload.where ? `AND ${payload.where}` : ''} \
  ) AS foo`
}


async function processSubQueries(payload) {
  // TODO: Implement this in future when we may need mutliple sub-queries.
}

async function wrapMainQuery(payload, user) {
  let subQuery = await generateSubQuery(payload, user)
  let projections = [], groupBys = []
  const groupsSet = [...new Set(payload.groups)]

  groupsSet.forEach(group => {
    switch (group) {
      case "year":
        projections.push("date_part('year', t.tstp) as year")
        groupBys.push("year")
        break
      case "month":
        projections.push("date_part('month', t.tstp) as month")
        groupBys.push("month")
        break
      case "day":
        projections.push("date_part('day', t.tstp) as day")
        groupBys.push("day")
        break
      case "hour":
        projections.push("date_part('hour', t.tstp) as hour")
        groupBys.push("hour")
        break
      case "school_periods":
        projections.push("t.school_periods as school_periods")
        groupBys.push("school_periods")
        break
      case "activity_ranges":
        projections.push("t.activity_ranges as activity_ranges")
        groupBys.push("activity_ranges")
        break
    }
  })

  return `SELECT ${projections.length > 0 ? `${projections.join(", ")},` : ''} \
    count(*) as number_of_occurences, \
    count(*)*15 as "total_duration(in seconds)" \
    FROM (${subQuery}) as t \
    ${groupBys.length > 0 ? `GROUP BY ${groupBys.join(", ")}` : ''} \
    ${payload.having ? `HAVING ${payload.having}` : ''}`
}

module.exports.wrapEverything = async function (payload, user) {
  try {
    return [null, await wrapMainQuery(payload, user)]
  } catch (err) {
    return [err]
  }
}