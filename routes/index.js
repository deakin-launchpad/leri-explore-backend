'use strict'

module.exports = [].concat(
  require('./workspaceQueryRoutes'),
  require('./researcherRoutes'),
  require('./workspaceRoutes'),
  require('./ageActivityRangeLookupRoutes'),
  require('./schoolPeriodLookupsRoutes'),
  require('./workspaceResearcherRoutes'),
  require('./genericLookupsRoutes')
)

if (process.env === 'test' || 'dev' || 'development') {
  module.exports.push(...require('./devRoutes'))
}
