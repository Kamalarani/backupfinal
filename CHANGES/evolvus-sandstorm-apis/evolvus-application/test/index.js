const debug = require("debug")("evolvus-application.test.index");
const chai = require("chai");
const mongoose = require("mongoose");
const dbSchema = require("../db/applicationSchema");

const Dao = require("@evolvus/evolvus-mongo-dao").Dao;
const collection = new Dao("application", dbSchema);


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
const applicationTestData = require("./applicationTestData");
const application = require("../index");

const tenantOne = "IVL";
const tenantTwo = "KOT";
describe('application model validation', () => {
  let applicationObject = {
    "tenantId": "IVL",
    "applicationName": "Dockets",
    "applicationCode": "DOCKETs",
    "createdBy": "Srihari",
    "createdDate": new Date()
      .toISOString(),
    "enableFlag": "1",
    "logo": "",
    "favicon": "",
    "description": "This is application object",
    "updatedBy": "Srihari",
    "lastupdatedDate": new Date()
      .toISOString(),
  };

  let invalidObject = {
    //add invalid application Object here
    applicationName: "Docket",
    createdBy: "Kavya",
    createdDate: new Date()
      .toISOString(),
    enableFlag: false
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
    it("valid application should validate successfully", (done) => {
      try {
        var res = application.validate(applicationTestData.validObject1);
        expect(res)
          .to.eventually.equal(true)
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid application object should not throw exception: ${e}`);
      }
    });

    it("invalid application should return errors", (done) => {
      try {
        var res = application.validate(invalidObject);
        expect(res)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    if ("should error out for undefined objects", (done) => {
        try {
          var res = application.validate(undefinedObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

    if ("should error out for null objects", (done) => {
        try {
          var res = application.validate(nullObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

  });

  describe("testing update application", () => {
    beforeEach((done) => {
      collection.deleteAll(tenantOne)
        .then((value) => {
          return collection.deleteAll(tenantTwo);
        })
        .then((value) => {
          return collection.save(tenantOne, applicationTestData.validObject1);
        })
        .then((value) => {
          return collection.save(tenantOne, applicationTestData.validObject2);
        })
        .then((value) => {
          return collection.save(tenantOne, applicationTestData.validObject3);
        })
        .then((value) => {
          return collection.save(tenantOne, applicationTestData.validObject4);
        })
        .then((value) => {
          done();
        });
    });
    it('should update a application with new values', (done) => {
      var res = application.update(tenantOne, "CDA", {
        "enableFlag": 0,
        "applicationCode": "CDA",
        "lastUpdatedDate": new Date()
          .toISOString(),
      }, "CDA");
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
      let res = application.update(undefinedId, "CDA", {
        applicationName: "DOCKET"
      }, "CDA");
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for undefined code parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let undefinedCode;
      let res = application.update(tenantOne, undefinedCode, null, "CDA");
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for undefined update parameter ", (done) => {
      let undefinedUpdate;
      let res = application.update(tenantOne, "CDA", undefinedUpdate, "CDA");
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for null tenantId parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let res = application.update(null, "CDA", {
        applicationName: "DOCKET"
      }, "CDA");
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for null code parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let res = application.update(tenantOne, null, {
        applicationName: "DOCKET"
      }, null);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for null update parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let res = application.update(tenantOne, "CDA", null, "CDA");
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });
  });


});