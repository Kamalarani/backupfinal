const debug = require("debug")("evolvus-swe-client:index");
const axios = require("axios");
var querystring = require('querystring');
var SWE_URL = process.env.SWE_URL || "http://localhost:3000/api/swe";
var TIME_OUT = process.env.TIME_OUT || 5000;

module.exports.initialize = (sweEventObject) => {
  return new Promise((resolve, reject) => {
    try {
      let SWE_INITIALIZE_URL = SWE_URL + "/initialize";
      debug("SWE_INITIALIZE_URL", SWE_INITIALIZE_URL);
      if (sweEventObject == null || sweEventObject == undefined) {
        debug(`IllegalArgument:Object is ${sweEventObject}`);
        resolve(`IllegalArgument:Object is ${sweEventObject}`);
      }
      var instance = axios.create({
        baseURL: SWE_INITIALIZE_URL,
        timeout: TIME_OUT
      });

      instance.post(SWE_INITIALIZE_URL, sweEventObject).then((response) => {
        debug("RESPONSE", response.data);
        resolve(response.data);
      }).catch((error) => {
        debug(`Error:${error} and failed to store is`, sweEventObject);
        resolve(error);
      });
    } catch (error) {
      let response = {
        response.data.wfInstanceId = null,
        response.data.wfInstanceStatus = "REPROCESS"
      }
      debug(`caught exception ${error} and failed to store is`, sweEventObject);
      resolve(response);
    }
  });
};

module.exports.Complete = (sweObject) => {
  return new Promise((resolve, reject) => {
    try {
      let SWE_COMPLETE_URL = SWE_URL + "/complete";
      //resolve(true);
      debug("SWE_COMPLETE_URL", SWE_COMPLETE_URL);
      if (sweObject == null || sweObject == undefined) {
        debug(`IllegalArgument:Object is ${sweObject}`);
        resolve(`IllegalArgument:Object is ${sweObject}`);
      }
      var instance = axios.create({
        baseURL: SWE_COMPLETE_URL,
        timeout: TIME_OUT
      });

      instance.post(SWE_COMPLETE_URL, querystring.stringify(sweObject)).then((response) => {
        debug("RESPONSE", response.data);
        resolve(response.data);
      }).catch((error) => {
        debug(`Error:${error} and failed to store is`, sweObject);
        resolve(error);
      });
    } catch (error) {
      debug(`caught exception ${error} and failed to store is`, sweObject);
      resolve(error);
    }
  });
};