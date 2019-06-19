const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class UserSensors extends Sequelize.Model { }
UserSensors.init({
  user_id: Sequelize.STRING,
  timestamp: { type: 'TIMESTAMP', defaultValue: Sequelize.NOW },
  s1: Sequelize.INTEGER,
  s2: Sequelize.INTEGER,
  s3: Sequelize.INTEGER,
  s4: Sequelize.INTEGER,
  s5: Sequelize.INTEGER,
  s6: Sequelize.INTEGER,
  s7: Sequelize.INTEGER,
  s8: Sequelize.INTEGER,
  s9: Sequelize.INTEGER,
}, { sequelize: sequelizeInstance, modelName: 'user_sensor', timestamps: true })

module.exports = UserSensors
