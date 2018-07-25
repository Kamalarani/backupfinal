const debug = require("debug")("evolvus-swe:index");
const _ = require('lodash');
const setupService = require("./model/sweSetup");
const eventService = require("./model/sweEvent");
const axios = require("axios");

const shortid = require("shortid");

// initalize is called with the wfEntity, wfEntityAction and the query criteria
// to be used to update the wfEntity.
// We query the wfSetup table to get the configuration matchnig the wfEntity
// and wfEntityAction criteria. if there is no record we reject the promise
// with a wfStatus of 'NO_WORKFLOW_DEFINED' and wfInstanceId of 0
// if an instance is found and no callback or flowCode is defined, we return
// INVALID_WF_CONFIGURATION, wfInstanceId = 0
// if all is fine, we create a new wfInstanceId, save a record in wfEvent and then
// we execute callback with new wfInstanceId, and status = 'INITIATED'
// if the flowCode is 'AA' - we call complete with Status = 'APPROVED', wfInstanceId
// (newly created), and comment - Automatic Approval.
module.exports.initialize = (tenantId, createdBy, wfEntity, wfEntityAction, objectId) => {
  let wfInstanceId = shortid.generate();
  let sweEvent = {
    "wfInstanceId": wfInstanceId,
    "wfInstanceStatus": "IN_PROGRESS",
    "wfEntity": wfEntity,
    "wfEntityAction": wfEntityAction,
    "query": JSON.stringify(objectId),
    "wfEventDate": Date.now(),
    "wfEvent": "PENDING_AUTHORIZATION",
    "createdBy": createdBy,
    "createdDate": Date.now()
  };
  return eventService.save(tenantId, sweEvent)
    .then((result) => {
      debug("result %o", result);
      var query = {
        "wfEntity": wfEntity,
        "wfEntityAction": wfEntityAction
      };
      return setupService.findOne(tenantId, query);
    })
    .then((result) => {
      if (result == null) { // no records found..
        return module.exports.complete(tenantId, createdBy, wfEntity, wfEntityAction, query, wfInstanceId, "REPROCESS", "Invalid WF Configuration")
      } else {
        if (result.flowCode == 'AA') { // automatic approval
          return module.exports.complete(tenantId, createdBy, wfEntity, wfEntityAction, query, wfInstanceId, "AUTHORIZED", "Automatic Approval")
        } else { // maker checker
          return Promise.resolve(sweEvent);
        }
      }
    });
};

module.exports.complete = (tenantId, createdBy, wfEntity, wfEntityAction, objectId, wfInstanceId, wfEvent, comments) => {
  let sweEvent = {
    "wfInstanceId": wfInstanceId,
    "wfInstanceStatus": "COMPLETED",
    "wfEntity": wfEntity,
    "wfEntityAction": wfEntityAction,
    "query": JSON.stringify(objectId),
    "wfEventDate": Date.now(),
    "wfEvent": wfEvent,
    "createdBy": createdBy,
    "createdDate": Date.now(),
    "comments": comments
  };
  debug("saving event %O", sweEvent);
  var query = {
    "wfEntity": wfEntity,
    "wfEntityAction": wfEntityAction
  };
  setupService.findOne(tenantId, query).then((result) => {
    console.log("result", result);
    axios({
      headers: {
        "X-TENANT-ID": "T001",
        "X-USER": "user",
        "X-IP-HEADER": "192.168.1.122",
        "X-ACCESS-LEVEL": "2",
        "X-ENTITY-ID": "H001B001GW9wL"
      },
      method: result.callbackMethod,
      url: result.callbackURL,
      data: {
        "wfInstanceStatus": "COMPLETED"
      }

    }).catch((err) => {
      console.log("error axiox", err);
    });
    // axios.get(result.callbackURL)
    //   .then(function(response) {
    //     console.log(response.data);
    //     console.log(response.status);
    //     console.log(response.statusText);
    //     console.log(response.headers);
    //     console.log(response.config);
    //   });
  }).catch((err) => {
    debug(`Error:${err} and failed to findOne setup`);
    resolve(err);
  });
  return eventService.update(tenantId, {
      "wfInstanceId": wfInstanceId
    }, {
      "wfInstanceStatus": "COMPLETED",
      "updatedBy": createdBy,
      "updatedDate": Date.now()
    })
    .then((result) => {
      return eventService.save(tenantId, sweEvent);
    });
};