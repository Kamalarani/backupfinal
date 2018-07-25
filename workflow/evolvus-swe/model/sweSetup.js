const debug = require("debug")("evolvus-swe:model:sweSetup");
const model = require("./sweEventSchema")
  .schema;

const schema = require("../db/sweSetupSchema");
const Dao = require("../db/dao");
const collection = new Dao("sweSetup", schema);

const _ = require("lodash");

const validate = require("jsonschema")
  .validate;

//validate object before save
module.exports.save = (tenantId, object) => {
  let result = _.merge(object, {
    "tenantId": tenantId
  });

  return collection.save(result)
};

// Ensure skipCount is >= 0
module.exports.find = (tenantId, filter, orderby, skipCount, limit) => {
  let query = _.merge(filter, {
    "tenantId": tenantId
  });
  return collection.find(query, orderby, skipCount, limit);
};


module.exports.findOne = (tenantId, filter) => {
  let query = _.merge(filter, {
    "tenantId": tenantId
  });
  return collection.findOne(query);
};
