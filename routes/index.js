/**
 * Created by Navit
 */
'use strict'

var QueryRoutes = require('./queryRoutes');
var ResearcherRoutes = require('./researcherRoutes');
var APIs = [].concat(QueryRoutes, ResearcherRoutes);
module.exports = APIs;
