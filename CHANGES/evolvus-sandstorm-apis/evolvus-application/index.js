const debug = require("debug")("evolvus-application:index");
const model = require("./model/applicationSchema");
const dbSchema = require("./db/applicationSchema");
const _ = require('lodash');

const validate = require("jsonschema")
  .validate;
const docketClient = require("@evolvus/evolvus-docket-client");
const shortid = require('shortid');

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
  debug(`index validate method.applicationObject :${JSON.stringify(applicationObject)} is aparameter`);
  return new Promise((resolve, reject) => {
    try {
      if (typeof applicationObject === "undefined") {
        throw new Error("IllegalArgumentException:menuObject is undefined");
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
      debug("index validate method.exception in try .. catch,reference", reference, err);
      reject(err);
    }
  });
};

module.exports.save = (tenantId, ipAddress, createdBy, applicationObject) => {
  debug(`index save method,tenantId :${tenantId}, ipAddress :${ipAddress }, createdBy :${createdBy}, applicationObject :${JSON.stringify(applicationObject)} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      if (typeof applicationObject === 'undefined' || applicationObject == null) {
        throw new Error("IllegalArgumentException: applicationObject is null or undefined");
      }
      debug(`calling DB find method, filter :${applicationObject.applicationCode},orderby :${JSON.stringify({})} ,skipCount :${0} ,limit :${1} are parameters`);
      collection.find({
          "applicationCode": applicationObject.applicationCode
        }, {}, 0, 1)
        .then((result) => {
          if (!_.isEmpty(result[0])) {
            throw new Error(`application ${applicationObject.applicationCode}, already exists `);
          }

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
            // if the object is valid, save the object to the database

            docketObject.name = "application_save";
            docketObject.keyDataAsJSON = JSON.stringify(applicationObject);
            docketObject.details = `application creation initiated`;
            docketClient.postToDocket(docketObject);
            debug(`calling db save method object :${JSON.stringify(object)} is a parameter`);
            collection.save(object).then((result) => {
              debug(`saved successfully ${result}`);
              resolve(result);
            }).catch((e) => {
              var reference = shortid.generate();
              debug(`failed to save with an error: ${e},and reference: ${reference}`);
              reject(e);
            });
          }
        }).catch((error) => {
          var reference = shortid.generate();
          debug(`find promise failed due to ${error} and referenceId :${reference}`);
          reject(error);
        });
      // Other validations here
    } catch (e) {
      var reference = shortid.generate();
      debug(`index save method, try_catch failure due to :${e} ,and referenceId :${reference}`);
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
module.exports.find = (tenantId, filter, orderby, skipCount, limit) => {
  debug(`index find method,tenantId :${tenantId}, filter :${JSON.stringify(filter)}, orderby :${JSON.stringify(orderby)}, skipCount :${skipCount}, limit :${limit} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      var invalidFilters = _.difference(_.keys(filter), filterAttributes);
      collection.find(filter, orderby, skipCount, limit).then((docs) => {
        debug(`application(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        var reference = shortid.generate();
        debug(`failed to find all the application(s) ${e} and reference id : ${reference}`);
        reject(e);
      });
    } catch (e) {
      var reference = shortid.generate();
      debug(`index find method, try_catch failure due to :${e} ,and referenceId :${reference}`);
      reject(e);
    }
  });
};



module.exports.update = (tenantId, code, update, updateapplicationCode) => {
  debug(`index update method,tenantId :${tenantId}, code :${code}, update :${JSON.stringify(update)}, updateapplicationCode :${updateapplicationCode} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      if (tenantId == null || code == null || update == null) {
        throw new Error("IllegalArgumentException:tenantId/code/update is null or undefined");
      }
      debug(`calling DB find method, filter :${update.applicationCode},orderby :${{}} ,skipCount :${0} ,limit :${1} are parameters`);
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
          debug(`calling DB update method, filter :${code},update :${JSON.stringify(update)} are parameters`);
          collection.update({
            applicationCode: code
          }, update).then((resp) => {
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
      debug(`index Update method, try_catch failure due to :${e} ,and referenceId :${reference}`);
      reject(e);
    }
  });
};