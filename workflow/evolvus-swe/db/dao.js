const debug = require("debug")("evolvus-swe:db:dao");
const mongoose = require("mongoose");

// Generic Mongo data access class.
// All db related activity abstracted to this class
// Instantiate a model and use the methods on it.
// We can safely add more methods (like aggregate etc)
// without impacting the calling code and making it available
// for all collections
module.exports = function(model, schema) {

  // The schema defined for the model
  this.schema = schema;
  // The name of the colleciton created inside Mongo (without the 's')
  this.collectionName = model;
  // define the mongo collection/model
  this.objectModel = mongoose.model(model, schema);

  // Saves the sweSetup object to the database and returns a Promise
  // The assumption here is that the Object is valid
  // if it fails schema validation it will throw an exception
  this.save = function(result) {
    let object = new this.objectModel(result);
    return object.save();
  };

  // find returns an array object with the results
  // [] (empty array) if the columns mismatch or if there are no records.
  // if the skipCount is negative it will throw and error
  // this usually indicates a logical error in the code
  // limit of 0 means all values, else absolute of limit is used
  // point here is that no error is thrown
  this.find = function(filter, orderby, skipCount, limit) {
    return this.objectModel.find(filter)
      .sort(orderby)
      .skip(skipCount) // skipCount should not be negative
      .limit(limit); // absolute value is used, 0 means all
  };

  // findOne returns an object or null based on the filter condition
  this.findOne = function(filter) {
    return this.objectModel.findOne(filter);
  };

  // update will find the records matched by the filter and update
  // the attributes set in the update object
  this.update = function(filter, update) {
    return this.objectModel.update(filter, update);
  };

  // Deletes all the entries of the collection.
  // To be used by test only
  this.deleteAll = function(filter) {
    return this.objectModel.remove(filter);
  };

};
