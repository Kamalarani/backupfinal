const debug = require("debug")("evolvus-contact:index");
const model = require("./model/contactSchema");
const dbSchema = require("./db/contactSchema");
const _ = require('lodash');
const validate = require("jsonschema").validate;
const docketClient = require("@evolvus/evolvus-docket-client");
const shortid = require('shortid');

const Dao = require("@evolvus/evolvus-mongo-dao").Dao;
const collection = new Dao("contact", dbSchema);

var schema = model.schema;
var filterAttributes = model.filterAttributes;
var sortAttributes = model.sortableAttributes;

var docketObject = {
  // required fields
  contact: "PLATFORM",
  source: "contact",
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


module.exports.validate = (contactObject) => {
  debug(`index validate method.contactObject :${JSON.stringify(contactObject)} is a parameter`);
  return new Promise((resolve, reject) => {
    if (typeof contactObject === "undefined") {
      throw new Error("IllegalArgumentException:contactObject is undefined");
    }
    var res = validate(contactObject, schema);
    debug("validation status: ", JSON.stringify(res));
    if (res.valid) {
      resolve(res.valid);
    } else {
      reject(res.errors);
    }
  });
};

module.exports.save = (tenantId, contactObject) => {
  debug(`index save method,tenantId :${tenantId}, contactObject :${JSON.stringify(contactObject)} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      if (typeof contactObject === 'undefined' || contactObject == null) {
        throw new Error("IllegalArgumentException: contactObject is null or undefined");
      }
      let object = _.merge(contactObject, {
        "tenantId": tenantId
      });
      var res = validate(object, schema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      } else {
        // if the object is valid, save the object to the database

        docketObject.name = "contact_save";
        docketObject.keyDataAsJSON = JSON.stringify(contactObject);
        docketObject.details = `contact creation initiated`;
        docketClient.postToDocket(docketObject);
        debug(`calling db save method , object :${JSON.stringify(object)} is a parameter`);
        collection.save(object).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          var reference = shortid.generate();
          debug(`save promise failed due to : ${e} and referenceid is ${reference}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      var reference = shortid.generate();
      debug(`try catch failed due to : ${e} and referenceid is ${reference}`);
      docketObject.name = "contact_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(contactObject);
      docketObject.details = `caught Exception on contact_save ${e.message}`;
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
  debug(`index find method,tenantId :${tenantId}, filter :${JSON.stringify(filter)}, orderby :${JSON.stringify(orderby)} , skipCount :${skipCount}, limit :${limit} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      var invalidFilters = _.difference(_.keys(filter), filterAttributes);
      collection.find(filter, orderby, skipCount, limit).then((docs) => {
        debug(`contact(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        var reference = shortid.generate();
        debug(`findAll promise failed due to : ${e}, and referenceid is ${reference}`);
        reject(e);
      });
    } catch (e) {
      var reference = shortid.generate();
      debug(`try catch failed due to : ${e}, and referenceid is ${reference}`);
      reject(e);
    }
  });
};


module.exports.update = (tenantId, code, update) => {
  debug(`index update method,tenantId :${tenantId}, code :${code}, update :${JSON.stringify(update)} are parameters`);
  return new Promise((resolve, reject) => {
    try {
      if (tenantId == null || code == null || update == null) {
        throw new Error("IllegalArgumentException:tenantId/code/update is null or undefined");
      }
      debug(`calling db update method,code :${code},update :${update} parameter`);
      collection.update(code, update).then((resp) => {
        debug("updated successfully", resp);
        resolve(resp);
      }).catch((error) => {
        var reference = shortid.generate();
        debug(`update promise failed due to :${error},and reference id ${reference}`);
        reject(error);
      });
    } catch (e) {
      var reference = shortid.generate();
      debug(`try catch failed due to :${error},and reference id ${reference}`);
      reject(e);
    }
  });
};