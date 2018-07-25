const debug = require("debug")("evolvus-supported-date-formats:index");
const model = require("./model/supportedDateFormatsSchema");
const dbSchema = require("./db/supportedDateFormatsSchema");
const _ = require('lodash');
const validate = require("jsonschema").validate;
const docketClient = require("@evolvus/evolvus-docket-client");
const shortid = require('shortid');
const Dao = require("@evolvus/evolvus-mongo-dao").Dao;
const collection = new Dao("supportedDateFormats", dbSchema);

var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortableAttributes;

var docketObject = {
  // required fields
  supportedDateFormats: "PLATFORM",
  "wfInstanceStatus": "wfStatus",
  "wfInstanceId": "wfID",
  source: "supportedDateFormats",
  name: "",
  createdBy: "",
  ipAddress: "",
  status: "SUCCESS", //by default
  eventDateTime: Date.now(),
  keyDataAsJSON: "",
  details: "",
  //non required fields
  level: ""
};

module.exports = {
  model,
  dbSchema,
  filterAttributes,
  sortAttributes
};

module.exports.validate = (supportedDateFormatsObject) => {
  debug(`index validate method.supportedDateFormatsObject :${JSON.stringify(supportedDateFormatsObject)} is a parameter`);
  return new Promise((resolve, reject) => {
    if (typeof supportedDateFormatsObject === "undefined") {
      throw new Error("IllegalArgumentException:supportedDateFormatsObject is undefined");
    }
    var res = validate(supportedDateFormatsObject, schema);
    debug("validation status: ", JSON.stringify(res));
    if (res.valid) {
      resolve(res.valid);
    } else {
      reject(res.errors);
    }
  });
};

module.exports.save = (tenantId, supportedDateFormatsObject) => {
  debug(`index save method.tenantId :${tenantId}, supportedDateFormatsObject :${JSON.stringify(supportedDateFormatsObject)} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      if (typeof supportedDateFormatsObject === 'undefined' || supportedDateFormatsObject == null) {
        throw new Error("IllegalArgumentException: supportedDateFormatsObject is null or undefined");
      }
      let object = _.merge(supportedDateFormatsObject, {
        "tenantId": tenantId
      });
      var res = validate(object, schema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      } else {
        // if the object is valid, save the object to the database

        docketObject.name = "supportedDateFormats_save";
        docketObject.keyDataAsJSON = JSON.stringify(supportedDateFormatsObject);
        docketObject.details = `supportedDateFormats creation initiated`;
        docketClient.postToDocket(docketObject);
        debug(`calling db save method .object :${JSON.stringify(object)} is a parameter`);
        collection.save(object).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          var reference = shortid.generate();
          debug(`save promise failed due to :${e} and referenceId is :${reference}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      var reference = shortid.generate();
      debug(`try catch failed due to :${e} and referenceId is :${reference}`);
      docketObject.name = "supportedDateFormats_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(supportedDateFormatsObject);
      docketObject.details = `caught Exception on supportedDateFormats_save ${e.message}`;
      docketClient.postToDocket(docketObject);
      reject(e);
    }
  });
};


// tenantId should be valid
// createdBy should be requested user, not database object user, used for auditObject
// ipAddress should ipAddress
// filter should only have fields which are marked as filterable in the model Schema
// orderby should only have fields which are marked as sortable in the model Schema
module.exports.find = (tenantId, filter, orderby, skipCount, limit) => {
  debug(`index find method. tenantId :${tenantId}, filter :${JSON.stringify(filter)}, orderby :${JSON.stringify(orderby)}, skipCount :${skipCount},  limit :${limit} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      var invalidFilters = _.difference(_.keys(filter), filterAttributes);
      collection.find(filter, orderby, skipCount, limit).then((docs) => {
        debug(`supportedDateFormats(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        var reference = shortid.generate();
        debug(`find promise failed due to :${e} and referenceId is :${reference}`);
        reject(e);
      });
    } catch (e) {
      var reference = shortid.generate();
      debug(`try catch failed due to :${e} and referenceId is :${reference}`);
      reject(e);
    }
  });
};