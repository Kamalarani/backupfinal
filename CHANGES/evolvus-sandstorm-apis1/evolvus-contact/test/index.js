const debug = require("debug")("evolvus-contact.test.index");
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
const contactTestData = require("./db/contactTestData");
const contact = require("../index");
const db = require("../db/contact");
const tenantOne = "IVL";
const tenantTwo = "KOT";
describe('contact model validation', () => {
  let contactObject = {
    "tenantId": "IVL",
    "firstName": "vignesh",
    "middleName": "varan",
    "lastName": "p",
    "emailId": "xyz@gmail.com",
    "emailVerified": true,
    "phoneNumber": "111111111",
    "mobileNumber": "2222222222222",
    "mobileVerified": true,
    "faxNumber": "02223",
    "companyName": "Evolvus",
    "address1": "Bangalore",
    "address2": "chennai",
    "city": "Bangalore",
    "state": "karnataka",
    "country": "India",
    "zipCode": "778899",
    "createdDate": new Date()
      .toISOString(),
    "lastUpdatedDate": new Date()
      .toISOString(),
  };

  let invalidObject = {
    //add invalid contact Object here
    "firstName": "yuvan",
    "phoneNumber": "78",
    "mobileNumber": "12",
    "mobileVerified": false
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
    it("valid contact should validate successfully", (done) => {
      try {
        var res = contact.validate(tenantOne, contactObject);
        expect(res)
          .to.eventually.equal(true)
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid contact object should not throw exception: ${e}`);
      }
    });

    it("invalid contact should return errors", (done) => {
      try {
        var res = contact.validate(invalidObject);
        expect(res)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    if ("should error out for undefined objects", (done) => {
        try {
          var res = contact.validate(undefinedObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

    if ("should error out for null objects", (done) => {
        try {
          var res = contact.validate(nullObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

  });


  describe("testing update Contact", () => {
    beforeEach((done) => {
      db.deleteAll(tenantOne)
        .then((value) => {
          return db.deleteAll(tenantTwo);
        })
        .then((value) => {
          return db.save(tenantOne, contactTestData.validObject1);
        })
        .then((value) => {
          return db.save(tenantOne, contactTestData.validObject2);
        })
        .then((value) => {
          return db.save(tenantOne, contactTestData.validObject3);
        })
        .then((value) => {
          return db.save(tenantOne, contactTestData.validObject4);
        })
        .then((value) => {
          done();
        });
    });
    it('should update a contact with new values', (done) => {
      var res = contact.update(tenantOne, "xyz@gmail.com", {
        "middleName": "Varan"
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
      let res = contact.update(undefinedId, "xyz@gmail.com", {
        "firstName": "vignesh"
      });
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for undefined code parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let undefinedCode;
      let res = contact.update(tenantOne, undefinedCode, null);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for undefined update parameter ", (done) => {
      let undefinedUpdate;
      let res = contact.update(tenantOne, "xyz@gmail.com", undefinedUpdate);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for null tenantId parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let res = contact.update(null, "xyz@gmail.com", {
        firstName: "vignesh"
      });
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for null code parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let res = contact.update(tenantOne, null, {
        firstName: "vignesh"
      });
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });

    it("should throw IllegalArgumentException for null update parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value+
      let res = contact.update(tenantOne, "xyz@gmail.com", null);
      expect(res)
        .to.eventually.to.be.rejectedWith("IllegalArgumentException")
        .notify(done);
    });
  });
});