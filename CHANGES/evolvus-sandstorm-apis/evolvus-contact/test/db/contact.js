const debug = require("debug")("evolvus-contact.test.db.contact");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const contact = require("../../db/contact");
const contactTestData = require("./contactTestData");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/contact.js
describe("db contact testing", () => {

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

  describe("testing contact.save", () => {
    //Testing save
    // 1. Valid contact should be saved.
    // 2. Non contact object should not be saved.
    // 3. Should not save same contact twice.
    beforeEach((done) => {
      contact.deleteAll(tenantOne)
        .then((data) => {
          return contact.deleteAll(tenantTwo);
        })
        .then((data) => {
          done();
        });
    });

    it("should fail saving invalid object to database", (done) => {
      // try to save an invalid object
      const invalidObject1 = contactTestData.invalidObject1;
      let res = contact.save(tenantOne, invalidObject1);
      expect(res)
        .to.be.eventually.rejectedWith("contact validation failed")
        .notify(done);
    });

    it("should fail saving duplicate object to database", (done) => {
      // save a valid object, then try to save another
      const validObject1 = contactTestData.validObject1;
      contact.save(tenantOne, validObject1)
        .then((success) => {
          let res = contact.save(tenantOne, validObject1);
          expect(res)
            .to.be.eventually.rejectedWith("duplicate")
            .notify(done);
        });
    });

    it("should save valid contact to database", (done) => {
      const validObject1 = contactTestData.validObject1;
      let res = contact.save(tenantOne, validObject1);
      expect(res)
        .to.eventually.have.property("_id")
        .notify(done);
    });

    it("should save multple valid contact(s) to database", (done) => {
      const validObject1 = contactTestData.validObject1;
      const validObject2 = contactTestData.validObject2;

      contact.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return contact.save(tenantOne, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

    it("should save valid contact(s) for multiple tenants to database", (done) => {
      const validObject1 = contactTestData.validObject1;
      const validObject2 = contactTestData.validObject2;

      contact.save(tenantOne, validObject1)
        .then((value) => {
          expect(value)
            .to.have.property("id");
          return contact.save(tenantTwo, validObject2);
        })
        .then((value) => {
          expect(value)
            .to.have.property("id");
          done();
        });
    });

  }); // testing save

  describe("testing contact.find", () => {
    // Testing save
    // 1. Valid contact should be saved.
    // 2. Non contact object should not be saved.
    // 3. Should not save same contact twice.
    beforeEach((done) => {
      contact.deleteAll(tenantOne)
        .then((value) => {
          return contact.deleteAll(tenantTwo);
        })
        .then((value) => {
          return contact.save(tenantOne, contactTestData.validObject1);
        })
        .then((value) => {
          return contact.save(tenantOne, contactTestData.validObject2);
        })
        .then((value) => {
          return contact.save(tenantOne, contactTestData.validObject3);
        })
        .then((value) => {
          return contact.save(tenantOne, contactTestData.validObject4);
        })
        .then((value) => {
          return contact.save(tenantOne, contactTestData.validObject5);
        })
        .then((value) => {
          return contact.save(tenantOne, contactTestData.validObject6);
        })
        .then((value) => {
          return contact.save(tenantOne, contactTestData.validObject7);
        })
        .then((value) => {
          return contact.save(tenantOne, contactTestData.validObject8);
        })
        .then((value) => {
          return contact.save(tenantTwo, contactTestData.validObject1);
        })
        .then((value) => {
          return contact.save(tenantTwo, contactTestData.validObject2);
        })
        .then((value) => {
          return contact.save(tenantTwo, contactTestData.validObject3);
        })
        .then((value) => {
          return contact.save(tenantTwo, contactTestData.validObject4);
        })
        .then((value) => {
          return contact.save(tenantTwo, contactTestData.validObject5);
        })
        .then((value) => {
          return contact.save(tenantTwo, contactTestData.validObject6);
        })
        .then((value) => {
          return contact.save(tenantTwo, contactTestData.validObject7);
        })
        .then((value) => {
          return contact.save(tenantTwo, contactTestData.validObject8);
        })
        .then((value) => {
          done();
        });
    });

    it("should return all the values of a tenant", (done) => {
      let res = contact.find(tenantOne, {}, {}, 0, 0);

      expect(res)
        .to.eventually.have.lengthOf(8)
        .notify(done);

    });

    it("should return a single value of a tenant", (done) => {
      let res = contact.find(tenantOne, {}, {}, 0, 1);

      expect(res)
        .to.eventually.have.lengthOf(1)
        .notify(done);
    });

    it("should return a Platform object", (done) => {
      let res = contact.find(tenantOne, {
        "emailId": "xyz@gmail.com"
      }, {}, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result:" + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("emailId")
            .to.equal("xyz@gmail.com");
          done();
        });
    });

    it("should return ASBA, the first contact when sorted by contactCode", (done) => {
      let res = contact.find(tenantOne, {}, {
        "emailId": 1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("emailId")
            .to.equal("ajay@gmail.com");
          done();
        });
    });

    it("should return Platform, the last contact when sorted by emailId", (done) => {
      let res = contact.find(tenantOne, {}, {
        "emailId": -1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((app) => {
          debug("result: " + JSON.stringify(app));
          expect(app[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(app[0])
            .to.have.property("emailId")
            .to.equal("zvimalraj@gmail.com");
          done();
        });
    });

    it("should return 6 enabled contacts", (done) => {
      let res = contact.find(tenantOne, {
        "emailVerified": true
      }, {
        "contactCode": -1
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
            .to.have.property("emailVerified")
            .to.equal(true);
          expect(app[5])
            .to.have.property("emailVerified")
            .to.equal(true);
          done();
        });
    });

  });

  // findAll testing

  describe("update testing", () => {
    beforeEach((done) => {
      contact.deleteAll(tenantOne)
        .then((value) => {
          return contact.deleteAll(tenantTwo);
        })
        .then((value) => {
          return contact.save(tenantOne, contactTestData.validObject1);
        })
        .then((value) => {
          return contact.save(tenantOne, contactTestData.validObject2);
        })
        .then((value) => {
          return contact.save(tenantOne, contactTestData.validObject3);
        })
        .then((value) => {
          return contact.save(tenantOne, contactTestData.validObject4);
        })
        .then((value) => {
          done();
        });
    });

    it("should disable Platform contact", (done) => {
      let res = contact.update(tenantOne, "xyz@gmail.com", {
        "emailVerified": false,
        "updatedDate": new Date()
          .toISOString(),
        "phoneNumber": "1111456893",
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
});
// db contact testing