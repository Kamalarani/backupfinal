const debug = require("debug")("evolvus-role.test.db.role");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const role = require("../../db/role");
const roleTestData = require("./roleTestData");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/role.js
describe("db role testing", () => {

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

  describe("testing role.save", () => {
    // Testing save
    // 1. Valid role should be saved.
    // 2. Non role object should not be saved.
    // 3. Should not save same role twice.
    beforeEach((done) => {
      role.deleteAll(tenantOne)
        .then((data) => {
          return role.deleteAll(tenantTwo);
        })
        .then((data) => {
          done();
        });
    });

    it("should fail saving invalid object to database", (done) => {
      // try to save an invalid object
      const invalidObject1 = roleTestData.invalidObject1;
      let res = role.save(tenantOne, "kamalarani", "1", "Entity2", invalidObject1);
      expect(res)
        .to.be.eventually.rejectedWith("role validation failed")
        .notify(done);
    });

    // it("should fail saving duplicate object to database", (done) => {
    //   // save a valid object, then try to save another
    //   const validObject1 = roleTestData.validObject1;
    //   role.save(tenantOne, validObject1)
    //     .then((success) => {
    //       let res = role.save(tenantOne, validObject1);
    //       expect(res)
    //         .to.be.eventually.rejectedWith("duplicate")
    //         .notify(done);
    //     });
    // });

    it("should save valid role to database", (done) => {
      const validObject1 = roleTestData.validObject1;
      let res = role.save(tenantOne, "kamalarani", "1", "Entity2", validObject1);
      expect(res)
        .to.eventually.have.property("_id")
        .notify(done);
    });

    it("should save multiple valid role(s) to database", (done) => {
      const validObject1 = roleTestData.validObject1;
      const validObject2 = roleTestData.validObject2;

      role.save(tenantOne, "kamalarani", "1", "Entity2", validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return role.save(tenantOne, "kamalarani", "1", "Entity2", validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

    it("should save valid role(s) for multiple tenants to database", (done) => {
      const validObject1 = roleTestData.validObject1;
      const validObject2 = roleTestData.validObject2;

      role.save(tenantOne, "kamalarani", "1", "Entity2", validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return role.save(tenantTwo, "kamalarani", "1", "Entity2", validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

  }); // testing save

  describe("testing role.find", () => {
    // Testing save
    // 1. Valid role should be saved.
    // 2. Non role object should not be saved.
    // 3. Should not save same role twice.
    beforeEach((done) => {
      role.deleteAll(tenantOne)
        .then((value) => {
          return role.deleteAll(tenantTwo);
        })
        .then((value) => {
          return role.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject1);
        })
        .then((value) => {
          return role.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject2);
        })
        .then((value) => {
          return role.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject3);
        })
        .then((value) => {
          return role.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject4);
        })
        .then((value) => {
          return role.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject5);
        })
        .then((value) => {
          return role.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject6);
        })
        .then((value) => {
          return role.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject7);
        })
        .then((value) => {
          return role.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject8);
        })
        .then((value) => {
          return role.save(tenantTwo, "kamalarani", "1", "Entity2", roleTestData.validObject1);
        })
        .then((value) => {
          return role.save(tenantTwo, "kamalarani", "1", "Entity2", roleTestData.validObject2);
        })
        .then((value) => {
          return role.save(tenantTwo, "kamalarani", "1", "Entity2", roleTestData.validObject3);
        })
        .then((value) => {
          return role.save(tenantTwo, "kamalarani", "1", "Entity2", roleTestData.validObject4);
        })
        .then((value) => {
          return role.save(tenantTwo, "kamalarani", "1", "Entity2", roleTestData.validObject5);
        })
        .then((value) => {
          return role.save(tenantTwo, "kamalarani", "1", "Entity2", roleTestData.validObject6);
        })
        .then((value) => {
          return role.save(tenantTwo, "kamalarani", "1", "Entity2", roleTestData.validObject7);
        })
        .then((value) => {
          return role.save(tenantTwo, "kamalarani", "1", "Entity2", roleTestData.validObject8);
        })
        .then((value) => {
          done();
        });
    });

    it("should return all the values of a tenant", (done) => {
      let res = role.find(tenantOne, {}, {}, 0, 0);

      expect(res)
        .to.eventually.have.lengthOf(8)
        .notify(done);
    });

    it("should return a single value of a tenant", (done) => {
      let res = role.find(tenantOne, {}, {}, 0, 1);

      expect(res)
        .to.eventually.have.lengthOf(1)
        .notify(done);
    });

    it("should return 2 roles", (done) => {
      let res = role.find(tenantOne, {
        "applicationCode": "CDA"
      }, {}, 0, 2);
      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result:" + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("applicationCode")
            .to.equal("CDA");
          done();
        });
    });

    it("should return ASBA, the first role when sorted by applicationCode", (done) => {
      let res = role.find(tenantOne, {}, {
        "applicationCode": 1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("applicationCode")
            .to.equal("ASBA");
          done();
        });
    });

    it("should return admin_SIX, the last role when sorted by applicationCode", (done) => {
      let res = role.find(tenantOne, {}, {
        "applicationCode": -1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("applicationCode")
            .to.equal("RTP-CONSOLE");
          done();
        });
    });

    it("should return 6 enabled roles", (done) => {
      let res = role.find(tenantOne, {
        "enableFlag": 1
      }, {
        "applicationCode": -1
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
            .to.have.property("applicationCode")
            .to.equal("RTP-CONSOLE");
          expect(app[5])
            .to.have.property("applicationCode")
            .to.equal("ASBA");
          done();
        });
    });

  }); // findAll testing

  describe("update testing", () => {
    beforeEach((done) => {
      role.deleteAll(tenantOne)
        .then((value) => {
          return role.deleteAll(tenantTwo);
        })
        .then((value) => {
          return role.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject1);
        })
        .then((value) => {
          return role.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject2);
        })
        .then((value) => {
          return role.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject3);
        })
        .then((value) => {
          return role.save(tenantOne, "kamalarani", "1", "Entity2", roleTestData.validObject4);
        })
        .then((value) => {
          done();
        });
    });

    it("should disable Platform role", (done) => {
      let res = role.update(tenantOne, "admin_One", {
        "enableFlag": 1,
        "lastUpdatedDate": new Date()
          .toISOString(),
        "roleName": "Updated the role at: " + Date.now()
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
}); // db role testing