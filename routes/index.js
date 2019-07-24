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
