const Sequelize = require('sequelize')
const sequelizeInstance = require('../../utils/dbHelper').getPGConnection()

class WorkspaceQueries extends Sequelize.Model { }
WorkspaceQueries.init({
  workspace_id: {
    type: Sequelize.INTEGER,
    allowNull: false,

    references: {
      // This is a reference to another model
      model: 'workspaces',

      // This is the column name of the referenced model
      key: 'id',
    }
  },
  query: { type: 'JSONB' }
}, { sequelize: sequelizeInstance, modelName: 'workspace_query', timestamps: true })

module.exports = WorkspaceQueries
