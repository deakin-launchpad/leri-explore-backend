const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class SchoolPeriodLookup extends Sequelize.Model { }
SchoolPeriodLookup.init({
  school_id: Sequelize.INTEGER,
  period_name: Sequelize.STRING,
  period_start: { type: 'TIMESTAMP' },
  period_end: { type: 'TIMESTAMP' }
}, { sequelize: sequelizeInstance, modelName: 'school_period_lookup', timestamps: true })
// TODO: Add unique constraint to all 4 columns together

module.exports = SchoolPeriodLookup
