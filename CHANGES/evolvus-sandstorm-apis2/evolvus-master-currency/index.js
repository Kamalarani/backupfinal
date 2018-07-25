const debug = require("debug")("evolvus-masterCurrency:index");
const model = require("./model/masterCurrencySchema");
const dbSchema = require("./db/masterCurrencySchema");
const _ = require('lodash');
const validate = require("jsonschema").validate;
const docketClient = require("@evolvus/evolvus-docket-client");
const shortid = require('shortid');
const Dao = require("@evolvus/evolvus-mongo-dao").Dao;
const collection = new Dao("masterCurrency", dbSchema);

var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortableAttributes;

var docketObject = {
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
  dbSchema,
  filterAttributes,
  sortAttributes
};

module.exports.validate = (masterCurrencyObject) => {
  debug(`index validate method,masterCurrencyObject :${JSON.stringify(masterCurrencyObject)} is a parameter `);
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
  debug(`index save method,tenantId :${tenantId}, masterCurrencyObject :${JSON.stringify(masterCurrencyObject)} are parameters `);
  return new Promise((resolve, reject) => {
    try {
      if (typeof masterCurrencyObject === 'undefined' || masterCurrencyObject == null) {
        throw new Error("IllegalArgumentException: masterCurrencyObject is null or undefined");
      }
      let object = _.merge(masterCurrencyObject, {
        "tenantId": tenantId
      });
      var res = validate(object, schema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      } else {
        // if the object is valid, save the object to the database

        docketObject.name = "masterCurrency_save";
        docketObject.keyDataAsJSON = JSON.stringify(masterCurrencyObject);
        docketObject.details = `masterCurrency creation initiated`;
        docketClient.postToDocket(docketObject);
        debug(`calling db save method and  object :${JSON.stringify(object)} is a parameter `);
        collection.save(object).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          var reference = shortid.generate();
          debug(`save promise failed due to :${e} and referenceId is ${reference}`);
          debug(`failed to save with an error: ${e}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      var reference = shortid.generate();
      debug(`try catch failed due to :${e} and referenceId is ${reference}`);
      docketObject.name = "masterCurrency_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(masterCurrencyObject);
      docketObject.details = `caught Exception on masterCurrency_save ${e.message}`;
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
  debug(`index find method.tenantId :${tenantId}, filter :${JSON.stringify(filter)}, orderby :${JSON.stringify(orderby)}, skipCount :${skipCount}, limit :${limit} , are parameters`);
  return new Promise((resolve, reject) => {
    try {
      var invalidFilters = _.difference(_.keys(filter), filterAttributes);
      debug(`calling db find method filter :${JSON.stringify(filter)},orderby :${JSON.stringify(orderby)}, skipCount :${skipCount}, limit :${limit} ,are parameters`)
      collection.find(filter, orderby, skipCount, limit).then((docs) => {
        debug(`masterCurrency(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        var reference = shortid.generate();
        debug(`find promise failed due to  ${e} and referenceId is ${reference}`);
        reject(e);
      });
    } catch (e) {
      var reference = shortid.generate();
      debug(`try catch failed due to  ${e} and referenceId is ${reference}`);
      reject(e);
    }
  });
};