const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class AgeActivityRangeLookups extends Sequelize.Model { }
AgeActivityRangeLookups.init({
  age: Sequelize.INTEGER,
  activity_id: Sequelize.INTEGER,
  min: Sequelize.INTEGER,
  max: Sequelize.INTEGER
}, { sequelize: sequelizeInstance, modelName: 'age_activity_range_lookup', timestamps: true })
// TODO: Add unique constraint to all 4 columns together

module.exports = AgeActivityRangeLookups
