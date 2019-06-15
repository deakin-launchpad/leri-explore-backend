const MODELS = require('../models')
const Parser = require("../lib/parser")
const sequelizeInstance = require('../utils/dbHelper').getPGConnection()

const getAgeActivityRanges = function (params, callback) {
  MODELS.AgeRangeLookup.findAll({
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


const getResults = function (payload, callback) {

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
    else if (item.min)        prepareCases.push(`when foo.c > ${item.min} then '> ${item.min}'`)
    else if (item.max)        prepareCases.push(`when foo.c < ${item.max} then '< ${item.max}'`)
  })

  let query = `select \
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

  sequelizeInstance.query(query)
    // MODELS.UserSensor.findAll({ limit: 100, orer: "DESC" })
    .then(data => {
      callback(null, data)
    }).catch(err => {
      callback(JSON.stringify(err))
    })
}

const uploadFile = function (payload, callback) {
  Parser.processFile(payload, (err, data) => {
    if (err) return callback(err)

    MODELS.UserSensor.bulkCreate(data, {
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

module.exports = {
  getAgeActivityRanges: getAgeActivityRanges,
  getResults: getResults,
  uploadFile: uploadFile
}
