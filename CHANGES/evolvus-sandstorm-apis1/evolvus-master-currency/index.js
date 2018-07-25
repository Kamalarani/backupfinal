const debug = require("debug")("evolvus-masterCurrency:index");
const model = require("./model/masterCurrencySchema");
const db = require("./db/masterCurrencySchema");
const collection = require("./db/masterCurrency");
const validate = require("jsonschema").validate;
const docketClient = require("@evolvus/evolvus-docket-client");
const _ = require("lodash");

var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortableAttributes;

var auditObject = {
  // required fields
  masterCurrency: "PLATFORM",
  source: "masterCurrency",
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

module.exports.validate = (tenantId, masterCurrencyObject) => {
  return new Promise((resolve, reject) => {
    if (typeof masterCurrencyObject === "undefined") {
      throw new Error("IllegalArgumentException:masterCurrencyObject is undefined");
    }
    var res = validate(masterCurrencyObject, schema);
    debug("validation status: ", JSON.stringify(res));
    if (res.valid) {
      resolve(res.valid);
    } else {
      reject(res.errors);
    }
  });
};

module.exports.save = (tenantId, masterCurrencyObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof masterCurrencyObject === 'undefined' || masterCurrencyObject == null) {
        throw new Error("IllegalArgumentException: masterCurrencyObject is null or undefined");
      }
      var res = validate(masterCurrencyObject, schema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      } else {
        // if the object is valid, save the object to the database

        docketObject.name = "masterCurrency_save";
        docketObject.keyDataAsJSON = JSON.stringify(masterCurrencyObject);
        docketObject.details = `masterCurrency creation initiated`;
        docketClient.postToDocket(docketObject);
        collection.save(tenantId, masterCurrencyObject).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          debug(`failed to save with an error: ${e}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      docketObject.name = "masterCurrency_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(masterCurrencyObject);
      docketObject.details = `caught Exception on masterCurrency_save ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.counts = (tenantId, countQuery) => {
  return new Promise((resolve, reject) => {
    try {
      collection.counts(tenantId, countQuery).then((masterCurrencyCount) => {
        if (masterCurrencyCount > 0) {
          debug(`masterCurrencyCount Data is ${masterCurrencyCount}`);
          resolve(masterCurrencyCount);
        } else {
          debug(`No masterCurrency count data available for filter query ${masterCurrencyCount}`);
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
        debug(`masterCurrency(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        debug(`failed to find all the masterCurrency(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
  });
};