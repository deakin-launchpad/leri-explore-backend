'use strict'

const MODELS = require('../models')
const Parser = require('../lib/parser')
const sequelizeInstance = require('../utils/dbHelper').getPGConnection()
const ERROR = require('../config/appConstants').STATUS_MSG.ERROR
const async = require('async')

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

const PredefinedParameterizedQueries = {
  shinchan: function (request, callback) {
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

    request.payload.cases.forEach(item => {
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
                  select s${request.payload.sensor} as c, timestamp as tstp from user_sensors \
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
      },
      function (cb) {
        try {
          MODELS.WorkspaceQueries.create({
            ...request.payload
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

}

module.exports.post = async function (request, callback) {
  if (request.payload.q_type === "PARAMETERIZED") {
    if (!PredefinedParameterizedQueries.hasOwnProperty(request.payload.name)) return callback("That paramterized query doesn't exist")
    return PredefinedParameterizedQueries[request.payload.name](request, callback)
  }

  if (!request.payload.query || !request.payload.query.string) return callback("query.string is required")

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
    },
    function (cb) {
      try {
        MODELS.WorkspaceQueries.create({
          workspace_id: request.params.id,
          ...request.payload
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
