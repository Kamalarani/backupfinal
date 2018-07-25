const debug = require("debug")("evolvus-masterTimeZone.test.index");
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

const masterTimeZone = require("../index");
const db = require("../db/masterTimeZone");
const tenantOne = "IVL";
const tenantTwo = "KOT";
describe('masterTimeZone model validation', () => {
  let masterTimeZoneObject = {
    "tenantId": "IVL",
    "zoneCode": "IST",
    "zoneName": "ASIA",
    "offsetValue": "+05.30",
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdDate": new Date().toISOString(),
    "lastUpdatedDate": new Date().toISOString(),
    "offSet": "UTC+05:30",
    "objVersion": 123,
    "enableFlag": "1"
  };

  let invalidObject = {
    //add invalid masterTimeZone Object here
    "tenantId": "IVL",
    "zoneName": "ASIA",
    "offsetValue": "offone"
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
    it("valid masterTimeZone should validate successfully", (done) => {
      try {
        var res = masterTimeZone.validate(tenantOne, masterTimeZoneObject);
        expect(res)
          .to.eventually.equal(true)
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid masterTimeZone object should not throw exception: ${e}`);
      }
    });

    it("invalid masterTimeZone should return errors", (done) => {
      try {
        var res = masterTimeZone.validate(invalidObject);
        expect(res)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    if ("should error out for undefined objects", (done) => {
        try {
          var res = masterTimeZone.validate(undefinedObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

    if ("should error out for null objects", (done) => {
        try {
          var res = masterTimeZone.validate(nullObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

  });
});