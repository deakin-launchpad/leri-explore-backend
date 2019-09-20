const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class Participants extends Sequelize.Model { }
Participants.init({
  email_id: { type: Sequelize.STRING, unique: true, allowNull: false },
  age: { type: Sequelize.INTEGER, defaultValue: 20 }
}, { sequelize: sequelizeInstance, modelName: 'participants', timestamps: true })

module.exports = Participants
