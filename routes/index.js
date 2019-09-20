'use strict'

module.exports = [].concat(
  require('./workspaceQueryRoutes'),
  require('./researcherRoutes'),
  require('./workspaceRoutes'),
  require('./ageActivityRangeLookupRoutes'),
  require('./schoolPeriodLookupsRoutes'),
  require('./workspaceResearcherRoutes'),
  require('./genericLookupsRoutes'),
  require('./mappingsRoutes'),
  require('./participantsRoutes')
)

if (process.env === 'test' || 'dev' || 'development') {
  module.exports.push(...require('./devRoutes'))
}
