const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class ResearcherWorkspaces extends Sequelize.Model { }
ResearcherWorkspaces.init({
  workspace_id: {
    type: Sequelize.INTEGER,
    allowNull: false,

    references: {
      // This is a reference to another model
      model: 'workspaces',

      // This is the column name of the referenced model
      key: 'id'
    }
  },
  researcher_id: {
    type: Sequelize.INTEGER,
    allowNull: false,

    references: {
      // This is a reference to another model
      model: 'researcher_email_lookups',

      // This is the column name of the referenced model
      key: 'id'
    }
  }
}, { sequelize: sequelizeInstance, modelName: 'researcher_workspace', timestamps: true })

module.exports = ResearcherWorkspaces
