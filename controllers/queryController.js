'use strict'

const MODELS = require('../models')
const Parser = require('../lib/parser')
const sequelizeInstance = require('../utils/dbHelper').getPGConnection()
const ERROR = require('../config/appConstants').STATUS_MSG.ERROR
const async = require('async')

module.exports.getAgeActivityRanges = function (params, callback) {
  MODELS.AgeActivityRangeLookups.findAll({
    where: {
      age: params.age
    }
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}

module.exports.getQueries = function (userData, callback) {
  const query = `select \
  * from researcher_queries \
  where "researcher_id" = ( \
    select id from researcher_email_lookups r \
    where r."emailId" = '${userData.emailId}' \
  )
  order by id DESC
  limit 100
  `
  sequelizeInstance.query(query)
    .then(data => {
      callback(null, data[0])
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}

module.exports.getResults = async function (userData, payload, callback) {

  let projections = [], groupBys = [], prepareCases = []

  payload.groups.forEach(group => {
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
    }
  })

  payload.cases.forEach(item => {
    if (item.min && item.max) prepareCases.push(`when foo.c between ${item.min} and ${item.max} then '${item.min} - ${item.max}'`)
    else if (item.min) prepareCases.push(`when foo.c > ${item.min} then '> ${item.min}'`)
    else if (item.max) prepareCases.push(`when foo.c < ${item.max} then '< ${item.max}'`)
  })

  const query = `select \
	${projections.join(', ')}, \
	t.range as ranges, \
	count(*) as number_of_occurences, \
	count(*)*15 as "total_duration(in seconds)" \
  from ( \
      select case \
      ${prepareCases.join(' ')} \
      end as range, \
      foo.tstp as tstp \
      from ( \
          select c, tstp \
          from ( \
              select s${payload.sensor} as c, timestamp as tstp from user_sensors \
          ) as agg \
      ) as foo \
  ) as t \
  group by \
    ${groupBys.join(',')}, ranges \
  order by \
    ${groupBys.join(',')}, ranges`

  /** Cases example:
   *  when foo.c between 0 and 100 then '0-100' \
      when foo.c between 100 and 200 then '100-200' \
      when foo.c > 200 then 'Above 200'  \
  */

  let resultData, requiredResearcherWorkspace = ''

  async.series([
    function (cb) {
      sequelizeInstance.query(query)
        .then(data => {
          // We use data[0] here since .query() returns some meta about the query as well.
          resultData = data[0]
          return cb()
        })
        .catch(err => {
          return cb(JSON.stringify(err))
        })
    },
    function (cb) {
      const query = `select
      id from researcher_workspaces
      where workspace_id = ${payload.workspace_id} and researcher_id = (
        select id from researcher_email_lookups r
        where r."emailId" = '${userData.emailId}'
      )`
      sequelizeInstance.query(query)
        .then(data => {
          if (!data || data.length === 0) return cb('No record found')
          requiredResearcherWorkspace = data[0][0]

          return cb()
        })
        .catch(err => {
          return cb(JSON.stringify(err))
        })
    },
    function (cb) {
      try {
        MODELS.ResearcherWorkspaceQueries.create({
          researcher_workspace_id: requiredResearcherWorkspace.id,
          query: {
            ...payload
          }
        })
          .then(() => {
            return cb()
          })
          .catch(err => {
            return cb(JSON.stringify(err))
          })
      } catch (err) {
        return cb(ERROR.IMP_ERROR)
      }
    }
  ],
    function (err) {
      if (err) return callback(err)
      callback(null, resultData)
    }
  )
}

module.exports.uploadFile = function (payload, callback) {
  Parser.processFile(payload, (err, data) => {
    if (err) return callback(err)

    MODELS.UserSensors.bulkCreate(data, {
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
      callback(JSON.stringify(err))
    })
  })
}
