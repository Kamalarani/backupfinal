const debug = require("debug")("evolvus-role.test.index");
const chai = require("chai");
const mongoose = require("mongoose");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204:27017/TestPlatform_Dev";
/*
 ** chaiAsPromised is needed to test promises
 ** it adds the "eventually" property
 **
 ** chai and others do not support async / await
 */
const chaiAsPromised = require("chai-as-promised");

const expect = chai.expect;
chai.use(chaiAsPromised);

const role = require("../index");
const db = require("../db/role");
const roleTestData = require("./db/roleTestData");
const tenantOne = "IVL";
const tenantTwo = "KOT";
describe('role model validation', () => {
  // let roleObject = {
  //   "tenantId": "IVL",
  //   "entityId": "Entity",
  //   "accessLevel": "1",
  //   "applicationCode": "CDA",
  //   "enableFlag": "1",
  //   "roleName": "admin_One",
  //   "menuGroup": [{
  //     "tenantId": "tid",
  //     "applicationCode": "CDA",
  //     "menuGroupCode": "mgc",
  //     "menuGroupOrder": 1,
  //     "createdDate": new Date().toISOString(),
  //     "createdBy": "user",
  //     "title": "menugroup title",
  //     "menuItems": [{
  //       "menuItemType": "queues",
  //       "applicationCode": "CDA",
  //       "menuItemOrder": 1,
  //       "menuItemCode": "mic",
  //       "title": "menuItem title"
  //     }, {
  //       "menuItemType": "queues",
  //       "applicationCode": "RTP",
  //       "menuItemOrder": 2,
  //       "menuItemCode": "mic",
  //       "title": "menuItem title"
  //     }]
  //   }],
  //   "description": "admin_One decription *",
  //   "activationStatus": "ACTIVE",
  //   "associatedUsers": 5,
  //   "createdBy": "kamalarani",
  //   "createdDate": new Date().toISOString(),
  //   "lastUpdatedDate": new Date().toISOString()
  // };

  let invalidObject = {
    //add invalid role Object here
    "tenantId": "IVL",
    "entityId": "Entity2",
    "accessLevel": "1",
    "applicationCode": "CDA",
    "enableFlag": "1",
    "menuGroup": [{
      "tenantId": "tid",
      "applicationCode": "CDA",
      "menuGroupCode": "mgc",
      "title": "menugroup title",
      "menuItems": [{
        "menuItemType": "queues",
        "applicationCode": "CDA",
        "menuItemCode": "mic",
        "title": "menuItem title"
      }, {
        "menuItemType": "queues",
        "applicationCode": "RTP",
        "menuItemCode": "mic",
        "title": "menuItem title"
      }]
    }],
    "description": "admin_One decription *",
    "activationStatus": "ACTIVE",
    "associatedUsers": 5,
    "createdBy": "kamalarani",
    "createdDate": new Date().toISOString(),
    "lastUpdatedDate": new Date().toISOString()
  };

  let undefinedObject; // object that is not defined
  let nullObject = null; // object that is null

  // before we start the tests, connect to the database
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe("validation against jsonschema", () => {
    it("valid role should validate successfully", (done) => {
      try {
        const validObject1 = roleTestData.validObject1;
        var res = role.validate(tenantOne, validObject1);
        expect(res)
          .to.eventually.equal(true)
          .notify(done);
        // if notify is not done the test will fail
        // with timeout

      } catch (e) {
        expect.fail(e, null, `valid role object should not throw exception: ${e}`);
      }
    });

    it("invalid role should return errors", (done) => {
      try {
        var res = role.validate(invalidObject);
        expect(res)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    if ("should error out for undefined objects", (done) => {
        try {
          var res = role.validate(undefinedObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

    if ("should error out for null objects", (done) => {
        try {
          var res = role.validate(nullObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });
  });

  describe("testing update Role", () => {
    beforeEach((done) => {
      db.deleteAll(tenantOne)
        .then((value) => {
          return db.deleteAll(tenantTwo);
        })
        .then((value) => {
          return db.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject1);
        })
        .then((value) => {
          return db.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject2);
        })
        .then((value) => {
          return db.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject3);
        })
        .then((value) => {
          return db.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject4);
        })
        .then((value) => {
          done();
        });
    });
    it('should update a role with new values', (done) => {
      var res = role.update(tenantOne, "admin_Two", "admin_Two", {
        "enableFlag": 1,
        "roleName": "admin_Two",
        "description": "test update"
      });
      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app)
            .to.have.property("nModified")
            .to.equal(1);
          done();
        });
    });
    it("should throw IllegalArgumentException for undefined tenantId parameter ", (done) => {
      let undefinedId;
      let res = role.update(undefinedId, "admin_One", {
        roleName: "Admin"
      });
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for undefined code parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let undefinedCode;
      let res = role.update(tenantOne, undefinedCode, null);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for undefined update parameter ", (done) => {
      let undefinedUpdate;
      let res = role.update(tenantOne, "admin_One", undefinedUpdate);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for null tenantId parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let res = role.update(null, "admin_One", {
        roleName: "Admin"
      });
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for null code parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let res = role.update(tenantOne, null, {
        roleName: "Admin"
      });
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for null update parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let res = role.update(tenantOne, "admin_One", null);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });
  });
});