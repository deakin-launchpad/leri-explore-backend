'use strict'

const QueryRoutes = require('./queryRoutes')
const ResearcherRoutes = require('./researcherRoutes')
const WorkspaceRoutes = require('./workspaceRoutes')
const APIs = [].concat(QueryRoutes, ResearcherRoutes, WorkspaceRoutes)
module.exports = APIs
