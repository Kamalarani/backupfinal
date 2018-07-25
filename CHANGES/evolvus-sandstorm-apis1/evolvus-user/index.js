const debug = require("debug")("evolvus-user:index");
const model = require("./model/userSchema");
const dbSchema = require("./db/userSchema");
const _ = require('lodash');
const validate = require("jsonschema").validate;
const docketClient = require("@evolvus/evolvus-docket-client");
const entity = require("@evolvus/evolvus-entity");
const role = require("@evolvus/evolvus-role");
const bcrypt = require("bcryptjs");

const Dao = require("@evolvus/evolvus-mongo-dao").Dao;
const collection = new Dao("user", dbSchema);

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

module.exports.validate = (userObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof userObject == null) {
        throw new Error(`IllegalArgumentException:userObject is ${userObject}`);
      }
      var res = validate(userObject, schema);
      debug("Validation status: ", JSON.stringify(res));
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

// All validations must be performed before we save the object here
// Once the db layer is called its is assumed the object is valid.

// tenantId cannot be null or undefined, InvalidArgumentError
// check if tenantId is valid from tenant table (todo)
//
// createdBy can be "System" - it cannot be validated against users
// ipAddress is needed for docket, must be passed
//
// object has all the attributes except tenantId, who columns
module.exports.save = (tenantId, ipAddress, createdBy, accessLevel, userObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (tenantId == null || userObject == null) {
        throw new Error("IllegalArgumentException: tenantId/userObject is null or undefined");
      }
      docketObject.name = "user_save";
      docketObject.ipAddress = ipAddress;
      docketObject.createdBy = createdBy;
      docketObject.keyDataAsJSON = JSON.stringify(userObject);
      docketObject.details = `user creation initiated`;
      docketClient.postToDocket(docketObject);
      let object = _.merge(userObject, {
        "tenantId": tenantId
      });
      var res = validate(object, schema);

      debug("Validation status: ", JSON.stringify(res));
      if (!res.valid) {
        if (res.errors[0].name === 'required') {
          reject(`${res.errors[0].argument} is Required`);
        } else {
          reject(res.errors[0].stack);
        }
      } else {
        // Other validations here
        object.userId = object.userId.toUpperCase();
        collection.findOne({
          userId: object.userId
        }).then((userObject) => {
          if (userObject) {
            reject(`UserId ${object.userId} already exists`);
          } else {
            var filterEntity = {
              entityId: object.entityId
            };
            var filterRole = {
              roleName: object.role.roleName
            };
            Promise.all([entity.find(tenantId, object.entityId, accessLevel, filterEntity, {}, 0, 1), role.find(tenantId, filterRole, {}, 0, 1)])
              .then((result) => {
                if (!result[0].length == 0) {
                  object.accessLevel = result[0][0].accessLevel;
                  if (!result[1].length == 0) {
                    if (result[1][0].processingStatus === "AUTHORIZED") {
                      object.applicationCode = result[1][0].applicationCode;
                      bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(object.userPassword, salt, function(err, hash) {
                          // Assign hashedPassword to your userPassword and salt to saltString ,store it in DB.
                          object.userPassword = hash;
                          object.saltString = salt;
                          collection.save(object).then((result) => {
                            var savedObject = _.omit(result.toJSON(), 'userPassword', 'token', 'saltString');
                            debug(`User saved successfully ${savedObject}`);
                            resolve(savedObject);
                          }).catch((e) => {
                            debug(`Failed to save with an error: ${e}`);
                            reject(e);
                          });
                        });
                      });
                    } else {
                      debug(`Role ${object.role.roleName} must be AUTHORIZED`);
                      reject(`Role ${object.role.roleName} must be AUTHORIZED`);
                    }
                  } else {
                    debug(`Role ${object.role.roleName} not found`);
                    reject(`Role ${object.role.roleName} not found`);
                  }
                } else {
                  debug("Entity not found");
                  reject(`Entity not found`);
                }
              }).catch((e) => {
                debug(`Failed to save with an error: ${e}`);
                reject(e);
              });
          }
        }).catch((e) => {
          debug(`Failed to save with an error: ${e}`);
          reject(e);
        });
      }
    } catch (e) {
      docketObject.name = "user_ExceptionOnSave";
      docketObject.ipAddress = ipAddress;
      docketObject.createdBy = createdBy;
      docketObject.keyDataAsJSON = JSON.stringify(userObject);
      docketObject.details = `caught Exception on user_save ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

// List all the objects in the database
// makes sense to return on a limited number
// (what if there are 1000000 records in the collection)

// tenantId should be valid
// createdBy should be requested user, not database object user, used for auditObject
// ipAddress should ipAddress
// filter should only have fields which are marked as filterable in the model Schema
// orderby should only have fields which are marked as sortable in the model Schema


module.exports.find = (tenantId, entityId, accessLevel, createdBy, ipAddress, filter, orderby, skipCount, limit) => {
  return new Promise((resolve, reject) => {
    try {
      if (tenantId == null) {
        throw new Error("IllegalArgumentException: tenantId is null or undefined");
      }
      docketObject.name = "user_getAll";
      docketObject.ipAddress = ipAddress;
      docketObject.createdBy = createdBy;
      docketObject.keyDataAsJSON = `getAll with limit ${limit}`;
      docketObject.details = `user getAll method`;
      docketClient.postToDocket(docketObject);

      collection.find(filter, orderby, skipCount, limit).then((docs) => {
        debug(`User(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        debug(`Failed to find all the user(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      docketObject.name = "user_ExceptionOngetAll";
      docketObject.ipAddress = ipAddress;
      docketObject.createdBy = createdBy;
      docketObject.keyDataAsJSON = "userObject";
      docketObject.details = `caught Exception on user_getAll ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};


// tenantId should be valid
module.exports.update = (tenantId, userId, object, accessLevel, entityId) => {
  return new Promise((resolve, reject) => {
    try {
      if (tenantId == null || userId == null) {
        throw new Error("IllegalArgumentException:tenantId/userName is null or undefined");
      }
      userId = userId.toUpperCase();
      var filterUser = {
        userId: userId
      };
      // var res = validate(object, schema);
      // debug("Validation status: ", JSON.stringify(res));
      // if (!res.valid) {
      //   if (res.errors[0].name === 'required') {
      //     reject(`${res.errors[0].argument} is Required`);
      //   } else {
      //     reject(res.errors[0].stack);
      //   }
      // } else {
      // Other validations here
      collection.find(filterUser, {}, 0, 1).then((user) => {
        if (user.length != 0) {
          if (object.entityId == null) {
            object.entityId = user[0].entityId;
          }
          if (object.role == null || objet.role.roleName == null) {
            object.role = user[0].role;
          }
          var filterEntity = {
            entityId: object.entityId
          };
          var filterRole = {
            roleName: object.role.roleName
          };
          Promise.all([entity.find(tenantId, object.entityId, accessLevel, filterEntity, {}, 0, 1), role.find(tenantId, filterRole, {}, 0, 1)])
            .then((result) => {
              if (!result[0].length == 0) {
                object.accessLevel = result[0][0].accessLevel;
                if (!result[1].length == 0) {
                  if (result[1][0].processingStatus === "AUTHORIZED") {
                    collection.update(filterUser, object).then((result) => {
                      if (result.nModified === 1) {
                        debug(`User updated successfully ${result}`);
                        resolve(`User updated successfully ${result}`);
                      } else {
                        debug(`Failed to update.`);
                        reject(`Failed to update.`);
                      }
                    }).catch((e) => {
                      debug(`Failed to update with an error: ${e}`);
                      reject(e);
                    });
                  } else {
                    debug(`Role ${object.role.roleName} must be AUTHORIZED`);
                    reject(`Role ${object.role.roleName} must be AUTHORIZED`);
                  }
                } else {
                  debug(`Role ${object.role.roleName} not found`);
                  reject(`Role ${object.role.roleName} not found`);
                }
              } else {
                debug("Entity not found");
                reject(`Entity not found`);
              }
            }).catch((e) => {
              debug(`Failed to save with an error: ${e}`);
              reject(e);
            });
        } else {
          debug("No user found matching the userId " + userId);
          reject("No user found matching the userId " + userId);
        }
      }).catch((e) => {
        debug(`Failed to update a user due to an error: ${e}`);
        reject(e);
      });
      // }
    } catch (e) {
      debug(`Caught exception ${e}`);
      reject(e);
    }
  });
};


// Get the entity idenfied by the id parameter
module.exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof(id) == "undefined" || id == null) {
        throw new Error("IllegalArgumentException: id is null or undefined");
      }
      docketObject.name = "user_getById";
      docketObject.keyDataAsJSON = `userObject id is ${id}`;
      docketObject.details = `user getById initiated`;
      docketClient.postToDocket(docketObject);

      collection.findById(id)
        .then((res) => {
          if (res) {
            debug(`User found by id ${id} is ${res}`);
            resolve(res);
          } else {
            // return empty object in place of null
            debug(`No user found by this id ${id}`);
            resolve({});
          }
        }).catch((e) => {
          debug(`Failed to find user ${e}`);
          reject(e);
        });

    } catch (e) {
      docketObject.name = "user_ExceptionOngetById";
      docketObject.keyDataAsJSON = `userObject id is ${id}`;
      docketObject.details = `caught Exception on user_getById ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.getOne = (attribute, value) => {
  return new Promise((resolve, reject) => {
    try {
      if (attribute == null || value == null || typeof attribute === 'undefined' || typeof value === 'undefined') {
        throw new Error("IllegalArgumentException: attribute/value is null or undefined");
      }
      docketObject.name = "user_getOne";
      docketObject.keyDataAsJSON = `userObject ${attribute} with value ${value}`;
      docketObject.details = `user getOne initiated`;
      docketClient.postToDocket(docketObject);
      var query = {};
      query[attribute] = value;
      collection.findOne(query).then((data) => {
        if (data) {
          debug(`User found ${data}`);
          resolve(data);
        } else {
          // return empty object in place of null
          debug(`No user found by this ${attribute} ${value}`);
          resolve({});
        }
      }).catch((e) => {
        debug(`Failed to find ${e}`);
      });
    } catch (e) {
      docketObject.name = "user_ExceptionOngetOne";
      docketObject.keyDataAsJSON = `userObject ${attribute} with value ${value}`;
      docketObject.details = `caught Exception on user_getOne ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.getMany = (attribute, value) => {
  return new Promise((resolve, reject) => {
    try {
      if (attribute == null || value == null || typeof attribute === 'undefined' || typeof value === 'undefined') {
        throw new Error("IllegalArgumentException: attribute/value is null or undefined");
      }

      docketObject.name = "user_getMany";
      docketObject.keyDataAsJSON = `userObject ${attribute} with value ${value}`;
      docketObject.details = `user getMany initiated`;
      docketClient.postToDocket(docketObject);
      var query = {};
      query[attribute] = value;
      collection.findMany(query).then((data) => {
        if (data) {
          debug(`User found ${data}`);
          resolve(data);
        } else {
          // return empty object in place of null
          debug(`No user found by this ${attribute} ${value}`);
          resolve([]);
        }
      }).catch((e) => {
        debug(`Failed to find ${e}`);
        reject(e);
      });
    } catch (e) {
      docketObject.name = "user_ExceptionOngetMany";
      docketObject.keyDataAsJSON = `userObject ${attribute} with value ${value}`;
      docketObject.details = `caught Exception on user_getMany ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

//Authenticate User credentials {userName,userPassword,application}
module.exports.authenticate = (credentials) => {
  return new Promise((resolve, reject) => {
    try {
      if (credentials == null || typeof credentials === 'undefined') {
        throw new Error("IllegalArgumentException:credentials is null or undefined");
      }
      let query = {
        "userName": credentials.userName,
        "enabledFlag": 1,
        "applicationCode": credentials.applicationCode,
        "processingStatus": "AUTHORIZED"
      };
      collection.findOne(query)
        .then((userObj) => {
          if (userObj) {
            bcrypt.hash(credentials.userPassword, userObj.saltString, (err, hash) => {
              if (hash === userObj.userPassword) {
                userObj = userObj.toObject();
                delete userObj.saltString;
                delete userObj.userPassword;
                debug("Authentication successful: ", userObj);
                resolve(userObj);
              } else {
                debug(`Authentication failed.Password Error`);
                reject("Authentication failed.Password Error");
              }
            });
          } else {
            debug(`Invalid username/password`);
            reject("Invalid username/password");
          }
        }, (err) => {
          debug(`Failed to authenticate due to ${err}`);
          reject(`Failed to authenticate due to ${err}`);
        })
        .catch((e) => {
          debug(`Exception on authenticating user: ${e}`);
          reject(e);
        });
    } catch (e) {
      debug(`Caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.updateToken = (id, token) => {
  return new Promise((resolve, reject) => {
    try {
      if (id == null || token == null) {
        throw new Error(`IllegalArgumentException:id/token is null or undefined`);
      }
      let filter = {
        "_id": id
      };
      var update = {
        token: token
      };
      collection.update(filter, update).then((result) => {
        if (result.nModified == 1) {
          debug(`Token updated successfully ${result}`);
          resolve(result);
        } else {
          debug(`Failed to update token.`);
          reject("Failed to update token.");
        }
      }).catch((e) => {
        debug(`Exception on update token ${e}`);
        reject(e);
      });
    } catch (e) {
      debug(`Caught exception ${e}`);
      reject(e);
    }
  });
};