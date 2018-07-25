const debug = require("debug")("evolvus-supportedDateFormats:index");
const model = require("./model/supportedDateFormatsSchema");
const db = require("./db/supportedDateFormatsSchema");
const collection = require("./db/supportedDateFormats");
const validate = require("jsonschema").validate;
const docketClient = require("@evolvus/evolvus-docket-client");
const _ = require("lodash");
var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortableAttributes;

var auditObject = {
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
  db,
  filterAttributes,
  sortAttributes
};

module.exports.validate = (tenantId, supportedDateFormatsObject) => {
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
  return new Promise((resolve, reject) => {
    try {
      if (typeof supportedDateFormatsObject === 'undefined' || supportedDateFormatsObject == null) {
        throw new Error("IllegalArgumentException: supportedDateFormatsObject is null or undefined");
      }
      var res = validate(supportedDateFormatsObject, schema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      } else {
        // if the object is valid, save the object to the database

        docketObject.name = "supportedDateFormats_save";
        docketObject.keyDataAsJSON = JSON.stringify(supportedDateFormatsObject);
        docketObject.details = `supportedDateFormats creation initiated`;
        docketClient.postToDocket(docketObject);
        collection.save(tenantId, supportedDateFormatsObject).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          debug(`failed to save with an error: ${e}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      docketObject.name = "supportedDateFormats_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(supportedDateFormatsObject);
      docketObject.details = `caught Exception on supportedDateFormats_save ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
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
  return new Promise((resolve, reject) => {
    try {
      var invalidFilters = _.difference(_.keys(filter), filterAttributes);
      collection.find(tenantId, filter, orderby, skipCount, limit).then((docs) => {
        debug(`supportedDateFormats(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        debug(`failed to find all the supportedDateFormats(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.counts = (tenantId, countQuery) => {
  return new Promise((resolve, reject) => {
    try {
      collection.counts(tenantId, countQuery).then((supportedDateFormatsCount) => {
        if (supportedDateFormatsCount > 0) {
          debug(`supportedDateFormatsCountData is ${supportedDateFormatsCount}`);
          resolve(supportedDateFormatsCount);
        } else {
          debug(`No supportedDateFormats Count data available for filter query ${supportedDateFormatsCount}`);
          resolve(0);
        }
      }).catch((e) => {
        debug(`failed to find ${e}`);
      });
    } catch (e) {
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};