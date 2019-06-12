const Sequelize = require('sequelize')
const sequelizeInstance = require('../utils/dbHelper').getPGConnection()

class AgeActivityRangeLookup extends Sequelize.Model { }
AgeActivityRangeLookup.init({
  age: Sequelize.INTEGER,
  activityId: Sequelize.INTEGER,
  min: Sequelize.INTEGER,
  max: Sequelize.INTEGER
}, { sequelize: sequelizeInstance, modelName: 'age_activity_range_lookup', timestamps: true })
// TODO: Add unique constraint to all 4 columns together

AgeActivityRangeLookup.sync({ force: true }) // TODO: Remove the forcing soon.. This drops the table
  .then(() => {

    let allObjs = []
    let keys = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    for (let i = 0; i < 100; ++i) { // loop for ages

      let ageSD = 0
      if (i < 10) ageSD = 0
      else if (i < 20) ageSD = 20
      else if (i < 40) ageSD = 10
      else if (i < 50) ageSD = -10
      else if (i < 60) ageSD = -20

      else if (i > 79) ageSD = -50
      else if (i > 59) ageSD = -30

      keys.forEach((k, j) => {
        allObjs.push({
          age: i + 1,
          activityId: k,
          min: (j * 100 + ageSD) < 0 ? 0 : (j * 100 + ageSD),
          max: (j + 1) * 100 + ageSD
        })
      })
    }

    AgeActivityRangeLookup.bulkCreate(allObjs)

  })

module.exports = AgeActivityRangeLookup
