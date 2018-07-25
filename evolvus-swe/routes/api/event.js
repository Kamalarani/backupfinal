const debug = require("debug")("evolvus-swe:routes:api:event");
const _ = require("lodash");
const schema = require("../../model/sweEventSchema");
const service = require("../../model/sweEvent");
const attributes = _.keys(schema.properties);
const shortid = require("shortid");

const LIMIT = process.env.LIMIT || 10;
const tenantHeader = "X-TENANT-ID";
const userHeader = "X-USER";
const PAGE_SIZE = 10;

module.exports = (router) => {
  router.route('/event')
    .post((req, res, next) => {
      const response = {
        "status": "200",
        "description": "",
        "data": {}
      };
      let tenantId = req.body.tenantId;
      let body = _.pick(req.body, attributes);
      body.wfInstanceId = shortid.generate();

      body.createdDate = Date.now();
      body.updatedDate = Date.now();
      debug("saving object" + JSON.stringify(body, null, 2));
      service.save(tenantId, body)
        .then((result) => {
          response.description = "Record saved successfully";
          response.data = result;
          res.status(200)
            .send(JSON.stringify(response, null, 2));
        })
        .catch((e) => {
          // With the reference we should be able to search the logs and find out
          // what exactly was the error.
          let reference = shortid.generate();
          response.status = "400";
          response.data = reference;
          response.description = "Unable to save workflow engine event. Contact administrator";
          debug("Reference %s, Unexpected exception in save %o", reference, JSON.stringify(e));
          res.status(400)
            .send(JSON.stringify(response, null, 2));
        });
    });
};