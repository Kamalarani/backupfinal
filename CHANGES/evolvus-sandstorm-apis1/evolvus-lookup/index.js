const debug = require("debug")("evolvus-lookup:index");
const model = require("./model/lookupSchema");
const db = require("./db/lookupSchema");
const collection = require("./db/lookup");
const validate = require("jsonschema")
  .validate;
const _ = require("lodash");
const docketClient = require("@evolvus/evolvus-docket-client");

var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortAttributes;

var docketObject = {
  // required fields
  application: "PLATFORM",
  source: "application",
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
  db,
  model,
  filterAttributes,
  sortAttributes
};

module.exports.validate = (tenantId, lookupObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof lookupObject === "undefined") {
        throw new Error("IllegalArgumentException:lookupObject is undefined");
      }
      let result = _.merge(lookupObject, {
        "tenantId": tenantId
      });
      var res = validate(result, schema);
      debug("validation status: ", JSON.stringify(res));
      if (res.valid) {
        resolve(res.valid);
      } else {
        reject(res.errors);
      }
    } catch (err) {
      reject(err);
    }
  });
};


// tenantId cannot be null or undefined, InvalidArgumentError
// check if tenantId is valid from tenant table (todo)
//
// createdBy can be "System" - it cannot be validated against users
// ipAddress is needed for docket, must be passed
//
// object has all the attributes except tenantId, who columns
module.exports.save = (tenantId, createdBy, ipAddress, lookupObject) => {
  return new Promise((resolve, reject) => {
    try {
      const response = {
        "status": "200",
        "description": "",
        "data": {}
      };
      if (typeof lookupObject === 'undefined' || lookupObject == null) {
        throw new Error("IllegalArgumentException: lookupObject is null or undefined");
      }
      collection.find(tenantId, {
        "lookupCode": lookupObject.lookupCode
      }, {}, 0, 1).then((result) => {
        if (!_.isEmpty(result)) {
          throw new Error(` ${lookupObject.lookupCode} already exist`);
        }
        var res = validate(tenantId, lookupObject, schema);
        debug("validation status: ", JSON.stringify(res));
        if (!res.valid) {
          if (res.errors[0].name == "required") {
            reject(`${res.errors[0].argument} is required`);
          } else {
            reject(res.errors[0].schema.message);
          }
        } else {
          // if the object is valid, save the object to the database
          docketObject.name = "lookup_save";
          docketObject.keyDataAsJSON = JSON.stringify(lookupObject);
          docketObject.details = `lookup creation initiated`;
          docketClient.postToDocket(docketObject);
          collection.save(tenantId, lookupObject).then((result) => {
            debug(`saved successfully ${result}`);
            resolve(result);
          }).catch((e) => {
            if (_.isEmpty(result[0])) {
              throw new Error(`lookup ${body.lookupCode},  already exists `);
            }
            bug(`failed to save with an error: ${e}`);
            reject(e);
          });
        }
      }).catch((e) => {
        reject(e);
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
module.exports.find = (tenantId, createdBy, ipAddress, filter, orderby, skipCount, limit) => {
  var invalidFilters = _.difference(_.keys(filter), filterAttributes);
  return collection.find(tenantId, filter, orderby, skipCount, limit);
};