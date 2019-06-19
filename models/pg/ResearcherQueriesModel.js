const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class ResearcherWorkspaceQueries extends Sequelize.Model { }
ResearcherWorkspaceQueries.init({
  researcher_workspace_id: {
    type: Sequelize.INTEGER,
    allowNull: false,

    references: {
      // This is a reference to another model
      model: 'researcher_workspaces',

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  query: { type: 'JSONB' }
}, { sequelize: sequelizeInstance, modelName: 'researcher_workspace_query', timestamps: true })

module.exports = ResearcherWorkspaceQueries
