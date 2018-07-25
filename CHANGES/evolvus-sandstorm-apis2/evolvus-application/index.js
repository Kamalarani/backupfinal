const debug = require("debug")("evolvus-application:index");
const model = require("./model/applicationSchema");
const dbSchema = require("./db/applicationSchema");
const _ = require('lodash');

const validate = require("jsonschema")
  .validate;
const docketClient = require("@evolvus/evolvus-docket-client");
var shortid = require('shortid');

const Dao = require("@evolvus/evolvus-mongo-dao").Dao;
const collection = new Dao("application", dbSchema);

var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortableAttributes;
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
  model,
  dbSchema,
  filterAttributes,
  sortAttributes
};

module.exports.validate = (applicationObject) => {
  debug(`index validate method.applicationObject :${JSON.stringify(applicationObject)} is a parameter`);
  return new Promise((resolve, reject) => {
    try {
      if (typeof applicationObject === "undefined") {
        throw new Error("IllegalArgumentException:applicationObject is undefined");
      }
      var res = validate(applicationObject, schema);
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

module.exports.save = (tenantId, ipAddress, createdBy, applicationObject) => {
  debug(`index save method,tenantId :${tenantId}, ipAddress :${ipAddress}, createdBy :${createdBy}, applicationObject :${JSON.stringify(applicationObject)} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      if (tenantId == null || applicationObject == null) {
        throw new Error("IllegalArgumentException: tenantId/applicationObject is null or undefined");
      }
      docketObject.name = "application_save";
      docketObject.ipAddress = ipAddress;
      docketObject.createdBy = createdBy;
      docketObject.keyDataAsJSON = JSON.stringify(applicationObject);
      docketObject.details = `application creation initiated`;
      docketClient.postToDocket(docketObject);
      let object = _.merge(applicationObject, {
        "tenantId": tenantId
      });
      var res = validate(object, schema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        if (res.errors[0].name == "required") {
          reject(`${res.errors[0].argument} is required`);
        } else {
          reject(res.errors[0].schema.message);
        }
      } else {

        collection.save(object).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          var reference = shortid.generate();
          debug(`failed to save promise due to : ${e},and reference: ${reference}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      var reference = shortid.generate();
      debug(`index save method, try_catch failure due to :${e} and referenceId :${reference}`);
      docketObject.name = "application_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(applicationObject);
      docketObject.details = `caught Exception on application_save ${e.message}`;
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
module.exports.find = (tenantId, createdBy, ipAddress, filter, orderby, skipCount, limit) => {
  debug(`index find method,tenantId :${tenantId}, filter :${JSON.stringify(filter)}, orderby :${JSON.stringify(orderby)}, skipCount :${skipCount}, limit :${limit} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      if (tenantId == null) {
        throw new Error("IllegalArgumentException: tenantId is null or undefined");
      }
      docketObject.name = "application_getAll";
      docketObject.ipAddress = ipAddress;
      docketObject.createdBy = createdBy;
      docketObject.keyDataAsJSON = `getAll with limit ${limit}`;
      docketObject.details = `application getAll method`;
      docketClient.postToDocket(docketObject);

      collection.find(filter, orderby, skipCount, limit).then((docs) => {
        debug(`application(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        var reference = shortid.generate();
        debug(`find promise failed due to : ${e} and reference id : ${reference}`);
        reject(e);
      });
    } catch (e) {
      var reference = shortid.generate();
      debug(`index find method, try_catch failure due to :${e} and referenceId :${reference}`);
      docketObject.name = "application_ExceptionOngetAll";
      docketObject.ipAddress = ipAddress;
      docketObject.createdBy = createdBy;
      docketObject.keyDataAsJSON = "applicationObject";
      docketObject.details = `caught Exception on application_getAll ${e.message}`;
      docketClient.postToDocket(docketObject);
      reject(e);
    }
  });
};



module.exports.update = (tenantId, code, update, updateapplicationCode) => {
  debug(`index update method,tenantId :${tenantId}, code :${code}, update :${JSON.stringify(update)}, updateapplicationCode :${updateapplicationCode} are parameters`);
  return new Promise((resolve, reject) => {
    console.log("inside promise");
    try {
      if (tenantId == null || code == null || update == null) {
        throw new Error("IllegalArgumentException:tenantId/code/update is null or undefined");
      }
      var filterapplication = {
        "applicationCode": code
      }
      collection.find({
          "applicationCode": update.applicationCode
        }, {}, 0, 1)
        .then((result) => {
          if (_.isEmpty(result[0])) {
            throw new Error(`application ${update.applicationName},  already exists `);
          }
          if ((!_.isEmpty(result[0])) && (result[0].applicationCode != updateapplicationCode)) {
            throw new Error(`application ${update.applicationName} already exists`);
          }
          collection.update(filterapplication, update).then((resp) => {
            debug("updated successfully", resp);
            resolve(resp);
          }).catch((error) => {
            var reference = shortid.generate();
            debug(`update promise failed due to ${error}, and reference Id :${reference}`);
            reject(error);
          });
        }).catch((error) => {
          var reference = shortid.generate();
          debug(`find promise failed due to ${error} and referenceId :${reference}`);
          reject(error);
        });
    } catch (e) {
      var reference = shortid.generate();
      debug(`index Update method, try_catch failure due to :${e} and referenceId :${reference}`);
      reject(e);
    }
  });
};