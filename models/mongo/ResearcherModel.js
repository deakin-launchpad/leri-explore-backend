/**
 * Created by Sanchit on 13/06/19.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const researcherJSON = {
  first_name: { type: String, trim: true, required: true },
  last_name: { type: String, trim: true, required: true },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accessToken: { type: String, index: true, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}

/** 
 * Appends the user schema JSON with the _id field for test environment.
 * Helpful since accessToken can be a predefined constant while testing.
 * */
if ("test" === process.env.NODE_ENV) researcherJSON._id = { type: Schema.ObjectId, default: function () { return new mongoose.mongo.ObjectId() } }

const Researcher = new Schema(researcherJSON)

module.exports = mongoose.model('researcher', Researcher)
