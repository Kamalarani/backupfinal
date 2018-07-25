const debug = require("debug")("evolvus-supportedDateFormats.test.index");
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

const supportedDateFormats = require("../index");
const db = require("../db/supportedDateFormats");
const tenantOne = "IVL";
const tenantTwo = "KOT";
describe('supportedDateFormats model validation', () => {
  let supportedDateFormatsObject = {
    "tenantId": "IVL",
    "formatCode": "DD/MM/YYYY",
    "timeFormat": "hh:mm:ss",
    "description": "This is supportedDateFormats",
    "createdDate": new Date()
      .toISOString(),
    "lastUpdatedDate": new Date()
      .toISOString(),
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "objVersion": 1,
    "enableFlag": "1"
  };

  let invalidObject = {
    //add invalid supportedDateFormats Object here
    "tenantId": "IVL",
    "timeFormat": "Srihari",
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
    it("valid supportedDateFormats should validate successfully", (done) => {
      try {
        var res = supportedDateFormats.validate(tenantOne, supportedDateFormatsObject);
        expect(res)
          .to.eventually.equal(true)
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid supportedDateFormats object should not throw exception: ${e}`);
      }
    });

    it("invalid supportedDateFormats should return errors", (done) => {
      try {
        var res = supportedDateFormats.validate(invalidObject);
        expect(res)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    if ("should error out for undefined objects", (done) => {
        try {
          var res = supportedDateFormats.validate(undefinedObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

    if ("should error out for null objects", (done) => {
        try {
          var res = supportedDateFormats.validate(nullObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

  });
});