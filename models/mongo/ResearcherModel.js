/**
 * Created by Sanchit on 13/06/19.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Researcher = new Schema({
  first_name: { type: String, trim: true, required: true },
  last_name: { type: String, trim: true, required: true },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accessToken: { type: String, index: true, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('researcher', Researcher)
