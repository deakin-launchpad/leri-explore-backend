const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class ResearcherEmailLookups extends Sequelize.Model { }
ResearcherEmailLookups.init({
  email_id: { type: Sequelize.STRING, unique: true, allowNull: false }
}, { sequelize: sequelizeInstance, modelName: 'researcher_email_lookup', timestamps: true })

module.exports = ResearcherEmailLookups
