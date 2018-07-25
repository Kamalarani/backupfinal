const debug = require("debug")("evolvus-masterTimeZone.test.db.masterTimeZone");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const masterTimeZone = require("../../db/masterTimeZone");
const masterTimeZoneTestData = require("./masterTimeZoneTestData");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/masterTimeZone.js
describe("db masterTimeZone testing", () => {

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

  describe("testing masterTimeZone.save", () => {
    // Testing save
    // 1. Valid masterTimeZone should be saved.
    // 2. Non masterTimeZone object should not be saved.
    // 3. Should not save same masterTimeZone twice.
    beforeEach((done) => {
      masterTimeZone.deleteAll(tenantOne)
        .then((data) => {
          return masterTimeZone.deleteAll(tenantTwo);
        })
        .then((data) => {
          done();
        });
    });

    it("should fail saving invalid object to database", (done) => {
      // try to save an invalid object
      const invalidObject1 = masterTimeZoneTestData.invalidObject1;
      let res = masterTimeZone.save(tenantOne, invalidObject1);
      expect(res)
        .to.be.eventually.rejectedWith("masterTimeZone validation failed")
        .notify(done);
    });

    it("should fail saving duplicate object to database", (done) => {
      // save a valid object, then try to save another
      const validObject1 = masterTimeZoneTestData.validObject1;
      masterTimeZone.save(tenantOne, validObject1)
        .then((success) => {
          let res = masterTimeZone.save(tenantOne, validObject1);
          expect(res)
            .to.be.eventually.rejectedWith("duplicate")
            .notify(done);
        });
    });

    it("should save valid masterTimeZone to database", (done) => {
      const validObject1 = masterTimeZoneTestData.validObject1;
      let res = masterTimeZone.save(tenantOne, validObject1);
      expect(res)
        .to.eventually.have.property("_id")
        .notify(done);
    });

    it("should save multple valid masterTimeZone(s) to database", (done) => {
      const validObject1 = masterTimeZoneTestData.validObject1;
      const validObject2 = masterTimeZoneTestData.validObject2;

      masterTimeZone.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return masterTimeZone.save(tenantOne, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

    it("should save valid masterTimeZone(s) for multiple tenants to database", (done) => {
      const validObject1 = masterTimeZoneTestData.validObject1;
      const validObject2 = masterTimeZoneTestData.validObject2;

      masterTimeZone.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return masterTimeZone.save(tenantTwo, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

  }); // testing save

  describe("testing masterTimeZone.find", () => {
    // Testing save
    // 1. Valid masterTimeZone should be saved.
    // 2. Non masterTimeZone object should not be saved.
    // 3. Should not save same masterTimeZone twice.
    beforeEach((done) => {
      masterTimeZone.deleteAll(tenantOne)
        .then((value) => {
          return masterTimeZone.deleteAll(tenantTwo);
        })
        .then((value) => {
          return masterTimeZone.save(tenantOne, masterTimeZoneTestData.validObject1);
        })
        .then((value) => {
          return masterTimeZone.save(tenantOne, masterTimeZoneTestData.validObject2);
        })
        .then((value) => {
          return masterTimeZone.save(tenantOne, masterTimeZoneTestData.validObject3);
        })
        .then((value) => {
          return masterTimeZone.save(tenantOne, masterTimeZoneTestData.validObject4);
        })
        .then((value) => {
          return masterTimeZone.save(tenantOne, masterTimeZoneTestData.validObject5);
        })
        .then((value) => {
          return masterTimeZone.save(tenantOne, masterTimeZoneTestData.validObject6);
        })
        .then((value) => {
          return masterTimeZone.save(tenantOne, masterTimeZoneTestData.validObject7);
        })
        .then((value) => {
          return masterTimeZone.save(tenantOne, masterTimeZoneTestData.validObject8);
        })
        .then((value) => {
          return masterTimeZone.save(tenantTwo, masterTimeZoneTestData.validObject1);
        })
        .then((value) => {
          return masterTimeZone.save(tenantTwo, masterTimeZoneTestData.validObject2);
        })
        .then((value) => {
          return masterTimeZone.save(tenantTwo, masterTimeZoneTestData.validObject3);
        })
        .then((value) => {
          return masterTimeZone.save(tenantTwo, masterTimeZoneTestData.validObject4);
        })
        .then((value) => {
          return masterTimeZone.save(tenantTwo, masterTimeZoneTestData.validObject5);
        })
        .then((value) => {
          return masterTimeZone.save(tenantTwo, masterTimeZoneTestData.validObject6);
        })
        .then((value) => {
          return masterTimeZone.save(tenantTwo, masterTimeZoneTestData.validObject7);
        })
        .then((value) => {
          return masterTimeZone.save(tenantTwo, masterTimeZoneTestData.validObject8);
        })
        .then((value) => {
          done();
        });
    });

    it("should return all the values of a tenant", (done) => {
      let res = masterTimeZone.find(tenantOne, {}, {}, 0, 0);

      expect(res)
        .to.eventually.have.lengthOf(8)
        .notify(done);
    });

    it("should return a single value of a tenant", (done) => {
      let res = masterTimeZone.find(tenantOne, {}, {}, 0, 1);

      expect(res)
        .to.eventually.have.lengthOf(1)
        .notify(done);
    });

    it("should return a Platform object", (done) => {
      let res = masterTimeZone.find(tenantOne, {
        "zoneName": "Germany"
      }, {}, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result:" + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("zoneName")
            .to.equal("Germany");
          done();
        });
    });

    it("should return CET, the first masterTimeZone when sorted by ZoneCode", (done) => {
      let res = masterTimeZone.find(tenantOne, {}, {
        "zoneCode": 1
      }, 0, 1);
      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("zoneCode")
            .to.equal("ART");
          done();
        });
    });

    it("should return Platform, the last masterTimeZone when sorted by masterTimeZoneCode", (done) => {
      let res = masterTimeZone.find(tenantOne, {}, {
        "zoneCode": -1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("zoneName")
            .to.equal("Japan");
          done();
        });
    });

    it("should return 6 enabled masterTimeZones", (done) => {
      let res = masterTimeZone.find(tenantOne, {
        "enableFlag": "1"
      }, {
        "zoneCode": -1
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
            .to.have.property("zoneName")
            .to.equal("Japan");
          expect(app[5])
            .to.have.property("zoneCode")
            .to.equal("ART");
          done();
        });
    });

  }); // findAll testing

  describe("update testing", () => {
    beforeEach((done) => {
      masterTimeZone.deleteAll(tenantOne)
        .then((value) => {
          return masterTimeZone.deleteAll(tenantTwo);
        })
        .then((value) => {
          return masterTimeZone.save(tenantOne, masterTimeZoneTestData.validObject1);
        })
        .then((value) => {
          return masterTimeZone.save(tenantOne, masterTimeZoneTestData.validObject2);
        })
        .then((value) => {
          return masterTimeZone.save(tenantOne, masterTimeZoneTestData.validObject3);
        })
        .then((value) => {
          return masterTimeZone.save(tenantOne, masterTimeZoneTestData.validObject4);
        })
        .then((value) => {
          done();
        });
    });

    it("should disable Platform masterTimeZone", (done) => {
      let res = masterTimeZone.update(tenantOne, "IST", {
        "objVersion": 1234,
        "updatedDate": new Date()
          .toISOString()

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

}); // db masterTimeZone testing