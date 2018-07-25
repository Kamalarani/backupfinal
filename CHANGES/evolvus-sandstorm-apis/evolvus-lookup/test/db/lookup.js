const debug = require("debug")("evolvus-lookup.test.db.lookup");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const lookup = require("../../db/lookup");
const lookupTestData = require("./lookupTestData");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestLookUp";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/lookup.js
describe("db lookup testing", () => {

  const tenantOne = "T001";
  const tenantTwo = "T002";

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

  describe("testing lookup.save", () => {
    // Testing save
    // 1. Valid lookup should be saved.
    // 2. Non lookup object should not be saved.
    // 3. Should not save same lookup twice.
    beforeEach((done) => {
      lookup.deleteAll(tenantOne)
        .then((data) => {
          return lookup.deleteAll(tenantTwo);
        })
        .then((data) => {
          done();
        });
    });

    it("should fail saving invalid object to database", (done) => {
      // try to save an invalid object
      const invalidObject1 = lookupTestData.invalidObject1;
      let res = lookup.save(tenantOne, invalidObject1);
      expect(res)
        .to.be.eventually.rejectedWith("lookup validation failed")
        .notify(done);
    });

    it("should save valid lookup to database", (done) => {
      const validObject1 = lookupTestData.validObject1;
      let res = lookup.save(tenantOne, validObject1);
      expect(res)
        .to.eventually.have.property("_id")
        .notify(done);
    });

    it("should save multple valid lookup(s) to database", (done) => {
      const validObject1 = lookupTestData.validObject1;
      const validObject2 = lookupTestData.validObject2;

      lookup.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return lookup.save(tenantOne, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

    it("should save valid lookup(s) for multiple tenants to database", (done) => {
      const validObject1 = lookupTestData.validObject1;
      const validObject2 = lookupTestData.validObject2;

      lookup.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return lookup.save(tenantTwo, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

  }); // testing save

  describe("testing lookup.find", () => {
    // Testing save
    // 1. Valid lookup should be saved.
    // 2. Non lookup object should not be saved.
    // 3. Should not save same lookup twice.
    beforeEach((done) => {
      lookup.deleteAll(tenantOne)
        .then((value) => {
          return lookup.deleteAll(tenantTwo);
        })
        .then((value) => {
          return lookup.save(tenantOne, lookupTestData.validObject1);
        })
        .then((value) => {
          return lookup.save(tenantOne, lookupTestData.validObject2);
        })
        .then((value) => {
          return lookup.save(tenantOne, lookupTestData.validObject3);
        })
        .then((value) => {
          return lookup.save(tenantOne, lookupTestData.validObject4);
        })
        .then((value) => {
          return lookup.save(tenantOne, lookupTestData.validObject5);
        })
        .then((value) => {
          return lookup.save(tenantOne, lookupTestData.validObject6);
        })
        .then((value) => {
          return lookup.save(tenantOne, lookupTestData.validObject7);
        })
        .then((value) => {
          return lookup.save(tenantOne, lookupTestData.validObject8);
        })
        .then((value) => {
          return lookup.save(tenantTwo, lookupTestData.validObject1);
        })
        .then((value) => {
          return lookup.save(tenantTwo, lookupTestData.validObject2);
        })
        .then((value) => {
          return lookup.save(tenantTwo, lookupTestData.validObject3);
        })
        .then((value) => {
          return lookup.save(tenantTwo, lookupTestData.validObject4);
        })
        .then((value) => {
          return lookup.save(tenantTwo, lookupTestData.validObject5);
        })
        .then((value) => {
          return lookup.save(tenantTwo, lookupTestData.validObject6);
        })
        .then((value) => {
          return lookup.save(tenantTwo, lookupTestData.validObject7);
        })
        .then((value) => {
          return lookup.save(tenantTwo, lookupTestData.validObject8);
        })
        .then((value) => {
          done();
        });
    });

    it("should return all the values of a tenant", (done) => {
      let res = lookup.find(tenantOne, {}, {}, 0, 0);

      expect(res)
        .to.eventually.have.lengthOf(8)
        .notify(done);
    });

    it("should return a single value of a tenant", (done) => {
      let res = lookup.find(tenantOne, {}, {}, 0, 1);

      expect(res)
        .to.eventually.have.lengthOf(1)
        .notify(done);
    });

    it("should return a Platform object", (done) => {
      let res = lookup.find(tenantOne, {
        "lookupCode": "PRODUCT_CODE"
      }, {}, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result:" + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("lookupCode")
            .to.equal("PRODUCT_CODE");
          done();
        });
    });

    it("should return PRODUCT_CODE, the first lookup when sorted by lookupCode", (done) => {
      let res = lookup.find(tenantOne, {}, {
        "lookupCode": 1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("lookupCode")
            .to.equal("PRODUCT_CODE");
          done();
        });
    });

    it("should return Platform, the last lookup when sorted by lookupCode", (done) => {
      let res = lookup.find(tenantOne, {}, {
        "lookupCode": -1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("lookupCode")
            .to.equal("PRODUCT_CODE");
          done();
        });
    });

    it("should return 6 enabled lookups", (done) => {
      let res = lookup.find(tenantOne, {
        "enabled": "1"
      }, {
        "lookupCode": -1
      }, 0, 10);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app)
            .to.have.lengthOf(6);
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("lookupCode")
            .to.equal("PRODUCT_CODE");
          expect(app[5])
            .to.have.property("lookupCode")
            .to.equal("PRODUCT_CODE");
          done();
        });
    });

  }); // findAll testing

  describe("update testing", () => {
    beforeEach((done) => {
      lookup.deleteAll(tenantOne)
        .then((value) => {
          return lookup.deleteAll(tenantTwo);
        })
        .then((value) => {
          return lookup.save(tenantOne, lookupTestData.validObject1);
        })
        .then((value) => {
          return lookup.save(tenantOne, lookupTestData.validObject2);
        })
        .then((value) => {
          return lookup.save(tenantOne, lookupTestData.validObject3);
        })
        .then((value) => {
          return lookup.save(tenantOne, lookupTestData.validObject4);
        })
        .then((value) => {
          done();
        });
    });

    it("should disable Platform lookup", (done) => {
      let res = lookup.update(tenantOne, "PLF", {
        "enabled": "1",
        "updatedDate": new Date()
          .toISOString(),
        "description": "Updated the lookup at: " + Date.now()
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

}); // db lookup testing