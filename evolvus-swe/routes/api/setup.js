const debug = require("debug")("evolvus-swe:routes:api:setup");
const _ = require("lodash");
const schema = require("../../model/sweSetupSchema");
const service = require("../../model/sweSetup");
const attributes = _.keys(schema.properties);
const shortid = require("shortid");

const LIMIT = process.env.LIMIT || 10;
const tenantHeader = "X-TENANT-ID";
const userHeader = "X-USER";
const PAGE_SIZE = 10;

module.exports = (router) => {
  router.route('/setup')
    .post((req, res, next) => {
      const response = {
        "status": "200",
        "description": "",
        "data": {}
      };
      let tenantId = req.body.tenantId;
      let body = _.pick(req.body, attributes);
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
          response.description = "Unable to save workflow engine configuration. Contact administrator";
          debug("Reference %s, Unexpected exception in save %o", reference, JSON.stringify(e));
          res.status(400)
            .send(JSON.stringify(response, null, 2));
        });
    });

  router.route('/setup')
    .get((req, res, next) => {
      const tenantId = req.header(tenantHeader);
      const createdBy = req.header(userHeader);
      const ipAddress = req.ip;
      const response = {
        "status": "200",
        "description": "",
        "data": {}
      };

      var limit = _.get(req.query, "limit", LIMIT);
      var pageSize = _.get(req.query, "pageSize", PAGE_SIZE);
      var pageNo = _.get(req.query, "pageSize", 1);
      var skipCount = (pageNo - 1) * pageSize;
      var filter = _.pick(req.query, attributes);
      var sort = _.get(req.query, "sort", {});
      var orderby = sortable(sort);

      service.find(tenantId, filter, orderby, skipCount, limit)
        .then((result) => {
          response.description = (result.length == 0 ? "No matching records found" : "Found matching records");
          response.data = result;
          res.status(200)
            .send(JSON.stringify(response, null, 2));
        })
        .catch((e) => {
          response.status = "400";
          response.data = null;
          response.description = e;
          res.status(400)
            .send(JSON.stringify(response, null, 2));
        });
    });
};

function sortable(sort) {
  if (typeof sort === 'undefined' ||
    sort == null) {
    return {};
  }
  if (typeof sort === 'string') {
    var result = sort.split(",")
      .reduce((temp, sortParam) => {
        if (sortParam.charAt(0) == "-") {
          return _.assign(temp, _.fromPairs([
            [sortParam.replace(/-/, ""), -1]
          ]));
        } else {
          return _.assign(_.fromPairs([
            [sortParam.replace(/\+/, ""), 1]
          ]));
        }
      }, {});
    return result;
  } else {
    return {};
  }
}
