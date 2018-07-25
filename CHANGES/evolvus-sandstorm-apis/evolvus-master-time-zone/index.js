const debug = require("debug")("evolvus-master-time-zone:index");
const model = require("./model/masterTimeZoneSchema");
const dbSchema = require("./db/masterTimeZoneSchema");
const _ = require('lodash');
const validate = require("jsonschema").validate;
const docketClient = require("@evolvus/evolvus-docket-client");
const shortid = require('shortid');
const Dao = require("@evolvus/evolvus-mongo-dao").Dao;
const collection = new Dao("masterTimeZone", dbSchema);


var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortableAttributes;

var docketObject = {
  // required fields
  masterTimeZone: "PLATFORM",
  source: "masterTimeZone",
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


module.exports.validate = (masterTimeZoneObject) => {
  debug(`index validate method.masterTimeZoneObject :${JSON.stringify(masterTimeZoneObject)} is a parameter`);
  return new Promise((resolve, reject) => {
    if (typeof masterTimeZoneObject === "undefined") {
      throw new Error("IllegalArgumentException:masterTimeZoneObject is undefined");
    }
    var res = validate(masterTimeZoneObject, schema);
    debug("validation status: ", JSON.stringify(res));
    if (res.valid) {
      resolve(res.valid);
    } else {
      reject(res.errors);
    }
  });
};

module.exports.save = (tenantId, masterTimeZoneObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof masterTimeZoneObject === 'undefined' || masterTimeZoneObject == null) {
        throw new Error("IllegalArgumentException: masterTimeZoneObject is null or undefined");
      }
      let object = _.merge(masterTimeZoneObject, {
        "tenantId": tenantId
      });
      var res = validate(object, schema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      } else {
        // if the object is valid, save the object to the database

        docketObject.name = "masterTimeZone_save";
        docketObject.keyDataAsJSON = JSON.stringify(masterTimeZoneObject);
        docketObject.details = `masterTimeZone creation initiated`;
        docketClient.postToDocket(docketObject);
        collection.save(object).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          var reference = shortid.generate();
          debug(`save promise failed due to :${e} and referenceId is : ${reference}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      var reference = shortid.generate();
      debug(`try catch failed due to :${e} and referenceId is : ${reference}`);
      docketObject.name = "masterTimeZone_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(masterTimeZoneObject);
      docketObject.details = `caught Exception on masterTimeZone_save ${e.message}`;
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
  debug(`index find method.tenantId :${tenantId}, filter :${JSON.stringify(filter)}, orderby :${JSON.stringify(orderby)}, skipCount :${skipCount}, limit :${limit} are parameters `);
  return new Promise((resolve, reject) => {
    try {
      var invalidFilters = _.difference(_.keys(filter), filterAttributes);
      collection.find(filter, orderby, skipCount, limit).then((docs) => {
        debug(`masterTimeZone(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        var reference = shortid.generate();
        debug(`find promise failed due to :${e} and referenceId is : ${reference}`);
        reject(e);
      });
    } catch (e) {
      var reference = shortid.generate();
      debug(`try catch failed due to :${e} and referenceId is : ${reference}`);
      reject(e);
    }
  });
};