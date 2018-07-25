const debug = require("debug")("evolvus-role:index");
const model = require("./model/roleSchema");
const _ = require('lodash');
const dbSchema = require("./db/roleSchema");
const shortid = require("shortid");
const validate = require("jsonschema").validate;
const docketClient = require("@evolvus/evolvus-docket-client");
const application = require("@evolvus/evolvus-application");
const sweClient = require("@evolvus/evolvus-swe-client");
const Dao = require("@evolvus/evolvus-mongo-dao").Dao;
const collection = new Dao("role", dbSchema);

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
  dbSchema,
  filterAttributes,
  sortAttributes
};
module.exports.validate = (roleObject) => {
  debug(`index validate method.roleObject :${JSON.stringify(roleObject)} is a parameter`);
  return new Promise((resolve, reject) => {
    try {
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
    } catch (err) {
      var reference = shortid.generate();
      debug(`try catch failed due to :${e} and referenceId :${reference}`);
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
module.exports.save = (tenantId, createdBy, ipAddress, accessLevel, entityId, roleObject) => {
  debug(`index save method,tenantId :${tenantId}, createdBy :${createdBy}, ipAddress :${ipAddress},accessLevel: ${accessLevel},entityId: ${entityId}, roleObject :${JSON.stringify(roleObject)} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      if (tenantId == null || roleObject == null) {
        throw new Error("IllegalArgumentException: tenantId/roleObject is null or undefined");
      }
      Promise.all([application.find(tenantId, createdBy, ipAddress, {
        "applicationCode": roleObject.applicationCode
      }, {}, 0, 1), collection.find({
        "roleName": roleObject.roleName
      }, {}, 0, 1)]).then((result) => {
        if (_.isEmpty(result[0])) {
          throw new Error(`No Application with ${roleObject.applicationCode} found`);
        }
        if (!_.isEmpty(result[1])) {
          throw new Error(`RoleName ${roleObject.roleName} already exists`);
        }
        docketObject.name = "role_save";
        docketObject.ipAddress = ipAddress;
        docketObject.createdBy = createdBy;
        docketObject.keyDataAsJSON = JSON.stringify(roleObject);
        docketObject.details = `role creation initiated`;
        docketClient.postToDocket(docketObject);
        let object = _.merge(roleObject, {
          "tenantId": tenantId
        });
        var res = validate(object, schema);
        debug("validation status: ", JSON.stringify(res));
        if (!res.valid) {
          if (res.errors[0].name == "required") {
            reject(`${res.errors[0].argument} is required`);
          } else {
            reject(res.errors);
          }
        } else {
          // if the object is valid, save the object to the database
          debug(`calling db save method, roleObject: ${JSON.stringify(roleObject)}`);
          collection.save(roleObject).then((result) => {
            debug(`saved successfully ${result}`);
            var sweEventObject = {
              "tenantId": tenantId,
              "wfEntity": "ROLE",
              "wfEntityAction": "CREATE",
              "createdBy": createdBy,
              "query": result._id
            };
            sweClient.initialize(sweEventObject).then((result) => {
              var filterRole = {
                "roleName": roleObject.roleName
              };
              collection.update(filterRole, {
                "wfInstanceStatus": result.data.wfInstanceStatus,
                "wfInstanceId": result.data.wfInstanceId
              }).then((result) => {
                resolve(result);
              }).catch((e) => {
                var reference = shortid.generate();
                debug(`initialize update promise failed due to :${e} and referenceId :${reference}`);
                reject(e);
              });
            }).catch((e) => {
              var reference = shortid.generate();
              debug(`initialize promise failed due to :${e} and referenceId :${reference}`);
              reject(e);
            });
          }).catch((e) => {
            var reference = shortid.generate();
            debug(`failed to save promise due to : ${e},and reference: ${reference}`);
            reject(e);
          });
        }
      }).catch((e) => {
        var reference = shortid.generate();
        debug(`promiseAll failed due to : ${e},and reference: ${reference}`);
        reject(e);
      });
      // Other validations here
    } catch (e) {
      var reference = shortid.generate();
      debug(`index save method, try_catch failure due to :${e} and referenceId :${reference}`);
      docketObject.name = "role_ExceptionOnSave";
      docketObject.ipAddress = ipAddress;
      docketObject.createdBy = createdBy;
      docketObject.keyDataAsJSON = JSON.stringify(roleObject);
      docketObject.details = `caught Exception on role_save ${e.message}`;
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
  debug(`index find method,tenantId :${tenantId}, filter :${JSON.stringify(filter)}, orderby :${JSON.stringify(orderby)}, skipCount :${skipCount}, limit :${limit} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      if (tenantId == null) {
        throw new Error("IllegalArgumentException: tenantId is null or undefined");
      }
      docketObject.name = "role_getAll";
      docketObject.ipAddress = ipAddress;
      docketObject.createdBy = createdBy;
      docketObject.keyDataAsJSON = `getAll with limit ${limit}`;
      docketObject.details = `role getAll method`;
      docketClient.postToDocket(docketObject);
      debug(`calling db find method, filter: ${JSON.stringify(filter)},orderby: ${orderby}, skipCount: ${skipCount},limit: ${limit}`);
      collection.find(filter, orderby, skipCount, limit).then((docs) => {
        debug(`role(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        var reference = shortid.generate();
        debug(`find promise failed due to : ${e} and reference id : ${reference}`);
        reject(e);
      });
    } catch (e) {
      var reference = shortid.generate();
      debug(`index find method, try_catch failure due to :${e} and referenceId :${reference}`);
      docketObject.name = "role_ExceptionOngetAll";
      docketObject.ipAddress = ipAddress;
      docketObject.createdBy = createdBy;
      docketObject.keyDataAsJSON = "roleObject";
      docketObject.details = `caught Exception on role_getAll ${e.message}`;
      docketClient.postToDocket(docketObject);
      reject(e);
    }
  });
};

module.exports.update = (tenantId, code, updateRoleName, update) => {
  debug(`index update method,tenantId :${tenantId}, code :${code},updateRoleName: ${updateRoleName}, update :${JSON.stringify(update)} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      if (tenantId == null || code == null || update == null) {
        throw new Error("IllegalArgumentException:tenantId/code/update is null or undefined");
      }
      var filterRole = {
        roleName: roleName
      };
      collection.find({
          "roleName": update.roleName
        }, {}, 0, 1)
        .then((result) => {
          if (_.isEmpty(result[0])) {
            throw new Error(`Role ${update.roleName},  already exists `);
          }
          if ((!_.isEmpty(result[0])) && (result[0].roleName != updateRoleName)) {
            throw new Error(`Role ${update.roleName} already exists`);
          }
          debug(`calling db update method, filterRole: ${JSON.stringify(filterRole)},update: ${JSON.stringify(update)}`);
          collection.update(filterRole, update).then((resp) => {
            debug("updated successfully", resp);
            resolve(resp);
          }).catch((error) => {
            var reference = shortid.generate();
            debug(`update promise failed due to ${error}, and reference Id :${reference}`);
            reject(error);
          });
        }).catch((e) => {
          var reference = shortid.generate();
          debug(`find promise failed due to ${error}, and reference Id :${reference}`);
          reject(e);
        });
    } catch (e) {
      var reference = shortid.generate();
      debug(`index Update method, try_catch failure due to :${e} and referenceId :${reference}`);
      reject(e);
    }
  });
};