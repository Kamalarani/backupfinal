const debug = require("debug")("evolvus-role:index");
const model = require("./model/roleSchema");
const _ = require('lodash');
const db = require("./db/roleSchema");
const collection = require("./db/role");
const validate = require("jsonschema").validate;
const docketClient = require("@evolvus/evolvus-docket-client");
const application = require("@evolvus/evolvus-application");

var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortableAttributes;

var docketObject = {
  // required fields
  role: "PLATFORM",
  source: "role",
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
module.exports.validate = (tenantId, roleObject) => {
  return new Promise((resolve, reject) => {
    if (typeof roleObject === "undefined") {
      throw new Error("IllegalArgumentException:roleObject is undefined");
    }
    var res = validate(roleObject, schema);
    debug("validation status: ", JSON.stringify(res));
    if (res.valid) {
      resolve(res.valid);
    } else {
      reject(res.errors);
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
module.exports.save = (tenantId, createdBy, accessLevel, entityId, roleObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof roleObject === 'undefined' || roleObject == null) {
        throw new Error("IllegalArgumentException: roleObject is null or undefined");
      }
      Promise.all([application.find(tenantId, {
        "applicationCode": roleObject.applicationCode
      }, {}, 0, 1), collection.find(tenantId, {
        "roleName": roleObject.roleName
      }, {}, 0, 1)]).then((result) => {
        if (_.isEmpty(result[0])) {
          throw new Error(`No Application with ${roleObject.applicationCode} found`);
        }
        if (!_.isEmpty(result[1])) {
          throw new Error(`RoleName ${roleObject.roleName} already exists`);
        }
        var res = validate(roleObject, schema);
        debug("validation status: ", JSON.stringify(res));
        if (!res.valid) {
          if (res.errors[0].name == "required") {
            reject(`${res.errors[0].argument} is required`);
          }
          reject(res.errors[0].schema.message);
        } else {
          // if the object is valid, save the object to the database
          docketObject.name = "role_save";
          docketObject.keyDataAsJSON = JSON.stringify(roleObject);
          docketObject.details = `entity creation initiated`;
          docketClient.postToDocket(docketObject);
          collection.save(tenantId, createdBy, accessLevel, entityId, roleObject).then((result) => {
            debug(`saved successfully ${result}`);
            resolve(result);
          }).catch((e) => {
            debug(`failed to save with an error: ${e}`);
            reject(e);
          });
        }
      }).catch((e) => {
        reject(e);
      });
      // Other validations here
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
        debug(`role(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        debug(`failed to find all the role(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.update = (tenantId, code, updateRoleName, update) => {
  return new Promise((resolve, reject) => {
    try {
      if (tenantId == null || code == null || update == null) {
        throw new Error("IllegalArgumentException:tenantId/code/update is null or undefined");
      }
      collection.find(tenantId, {
          "roleName": update.roleName
        }, {}, 0, 1)
        .then((result) => {
          if (_.isEmpty(result[0])) {
            throw new Error(`Role ${update.roleName},  already exists `);
          }
          if ((!_.isEmpty(result[0])) && (result[0].roleName != updateRoleName)) {
            throw new Error(`Role ${update.roleName} already exists`);
          }
          collection.update(tenantId, code, update).then((resp) => {
            debug("updated successfully", resp);
            resolve(resp);
          }).catch((error) => {
            debug(`failed to update ${error}`);
            reject(error);
          });
        }).catch((e) => {
          reject(e);
        });
    } catch (e) {
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};