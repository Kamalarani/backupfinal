const debug = require("debug")("evolvus-entity.test.db.entity");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const entity = require("../../db/entity");
const entityTestData = require("./entityTestData");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204:27017/TestPlatform_Dev";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/entity.js
describe("db entity testing", () => {

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

  describe("testing entity.save", () => {
    // Testing save
    // 1. Valid entity should be saved.
    // 2. Non entity object should not be saved.
    // 3. Should not save same entity twice.
    beforeEach((done) => {
      entity.deleteAll(tenantOne)
        .then((data) => {
          return entity.deleteAll(tenantTwo);
        })
        .then((data) => {
          done();
        });
    });

    it("should fail saving invalid object to database", (done) => {
      // try to save an invalid object
      const invalidObject1 = entityTestData.invalidObject1;
      let res = entity.save(tenantOne, invalidObject1);
      expect(res)
        .to.be.eventually.rejectedWith("entity validation failed")
        .notify(done);
    });

    it("should fail saving duplicate object to database", (done) => {
      // save a valid object, then try to save another
      const validObject1 = entityTestData.validObject1;
      entity.save(tenantOne, validObject1)
        .then((success) => {
          let res = entity.save(tenantOne, validObject1);
          expect(res)
            .to.be.eventually.rejectedWith("duplicate")
            .notify(done);
        });
    });

    it("should save valid entity to database", (done) => {
      const validObject1 = entityTestData.validObject1;
      let res = entity.save(tenantOne, validObject1);
      expect(res)
        .to.eventually.have.property("_id")
        .notify(done);
    });

    it("should save multple valid entity(s) to database", (done) => {
      const validObject1 = entityTestData.validObject1;
      const validObject2 = entityTestData.validObject2;

      entity.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return entity.save(tenantOne, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

    it("should save valid entity(s) for multiple tenants to database", (done) => {
      const validObject1 = entityTestData.validObject1;
      const validObject2 = entityTestData.validObject2;

      entity.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return entity.save(tenantTwo, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

  }); // testing save

  describe("testing entity.find", () => {
    // Testing save
    // 1. Valid entity should be saved.
    // 2. Non entity object should not be saved.
    // 3. Should not save same entity twice.
    beforeEach((done) => {
      entity.deleteAll(tenantOne)
        .then((value) => {
          return entity.deleteAll(tenantTwo);
        })
        .then((value) => {
          return entity.save(tenantOne, entityTestData.validObject1);
        })
        .then((value) => {
          return entity.save(tenantOne, entityTestData.validObject2);
        })
        .then((value) => {
          return entity.save(tenantOne, entityTestData.validObject3);
        })
        .then((value) => {
          return entity.save(tenantOne, entityTestData.validObject4);
        })
        .then((value) => {
          return entity.save(tenantOne, entityTestData.validObject5);
        })
        .then((value) => {
          return entity.save(tenantOne, entityTestData.validObject6);
        })
        .then((value) => {
          return entity.save(tenantOne, entityTestData.validObject7);
        })
        .then((value) => {
          return entity.save(tenantOne, entityTestData.validObject8);
        })
        .then((value) => {
          return entity.save(tenantTwo, entityTestData.validObject1);
        })
        .then((value) => {
          return entity.save(tenantTwo, entityTestData.validObject2);
        })
        .then((value) => {
          return entity.save(tenantTwo, entityTestData.validObject3);
        })
        .then((value) => {
          return entity.save(tenantTwo, entityTestData.validObject4);
        })
        .then((value) => {
          return entity.save(tenantTwo, entityTestData.validObject5);
        })
        .then((value) => {
          return entity.save(tenantTwo, entityTestData.validObject6);
        })
        .then((value) => {
          return entity.save(tenantTwo, entityTestData.validObject7);
        })
        .then((value) => {
          return entity.save(tenantTwo, entityTestData.validObject8);
        })
        .then((value) => {
          done();
        });
    });

    it("should return all the values of a tenant", (done) => {
      let res = entity.find(tenantOne, "abc12", "1", {}, {}, 0, 0);

      expect(res)
        .to.eventually.have.lengthOf(8)
        .notify(done);
    });

    it("should return a single value of a tenant", (done) => {
      let res = entity.find(tenantOne, "abc12", "1", {}, {}, 0, 1);

      expect(res)
        .to.eventually.have.lengthOf(1)
        .notify(done);
    });

    it("should return a northZone entity", (done) => {
      let res = entity.find(tenantOne, "abc12", "1", {
        "entityCode": "entity3"
      }, {}, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result:" + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("entityCode")
            .to.equal("entity3");
          done();
        });
    });

    it("should return tamilNadu, the first entity when sorted by lastUpdatedDate", (done) => {
      let res = entity.find(tenantOne, "abc12", "1", {}, {
        "lastUpdatedDate": -1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("entityCode")
            .to.equal("entity4");
          done();
        });
    });
    it("should return headOffice, the last entity when sorted by lastUpdatedDate", (done) => {
      let res = entity.find(tenantOne, "abc12", "1", {}, {
        "lastUpdatedDate": -1
      }, 0, 10);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[4])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[4])
            .to.have.property("entityCode")
            .to.equal("entity8");
          done();
        });
    });
    it("should return 7  entities", (done) => {
      let res = entity.find(tenantOne, "abc12", "1", {
        "enableFlag": 1
      }, {
        "lastUpdatedDate": -1
      }, 0, 10);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app)
            .to.have.lengthOf(8);
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("entityCode")
            .to.equal("entity4");
          expect(app[5])
            .to.have.property("entityCode")
            .to.equal("entity2");
          done();
        });
    });

  }); // findAll testing

  describe("update testing", () => {
    beforeEach((done) => {
      entity.deleteAll(tenantOne)
        .then((value) => {
          return entity.deleteAll(tenantTwo);
        })
        .then((value) => {
          return entity.save(tenantOne, entityTestData.validObject1);
        })
        .then((value) => {
          return entity.save(tenantOne, entityTestData.validObject2);
        })
        .then((value) => {
          return entity.save(tenantOne, entityTestData.validObject3);
        })
        .then((value) => {
          return entity.save(tenantOne, entityTestData.validObject4);
        })
        .then((value) => {
          done();
        });
    });

    it("should disable  entity", (done) => {
      let res = entity.update(tenantOne, "entity1", {
        "enableFlag": 0,
        "lastUpdatedDate": new Date()
          .toISOString(),
        "description": "Updated the entity1 at: " + Date.now()
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
}); // db entity testing