'use strict'

const MODELS = require('../models')
const Parser = require('../lib/parser')
const sequelizeInstance = require('../utils/dbHelper').getPGConnection()
const ERROR = require('../config/appConstants').STATUS_MSG.ERROR
const async = require('async')
const queryGenerator = require('../lib/queryGenerator')

module.exports.getAll = function (request, callback) {
  MODELS.WorkspaceQueries.findAll({
    where: {
      workspace_id: request.params.id
    },
    limit: 100
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}

module.exports.get = function (request, callback) {
  MODELS.WorkspaceQueries.findOne({
    where: {
      id: request.params.id
    }
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}

const PredefinedParameterizedQueries = {
  shinchan: function (request, callback) {
    let projections = [], groupBys = [], prepareCases = [], finalPreparedPeriodsStatement

    if (!request.payload.query.data) return callback("query.data is required")

    let qData = request.payload.query.data
    if (!qData.groups || !qData.cases || !qData.sensor) return callback("Please send all required data for this PARAMETERIZED query")

    const groupsSet = [...new Set(request.payload.query.data.groups)]

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
        case "periods":
          if (!request.payload.query.data.periods || request.payload.query.data.periods.length === 0)
            return callback("Please include valid period objects when selecting `periods` group by")

          projections.push("t.period as periods")
          groupBys.push("periods")


          let preparePeriods = []

          // Period name, start and end time will be sent by the frontend
          request.payload.query.data.periods.forEach(item => {
            if (item.range_name && item.from && item.to) {
              preparePeriods.push(
                `when foo.tstp::time BETWEEN \
                TIME '${item.from}' AND TIME '${item.to}' \
                THEN '${item.range_name}'`)
            }
          })

          finalPreparedPeriodsStatement = `case ${preparePeriods.join(' ')} end as period,`

          break
      }
    })

    request.payload.query.data.cases.forEach(item => {
      if (item.from && item.to) prepareCases.push(`when foo.c between ${item.from} and ${item.to} then '${item.from} - ${item.to}'`)
      else if (item.from) prepareCases.push(`when foo.c > ${item.from} then '> ${item.from}'`)
      else if (item.to) prepareCases.push(`when foo.c < ${item.to} then '< ${item.to}'`)
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
          ${finalPreparedPeriodsStatement ? finalPreparedPeriodsStatement : ''} \
          c, tstp \
          from ( \
            select s${request.payload.query.data.sensor} as c, timestamp as tstp from user_sensors where workspace_id = request.params.id \
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

    let resultData

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
      }
    ],
      function (err) {
        if (err) return callback(err)
        callback(null, resultData)
      }
    )
  }

}

module.exports.postRun = async function (request, callback) {
  if (request.payload.q_type === "PARAMETERIZED") {
    if (!PredefinedParameterizedQueries.hasOwnProperty(request.payload.name)) return callback("That paramterized query doesn't exist")
    return PredefinedParameterizedQueries[request.payload.name](request, callback)
  }

  if (!request.payload.query.string) return callback("query.string is required")

  let resultData

  async.series([
    function (cb) {
      sequelizeInstance.query(request.payload.query.string)
        .then(data => {
          // We use data[0] here since .query() returns some meta about the query as well.
          resultData = data[0]
          return cb()
        })
        .catch(err => {
          return cb(JSON.stringify(err))
        })
    }
  ],
    function (err) {
      if (err) return callback(err)
      callback(null, resultData)
    }
  )

}


module.exports.post = async function (request, callback) {
  MODELS.WorkspaceQueries.create({
    workspace_id: request.params.id,
    ...request.payload
  })
    .then(data => {
      return callback(null, data)
    })
    .catch(err => {
      return callback(JSON.stringify(err))
    })
}


module.exports.put = function (request, callback) {
  MODELS.WorkspaceQueries.update({
    ...request.payload
  }, {
      where: {
        id: request.params.id
      }
    })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}

module.exports.delete = function (request, callback) {
  MODELS.WorkspaceQueries.destroy({
    where: {
      id: request.params.id
    }
  })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}

module.exports.uploadFile = function (request, callback) {
  Parser.processFile(request, (err, data) => {
    if (err) return callback(err)

    MODELS.UserSensors.bulkCreate(data, {
      fields: [
        "workspace_id",
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

module.exports.postQueryV2 = async function (request, callback) {
  let [err, value] = await queryGenerator.wrapEverything(request.payload)
  if (!request.payload.run) return callback(err, value)

  sequelizeInstance.query(value)
    .then(data => {
      callback(null, data[0])
    }).catch(err => {
      callback(JSON.stringify(err))
    })

}
