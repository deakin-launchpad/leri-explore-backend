/**
 * Created by Sanchit on 13/06/19.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResearcherDetail = new Schema({
  first_name: { type: String, trim: true, required: true },
  last_name: { type: String, trim: true, required: true },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accessToken: { type: String, index: true, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('researcherDetail', ResearcherDetail)
