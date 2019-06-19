const debug = require("debug")("app:genricDBService");
const MONGO_MODELS = require("./models/mongo");

module.exports = class MongoDBGenericService {
  constructor(name) {
    if (!this.isValidModelName(name))
      throw "Invalid model name '" + name + "'. Terminating app...";

    this.name = name;
    this.dbObjects = [];
  }

  isValidModelName(name) {
    return !(!name || 0 === name.length || !MONGO_MODELS.hasOwnProperty(name));
  }

  // Update a record in DB
  updateRecord(criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    dataToSet.updatedAt = new Date().toISOString();
    MONGO_MODELS[this.name].findOneAndUpdate(
      criteria,
      dataToSet,
      options,
      callback
    );
  }
  //Update all the records
  updateAllRecords(criteria, dataToSet, options, callback) {
    options.new = true;
    options.multi = true;
    dataToSet.updatedAt = new Date().toISOString();
    MONGO_MODELS[this.name].update(criteria, dataToSet, options, callback);
  }

  rawUpdateRecord(criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    dataToSet.updatedAt = new Date().toISOString();
    MONGO_MODELS[this.name].updateOne(criteria, dataToSet, options, callback);
  }

  // Insert a record in DB
  createRecord(objToSave, callback) {
    new MONGO_MODELS[this.name](objToSave).save(callback);
  }

  insertManyAsync(objects, callback) {
    if (objects.length === 0) {
      callback(null, this.dbObjects);
      return (this.dbObjects = []);
    }

    new MONGO_MODELS[this.name](objects[0]).save((err, data) => {
      if (err) debug(err);

      this.dbObjects.push(data);
      objects.splice(0, 1);
      this.insertManyAsync(objects, callback);
    });
  }

  // Delete a record in DB
  deleteRecord(criteria, callback) {
    MONGO_MODELS[this.name].findOneAndRemove(criteria, callback);
  }

  // Get multiple records from DB
  getRecord(criteria, projection, options, callback) {
    options.lean = true;
    MONGO_MODELS[this.name].find(criteria, projection, options, callback);
  }

  // Get multiple records from DB
  getRecordPromise(criteria, projection, options) {
    options.lean = true;
    return new Promise((resolve, reject) => {
      MONGO_MODELS[this.name].find(criteria, projection, options, function (err, data) {
        if (err) reject(err)
        else resolve(data)
      });
    });
  }
};
