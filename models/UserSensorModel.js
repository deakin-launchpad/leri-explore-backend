const Sequelize = require('sequelize')
const sequelizeInstance = require('../utils/dbHelper').getPGConnection()

class UserSensor extends Sequelize.Model { }
UserSensor.init({
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

UserSensor.sync({ force: true }) // TODO: Remove the forcing soon.. This drops the table
  .then(() => UserSensor.create({
    user_id: '12345',
    s1: 0,
    s2: 0,
    s3: 0,
    s4: 0,
    s5: 0,
    s6: 0,
    s7: 0,
    s8: 0,
    s9: 0
  }))

module.exports = UserSensor
