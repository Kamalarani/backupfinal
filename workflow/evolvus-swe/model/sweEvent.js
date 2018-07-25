const debug = require("debug")("evolvus-swe:model:sweEvent");
const model = require("./sweEventSchema")
  .schema;
const _ = require("lodash");
const schema = require("../db/sweEventSchema");
const Dao = require("../db/dao");

const collection = new Dao("sweEvent", schema);

const validate = require("jsonschema")
  .validate;

module.exports.save = (tenantId, object) => {
  let result = _.merge(object, {
    "tenantId": tenantId
  });
  return collection.save(result)
};

module.exports.find = (tenantId, filter, orderby, skipCount, limit) => {
  return collection.find(tenantId, filter, orderby, skipCount, limit);
};

module.exports.update = (tenantId, filter, object) => {
  let result = _.merge(filter, {
    "tenantId": tenantId
  });
  return collection.update(result, object)
};
