const debug = require("debug")("evolvus-supportedDateFormats.test.db.supportedDateFormats");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const supportedDateFormats = require("../../db/supportedDateFormats");
const supportedDateFormatsTestData = require("./supportedDateFormatsTestData");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/supportedDateFormats.js
describe("db supportedDateFormats testing", () => {

  const tenantOne = "IVL";
  const tenantTwo = "KOT";

  /*
   ** Before doing any tests, first get the connection.
   */
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe("testing supportedDateFormats.save", () => {
    // Testing save
    // 1. Valid supportedDateFormats should be saved.
    // 2. Non supportedDateFormats object should not be saved.
    // 3. Should not save same supportedDateFormats twice.
    beforeEach((done) => {
      supportedDateFormats.deleteAll(tenantOne)
        .then((data) => {
          return supportedDateFormats.deleteAll(tenantTwo);
        })
        .then((data) => {
          done();
        });
    });

    it("should fail saving invalid object to database", (done) => {
      // try to save an invalid object
      const invalidObject1 = supportedDateFormatsTestData.invalidObject1;
      let res = supportedDateFormats.save(tenantOne, invalidObject1);
      expect(res)
        .to.be.eventually.rejectedWith("supportedDateFormats validation failed")
        .notify(done);
    });

    it("should fail saving duplicate object to database", (done) => {
      // save a valid object, then try to save another
      const validObject1 = supportedDateFormatsTestData.validObject1;
      supportedDateFormats.save(tenantOne, validObject1)
        .then((success) => {
          let res = supportedDateFormats.save(tenantOne, validObject1);
          expect(res)
            .to.be.eventually.rejectedWith("duplicate")
            .notify(done);
        });
    });

    it("should save valid supportedDateFormats to database", (done) => {
      const validObject1 = supportedDateFormatsTestData.validObject1;
      let res = supportedDateFormats.save(tenantOne, validObject1);
      expect(res)
        .to.eventually.have.property("_id")
        .notify(done);
    });

    it("should save multple valid supportedDateFormats(s) to database", (done) => {
      const validObject1 = supportedDateFormatsTestData.validObject1;
      const validObject2 = supportedDateFormatsTestData.validObject2;

      supportedDateFormats.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return supportedDateFormats.save(tenantTwo, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

    it("should save valid supportedDateFormats(s) for multiple tenants to database", (done) => {
      const validObject1 = supportedDateFormatsTestData.validObject1;
      const validObject2 = supportedDateFormatsTestData.validObject2;

      supportedDateFormats.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return supportedDateFormats.save(tenantTwo, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

  }); // testing save

  describe("testing supportedDateFormats.find", () => {
    // Testing save
    // 1. Valid supportedDateFormats should be saved.
    // 2. Non supportedDateFormats object should not be saved.
    // 3. Should not save same supportedDateFormats twice.
    beforeEach((done) => {
      supportedDateFormats.deleteAll(tenantOne)
        .then((value) => {
          return supportedDateFormats.deleteAll(tenantTwo);
        })
        .then((value) => {
          return supportedDateFormats.save(tenantOne, supportedDateFormatsTestData.validObject1);
        })
        .then((value) => {
          return supportedDateFormats.save(tenantTwo, supportedDateFormatsTestData.validObject2);
        })
        .then((value) => {
          done();
        });
    });

    it("should return all the values of a tenant", (done) => {
      let res = supportedDateFormats.find(tenantOne, {}, {}, 0, 0);

      expect(res)
        .to.eventually.have.lengthOf(1)
        .notify(done);
    });

    it("should return a single value of a tenant", (done) => {
      let res = supportedDateFormats.find(tenantOne, {}, {}, 0, 1);

      expect(res)
        .to.eventually.have.lengthOf(1)
        .notify(done);
    });

    it("should return a Platform object", (done) => {
      let res = supportedDateFormats.find(tenantOne, {
        "formatCode": "DD/MM/YYYY"
      }, {}, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result:" + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("formatCode")
            .to.equal("DD/MM/YYYY");
          done();
        });
    });

    it("should return ASBA, the first supportedDateFormats when sorted by formatCode", (done) => {
      let res = supportedDateFormats.find(tenantOne, {}, {
        "formatCode": 1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("formatCode")
            .to.equal('DD/MM/YYYY');
          done();
        });
    });

    it("should return Platform, the last supportedDateFormats when sorted by formatCode", (done) => {
      let res = supportedDateFormats.find(tenantOne, {}, {
        "formatCode": -1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("formatCode")
            .to.equal('DD/MM/YYYY');
          done();
        });
    });

    it("should return 6 enabled supportedDateFormatss", (done) => {
      let res = supportedDateFormats.find(tenantOne, {
        "enableFlag": "1"
      }, {
        "formatCode": -1
      }, 0, 10);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app)
            .to.have.lengthOf(1);
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("formatCode")
            .to.equal('DD/MM/YYYY');
          expect(app[0])
            .to.have.property("formatCode")
            .to.equal('DD/MM/YYYY');
          done();
        });
    });

  }); // findAll testing

  describe("update testing", () => {
    beforeEach((done) => {
      supportedDateFormats.deleteAll(tenantOne)
        .then((value) => {
          return supportedDateFormats.deleteAll(tenantTwo);
        })
        .then((value) => {
          return supportedDateFormats.save(tenantOne, supportedDateFormatsTestData.validObject1);
        })
        .then((value) => {
          return supportedDateFormats.save(tenantTwo, supportedDateFormatsTestData.validObject2);
        })
        .then((value) => {
          done();
        });
    });

    it("should disable Platform supportedDateFormats", (done) => {
      let res = supportedDateFormats.update(tenantOne, "DD/MM/YYYY", {

        "enableFlag": "1",
        "updatedDate": new Date()
          .toISOString(),
        "description": "Updated the supportedDateFormats at: " + Date.now()
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
  });

}); // db supportedDateFormats testing