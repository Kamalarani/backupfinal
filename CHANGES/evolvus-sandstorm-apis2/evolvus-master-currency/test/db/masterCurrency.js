const debug = require("debug")("evolvus-masterCurrency.test.db.masterCurrency");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const masterCurrency = require("../../db/masterCurrency");
const masterCurrencyData = require("./masterCurrencyTestData");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/masterCurrency.js
describe("db masterCurrency testing", () => {

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

  describe("testing masterCurrency.save", () => {
    // Testing save
    // 1. Valid masterCurrency should be saved.
    // 2. Non masterCurrency object should not be saved.
    // 3. Should not save same masterCurrency twice.
    beforeEach((done) => {
      masterCurrency.deleteAll(tenantOne)
        .then((data) => {
          return masterCurrency.deleteAll(tenantTwo);
        })
        .then((data) => {
          done();
        });
    });

    it("should fail saving invalid object to database", (done) => {
      // try to save an invalid object
      const invalidObject1 = masterCurrencyData.invalidObject1;
      let res = masterCurrency.save(tenantOne, invalidObject1);
      expect(res)
        .to.be.eventually.rejectedWith("masterCurrency validation failed")
        .notify(done);
    });

    it("should fail saving duplicate object to database", (done) => {
      // save a valid object, then try to save another
      const validObject1 = masterCurrencyData.validObject1;
      masterCurrency.save(tenantOne, validObject1)
        .then((success) => {
          let res = masterCurrency.save(tenantOne, validObject1);
          expect(res)
            .to.be.eventually.rejectedWith("duplicate")
            .notify(done);
        });
    });

    it("should save valid masterCurrency to database", (done) => {
      const validObject1 = masterCurrencyData.validObject1;
      let res = masterCurrency.save(tenantOne, validObject1);
      expect(res)
        .to.eventually.have.property("_id")
        .notify(done);
    });

    it("should save multple valid masterCurrency(s) to database", (done) => {
      const validObject1 = masterCurrencyData.validObject1;
      const validObject2 = masterCurrencyData.validObject2;

      masterCurrency.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return masterCurrency.save(tenantOne, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

    it("should save valid masterCurrency(s) for multiple tenants to database", (done) => {
      const validObject1 = masterCurrencyData.validObject1;
      const validObject2 = masterCurrencyData.validObject2;

      masterCurrency.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return masterCurrency.save(tenantTwo, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

  }); // testing save

  describe("testing masterCurrency.find", () => {
    // Testing save
    // 1. Valid masterCurrency should be saved.
    // 2. Non masterCurrency object should not be saved.
    // 3. Should not save same masterCurrency twice.
    beforeEach((done) => {
      masterCurrency.deleteAll(tenantOne)
        .then((value) => {
          return masterCurrency.deleteAll(tenantTwo);
        })
        .then((value) => {
          return masterCurrency.save(tenantOne, masterCurrencyData.validObject1);
        })
        .then((value) => {
          return masterCurrency.save(tenantOne, masterCurrencyData.validObject2);
        })
        .then((value) => {
          return masterCurrency.save(tenantOne, masterCurrencyData.validObject3);
        })
        .then((value) => {
          return masterCurrency.save(tenantOne, masterCurrencyData.validObject4);
        })
        .then((value) => {
          return masterCurrency.save(tenantOne, masterCurrencyData.validObject5);
        })
        .then((value) => {
          return masterCurrency.save(tenantOne, masterCurrencyData.validObject6);
        })
        .then((value) => {
          return masterCurrency.save(tenantOne, masterCurrencyData.validObject7);
        })
        .then((value) => {
          return masterCurrency.save(tenantOne, masterCurrencyData.validObject8);
        })
        .then((value) => {
          return masterCurrency.save(tenantTwo, masterCurrencyData.validObject1);
        })
        .then((value) => {
          return masterCurrency.save(tenantTwo, masterCurrencyData.validObject2);
        })
        .then((value) => {
          return masterCurrency.save(tenantTwo, masterCurrencyData.validObject3);
        })
        .then((value) => {
          return masterCurrency.save(tenantTwo, masterCurrencyData.validObject4);
        })
        .then((value) => {
          return masterCurrency.save(tenantTwo, masterCurrencyData.validObject5);
        })
        .then((value) => {
          return masterCurrency.save(tenantTwo, masterCurrencyData.validObject6);
        })
        .then((value) => {
          return masterCurrency.save(tenantTwo, masterCurrencyData.validObject7);
        })
        .then((value) => {
          return masterCurrency.save(tenantTwo, masterCurrencyData.validObject8);
        })
        .then((value) => {
          done();
        });
    });

    it("should return all the values of a tenant", (done) => {
      let res = masterCurrency.find(tenantOne, {}, {}, 0, 0);

      expect(res)
        .to.eventually.have.lengthOf(8)
        .notify(done);
    });

    it("should return a single value of a tenant", (done) => {
      let res = masterCurrency.find(tenantOne, {}, {}, 0, 1);

      expect(res)
        .to.eventually.have.lengthOf(1)
        .notify(done);
    });

    it("should return a Platform object", (done) => {
      let res = masterCurrency.find(tenantOne, {
        "currencyCode": "CAD"
      }, {}, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result:" + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("currencyName")
            .to.equal("Canadian dollar");
          done();
        });
    });

    it("should return ASBA, the first masterCurrency when sorted by ZoneCode", (done) => {
      let res = masterCurrency.find(tenantOne, {}, {
        "currencyName": "1"
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("currencyName")
            .to.equal("Algerian dinar");
          done();
        });
    });

    it("should return Platform, the last masterCurrency when sorted by masterCurrencyCode", (done) => {
      let res = masterCurrency.find(tenantOne, {}, {
        "currencyName": -1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("currencyName")
            .to.equal("Kuwaiti dinar");
          done();
        });
    });

    it("should return 6 enabled masterCurrencys", (done) => {
      let res = masterCurrency.find(tenantOne, {
        "enableFlag": "1"
      }, {
        "currencyCode": -1
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
            .to.have.property("currencyName")
            .to.equal("Kuwaiti dinar");
          expect(app[5])
            .to.have.property("currencyCode")
            .to.equal("DZD");
          done();
        });
    });

  }); // findAll testing

  describe("update testing", () => {
    beforeEach((done) => {
      masterCurrency.deleteAll(tenantOne)
        .then((value) => {
          return masterCurrency.deleteAll(tenantTwo);
        })
        .then((value) => {
          return masterCurrency.save(tenantOne, masterCurrencyData.validObject1);
        })
        .then((value) => {
          return masterCurrency.save(tenantOne, masterCurrencyData.validObject2);
        })
        .then((value) => {
          return masterCurrency.save(tenantOne, masterCurrencyData.validObject3);
        })
        .then((value) => {
          return masterCurrency.save(tenantOne, masterCurrencyData.validObject4);
        })
        .then((value) => {
          done();
        });
    });

    it("should disable Platform masterCurrency", (done) => {
      let res = masterCurrency.update(tenantOne, "DZD", {
        "objVersion": 1289,
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

}); // db masterCurrency testing