const debug = require("debug")("evolvus-user.test.index");
const chai = require("chai");
const mongoose = require("mongoose");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";
/*
 ** chaiAsPromised is needed to test promises
 ** it adds the "eventually" property
 **
 ** chai and others do not support async / await
 */
const chaiAsPromised = require("chai-as-promised");

const expect = chai.expect;
chai.use(chaiAsPromised);

const user = require("../index");
// const db = require("../db/user");
const userTestData = require("./userTestData");

describe('user model validation', () => {

  const tenantOne = "IVL";
  const tenantTwo = "KOT";
  const entityId = "H001B001";
  const accessLevel = "0";

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
    it("valid user should validate successfully", (done) => {
      try {
        var res = user.validate(userTestData.validObject1);
        expect(res)
          .to.eventually.equal(true)
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid user object should not throw exception: ${e}`);
      }
    });

    it("invalid user should return errors", (done) => {
      try {
        var res = user.validate(userTestData.invalidObject1);
        expect(res)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    if ("should error out for undefined objects", (done) => {
        try {
          var res = user.validate(undefinedObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

    if ("should error out for null objects", (done) => {
        try {
          var res = user.validate(nullObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });
  });

  describe("testing user.save method", () => {

    beforeEach((done) => {
      db.deleteAll(tenantOne)
        .then((data) => {
          return db.deleteAll(tenantTwo);
        })
        .then((data) => {
          done();
        });
    });

    it('should save a valid user object to database', (done) => {
      try {
        var result = user.save(tenantOne, "192.168.1.115", "Kavya", userTestData.validObject1);
        //replace anyAttribute with one of the valid attribute of a user Object
        expect(result)
          .to.eventually.have.property("_id")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `saving user object should not throw exception: ${e}`);
      }
    });

    it('should not save a invalid user object to database', (done) => {
      try {
        var result = user.save(tenantOne, "192.168.1.115", "Kavya", userTestData.invalidObject1);
        expect(result)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });

  describe('testing user.find', () => {

    beforeEach(function(done) {
      this.timeout(10000);
      db.deleteAll(tenantOne)
        .then((value) => {
          return db.deleteAll(tenantTwo);
        })
        .then((value) => {
          return db.save(tenantOne, userTestData.validObject1);
        })
        .then((value) => {

          return db.save(tenantOne, userTestData.validObject2);
        })
        .then((value) => {

          return db.save(tenantOne, userTestData.validObject3);
        })
        .then((value) => {

          return db.save(tenantOne, userTestData.validObject4);
        })
        .then((value) => {

          return db.save(tenantOne, userTestData.validObject5);
        })
        .then((value) => {

          return db.save(tenantOne, userTestData.validObject6);
        })
        .then((value) => {

          return db.save(tenantOne, userTestData.validObject7);
        })
        .then((value) => {

          return db.save(tenantOne, userTestData.validObject8);
        })
        .then((value) => {
          return db.save(tenantTwo, userTestData.validObject9);
        })
        .then((value) => {

          return db.save(tenantTwo, userTestData.validObject10);
        })
        .then((value) => {

          return db.save(tenantTwo, userTestData.validObject11);
        })
        .then((value) => {

          return db.save(tenantTwo, userTestData.validObject12);
        })
        .then((value) => {

          return db.save(tenantTwo, userTestData.validObject13);
        })
        .then((value) => {

          return db.save(tenantTwo, userTestData.validObject14);
        })
        .then((value) => {

          return db.save(tenantTwo, userTestData.validObject15);
        })
        .then((value) => {

          return db.save(tenantTwo, userTestData.validObject16);
        })
        .then((value) => {

          done();
        });
    });

    it("should return all the values of a tenant", (done) => {
      let res = user.find(tenantOne, entityId, accessLevel, "kavya", "192.168.1.115", {}, {}, 0, 0);

      expect(res)
        .to.eventually.have.lengthOf(8)
        .notify(done);
    });

    it("should return a single value of a tenant", (done) => {
      let res = user.find(tenantOne, entityId, accessLevel, "kavya", "192.168.1.115", {}, {}, 0, 1);

      expect(res)
        .to.eventually.have.lengthOf(1)
        .notify(done);
    });

    it("should return a user Object ", (done) => {
      let res = user.find(tenantOne, entityId, accessLevel, "kavya", "192.168.1.115", {
        "userName": "kavyak"
      }, {}, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((user) => {
          debug("result:" + JSON.stringify(user));
          expect(user[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(user[0])
            .to.have.property("userName")
            .to.equal("kavyak");
          done();
        });
    });

    it("should return kamala, the first user when sorted by userName", (done) => {
      let res = user.find(tenantOne, entityId, accessLevel, "kavya", "192.168.1.115", {}, {
        "userName": 1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((user) => {
          debug("result: " + JSON.stringify(user));
          expect(user[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(user[0])
            .to.have.property("userName")
            .to.equal("kamala");
          done();
        });
    });

    it("should return vignesh, the last user when sorted by userName", (done) => {
      let res = user.find(tenantOne, entityId, accessLevel, "kavya", "192.168.1.115", {}, {
        "userName": -1
      }, 0, 1);

      expect(res)
        .to.have.be.fulfilled.then((user) => {
          debug("result: " + JSON.stringify(user));
          expect(user[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(user[0])
            .to.have.property("userName")
            .to.equal("vignesh");
          done();
        });
    });

    it("should return 6 enabled users", (done) => {
      let res = user.find(tenantOne, entityId, accessLevel, "kavya", "192.168.1.115", {
        "enabledFlag": "1"
      }, {
        "userName": -1
      }, 0, 10);

      expect(res)
        .to.have.be.fulfilled.then((user) => {
          debug("result: " + JSON.stringify(user));
          expect(user)
            .to.have.lengthOf(6);
          expect(user[0])
            .to.have.property("tenantId")
            .to.equal(tenantOne);
          expect(user[0])
            .to.have.property("userName")
            .to.equal("sriharig");
          expect(user[5])
            .to.have.property("userName")
            .to.equal("kavyak");
          done();
        });
    });

    it('should throw IllegalArgumentException for null value of tenantId', (done) => {
      try {
        let res = user.find(null, entityId, accessLevel, "kavya", "192.168.1.115", {}, {}, 0, 1);
        expect(res)
          .to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

  });

  describe("update testing", () => {
    beforeEach((done) => {
      db.deleteAll(tenantOne)
        .then((value) => {
          return db.deleteAll(tenantTwo);
        })
        .then((value) => {
          return db.save(tenantOne, userTestData.validObject1);
        })
        .then((value) => {
          return db.save(tenantOne, userTestData.validObject2);
        })
        .then((value) => {
          return db.save(tenantOne, userTestData.validObject3);
        })
        .then((value) => {
          return db.save(tenantOne, userTestData.validObject4);
        })
        .then((value) => {
          done();
        });
    });

    it("should disable user kavya", (done) => {
      let res = user.update(tenantOne, "kavyak", {
        "enabledFlag": "0",
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

  //   describe('testing user.getAll when there is no data', () => {

  //     beforeEach((done) => {
  //       db.deleteAll().then((res) => {
  //         done();
  //       });
  //     });

  //     it('should return empty array when limit is -1', (done) => {
  //       try {
  //         let res = user.getAll(-1);
  //         expect(res)
  //           .to.be.fulfilled.then((docs) => {
  //             expect(docs)
  //               .to.be.a('array');
  //             expect(docs.length)
  //               .to.equal(0);
  //             expect(docs)
  //               .to.eql([]);
  //             done();
  //           });
  //       } catch (e) {
  //         expect.fail(e, null, `exception: ${e}`);
  //       }
  //     });

  //     it('should return empty array when limit is positive value ', (done) => {
  //       try {
  //         let res = user.getAll(2);
  //         expect(res)
  //           .to.be.fulfilled.then((docs) => {
  //             expect(docs)
  //               .to.be.a('array');
  //             expect(docs.length)
  //               .to.equal(0);
  //             expect(docs)
  //               .to.eql([]);
  //             done();
  //           });
  //       } catch (e) {
  //         expect.fail(e, null, `exception: ${e}`);
  //       }
  //     });
  //   });

  //   describe('testing getById', () => {
  //     // Insert one record , get its id
  //     // 1. Query by this id and it should return one user object
  //     // 2. Query by an arbitrary id and it should return {}
  //     // 3. Query with null id and it should throw IllegalArgumentException
  //     // 4. Query with undefined and it should throw IllegalArgumentException
  //     var id;
  //     beforeEach((done) => {
  //       db.deleteAll().then((res)=>{
  //         db.save(userObject).then((res) => {
  //           id = res._id;
  //           done();
  //         });
  //       });
  //     });

  //     it('should return one user matching parameter id', (done) => {
  //       try {
  //         var res = user.getById(id);
  //         expect(res).to.eventually.have.property('_id')
  //           .to.eql(id)
  //           .notify(done);
  //       } catch (e) {
  //         expect.fail(e, null, `exception: ${e}`);
  //       }
  //     });

  //     it('should return empty object i.e. {} as no user is identified by this Id ', (done) => {
  //       try {
  //         let badId = new mongoose.mongo.ObjectId();
  //         var res = user.getById(badId);
  //         expect(res).to.eventually.to.eql({})
  //           .notify(done);
  //       } catch (e) {
  //         expect.fail(e, null, `exception: ${e}`);
  //       }
  //     });

  //     it("should throw IllegalArgumentException for undefined Id parameter ", (done) => {
  //       try {
  //         let undefinedId;
  //         let res = user.getById(undefinedId);
  //         expect(res)
  //           .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //           .notify(done);
  //       } catch (e) {
  //         expect.fail(e, null, `exception: ${e}`);
  //       }
  //     });

  //     it("should throw IllegalArgumentException for null Id parameter ", (done) => {
  //       try {
  //         let res = user.getById(null);
  //         expect(res)
  //           .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //           .notify(done);
  //       } catch (e) {
  //         expect.fail(e, null, `exception: ${e}`);
  //       }
  //     });

  //     it("should be rejected for arbitrary object as Id parameter ", (done) => {
  //       // an id is a 12 byte string, -1 is an invalid id value
  //       let id = userObject;
  //       let res = user.getById(id);
  //       expect(res)
  //         .to.eventually.to.be.rejectedWith("must be a single String of 12 bytes")
  //         .notify(done);
  //     });

  //   });

  //   describe("testing user.getOne",()=> {
  //     let object1={
  //       //add one valid user object here
  //       tenantId: "IVL",
  //       userName: "pavithra",
  //       userPassword: "Pavithra@30",
  //       branch: {
  //         tenantId: "IVL",
  //         code: "IBB123",
  //         name: "Hosur",
  //         contact: {
  //           tenantId: "IVL",
  //           fristName: "pavithra",
  //           middleName: "T",
  //           lastname: "Thimmappa",
  //           email: "Pavithrakit1130@gmail.com",
  //           emailVerified: true,
  //           phoneNo: "7708387762",
  //           mobileNo: "9999888800",
  //           mobileVerified: false,
  //           faxNumber: "12345678fax",
  //           companyName: "Evolvus",
  //           Address1: "Banglore",
  //           Address2: "Banglore",
  //           city: "Banglore",
  //           state: "karnataka",
  //           country: "India",
  //           zipCode: "kct123"

  //         }
  //       },
  //       contact: {

  //         tenantId: "IVL",
  //         fristName: "pavithra",
  //         middleName: "T",
  //         lastname: "Thimmappa",
  //         email: "Pavithrakit1230@gmail.com",
  //         emailVerified: true,
  //         phoneNo: "7708387762",
  //         mobileNo: "9999888800",
  //         mobileVerified: false,
  //         faxNumber: "12345678fax",
  //         companyName: "Evolvus",
  //         Address1: "Banglore",
  //         Address2: "Banglore",
  //         city: "Banglore",
  //         state: "karnataka",
  //         country: "India",
  //         zipCode: "kct123"
  //       },
  //       createdBy: "pavithra",
  //       updatedBy: "pavithra",
  //       createdDate: new Date().toISOString(),
  //       lastUpdatedDate: new Date().toISOString(),
  //       enableFlag: 1,
  //       deletedFlag: 0,
  //       activationStatus: "active",
  //       processingStatus: "unauthorized"
  //     },object2={
  //       //add one more valid user object here
  //       tenantId: "IVL",
  //       userName: "pavithra1",
  //       userPassword: "Pavithra@30",
  //       branch: {
  //         tenantId: "IVL",
  //         code: "IBB123",
  //         name: "Hosur",
  //         contact: {
  //           tenantId: "IVL",
  //           fristName: "pavithra",
  //           middleName: "T",
  //           lastname: "Thimmappa",
  //           email: "Pavithrakit1330@gmail.com",
  //           emailVerified: true,
  //           phoneNo: "7708387762",
  //           mobileNo: "9999888800",
  //           mobileVerified: false,
  //           faxNumber: "12345678fax",
  //           companyName: "Evolvus",
  //           Address1: "Banglore",
  //           Address2: "Banglore",
  //           city: "Banglore",
  //           state: "karnataka",
  //           country: "India",
  //           zipCode: "kct123"

  //         }
  //       },
  //       contact: {

  //         tenantId: "IVL",
  //         fristName: "pavithra",
  //         middleName: "T",
  //         lastname: "Thimmappa",
  //         email: "Pavithrakit1430@gmail.com",
  //         emailVerified: true,
  //         phoneNo: "7708387762",
  //         mobileNo: "9999888800",
  //         mobileVerified: false,
  //         faxNumber: "12345678fax",
  //         companyName: "Evolvus",
  //         Address1: "Banglore",
  //         Address2: "Banglore",
  //         city: "Banglore",
  //         state: "karnataka",
  //         country: "India",
  //         zipCode: "kct123"
  //       },
  //       createdBy: "pavithra",
  //       updatedBy: "pavithra",
  //       createdDate: new Date().toISOString(),
  //       lastUpdatedDate: new Date().toISOString(),
  //       enableFlag: 1,
  //       deletedFlag: 0,
  //       activationStatus: "active",
  //       processingStatus: "unauthorized"
  //     };
  //     beforeEach((done) => {
  //       db.deleteAll().then((res) => {
  //         db.save(object1).then((res) => {
  //           db.save(object2).then((res) => {
  //               done();
  //           });
  //         });
  //       });
  //     });

  //     it("should return one user record identified by attribute",(done)=> {
  //       try {
  //         // take one attribute from object1 or object2 and its value
  //         let res = user.getOne("userName","pavithra");
  //         expect(res)
  //           .to.eventually.be.a("object")
  //           .to.have.property('userName')
  //           .to.eql('pavithra')
  //           .notify(done);
  //       } catch (e) {
  //         expect.fail(e, null, `exception: ${e}`);
  //       }
  //     });

  //     it('should return empty object i.e. {} as no user is identified by this attribute', (done) => {
  //       try {
  //         // replace validAttribute and add a bad value to it
  //         var res = user.getOne("userName","hjfhg");
  //         expect(res).to.eventually.to.eql({})
  //           .notify(done);
  //       } catch (e) {
  //         expect.fail(e, null, `exception: ${e}`);
  //       }
  //     });

  //     it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
  //       try {
  //         //replace validvalue with a valid value for an attribute
  //         let undefinedAttribute;
  //         let res = user.getOne(undefinedAttribute,"pavithra");
  //         expect(res)
  //           .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //           .notify(done);
  //       } catch (e) {
  //         expect.fail(e, null, `exception: ${e}`);
  //       }
  //     });

  //     it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
  //       try {
  //         // replace validAttribute with a valid attribute name
  //         let undefinedValue;
  //         let res = user.getOne("userName",undefinedValue);
  //         expect(res)
  //           .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //           .notify(done);
  //       } catch (e) {
  //         expect.fail(e, null, `exception: ${e}`);
  //       }
  //     });

  //     it("should throw IllegalArgumentException for null attribute parameter ", (done) => {
  //       try {
  //         //replace validValue with a valid value for an attribute
  //         let res = user.getOne(null,"pavithra");
  //         expect(res)
  //           .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //           .notify(done);
  //       } catch (e) {
  //         expect.fail(e, null, `exception: ${e}`);
  //       }
  //     });

  //     it("should throw IllegalArgumentException for null value parameter ", (done) => {
  //       try {
  //         //replace attributeValue with a valid attribute name
  //         let res = user.getOne("userName",null);
  //         expect(res)
  //           .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //           .notify(done);
  //       } catch (e) {
  //         expect.fail(e, null, `exception: ${e}`);
  //       }
  //     });
  //   });


  //   describe("testing user.getMany",()=> {
  //       let object1={
  //         //add one valid user object here
  //         tenantId: "IVL",
  //         userName: "pavithra1",
  //         userPassword: "Pavithra@30",
  //         branch: {
  //           tenantId: "IVL",
  //           code: "IBB123",
  //           name: "Hosur",
  //           contact: {
  //             tenantId: "IVL",
  //             fristName: "pavithra",
  //             middleName: "T",
  //             lastname: "Thimmappa",
  //             email: "Pavithrakit1530@gmail.com",
  //             emailVerified: true,
  //             phoneNo: "7708387762",
  //             mobileNo: "9999888800",
  //             mobileVerified: false,
  //             faxNumber: "12345678fax",
  //             companyName: "Evolvus",
  //             Address1: "Banglore",
  //             Address2: "Banglore",
  //             city: "Banglore",
  //             state: "karnataka",
  //             country: "India",
  //             zipCode: "kct123"

  //           }
  //         },
  //         contact: {

  //           tenantId: "IVL",
  //           fristName: "pavithra",
  //           middleName: "T",
  //           lastname: "Thimmappa",
  //           email: "Pavithrakit1630gmail.com",
  //           emailVerified: true,
  //           phoneNo: "7708387762",
  //           mobileNo: "9999888800",
  //           mobileVerified: false,
  //           faxNumber: "12345678fax",
  //           companyName: "Evolvus",
  //           Address1: "Banglore",
  //           Address2: "Banglore",
  //           city: "Banglore",
  //           state: "karnataka",
  //           country: "India",
  //           zipCode: "kct123"
  //         },
  //         createdBy: "pavithra",
  //         updatedBy: "pavithra",
  //         createdDate: new Date().toISOString(),
  //         lastUpdatedDate: new Date().toISOString(),
  //         enableFlag: 1,
  //         deletedFlag: 0,
  //         activationStatus: "active",
  //         processingStatus: "unauthorized"
  //       },object2={
  //         //add one more valid user object here
  //         tenantId: "IVL",
  //         userName: "pavithra2",
  //         userPassword: "Pavithra@30",
  //         branch: {
  //           tenantId: "IVL",
  //           code: "IBB123",
  //           name: "Hosur",
  //           contact: {
  //             tenantId: "IVL",
  //             fristName: "pavithra",
  //             middleName: "T",
  //             lastname: "Thimmappa",
  //             email: "Pavithrakit1730gmail.com",
  //             emailVerified: true,
  //             phoneNo: "77083877",
  //             mobileNo: "9999888800",
  //             mobileVerified: false,
  //             faxNumber: "12345678fax",
  //             companyName: "Evolvus",
  //             Address1: "Banglore",
  //             Address2: "Banglore",
  //             city: "Banglore",
  //             state: "karnataka",
  //             country: "India",
  //             zipCode: "kct123"
  //           }
  //         },
  //         contact: {

  //           tenantId: "IVL",
  //           fristName: "pavithra",
  //           middleName: "T",
  //           lastname: "Thimmappa",
  //           email: "Pavithrakit1830@gmail.com",
  //           emailVerified: true,
  //           phoneNo: "7708387762",
  //           mobileNo: "9999888800",
  //           mobileVerified: false,
  //           faxNumber: "12345678fax",
  //           companyName: "Evolvus",
  //           Address1: "Banglore",
  //           Address2: "Banglore",
  //           city: "Banglore",
  //           state: "karnataka",
  //           country: "India",
  //           zipCode: "kct123"
  //         },
  //         createdBy: "pavithra",
  //         updatedBy: "pavithra",
  //         createdDate: new Date().toISOString(),
  //         lastUpdatedDate: new Date().toISOString(),
  //         enableFlag: 1,
  //         deletedFlag: 0,
  //         activationStatus: "active",
  //         processingStatus: "unauthorized"
  //       };
  //       beforeEach((done) => {
  //         db.deleteAll().then((res) => {
  //           db.save(object1).then((res) => {
  //             db.save(object2).then((res) => {
  //                 done();
  //             });
  //           });
  //         });
  //       });

  //       it("should return array of user records identified by attribute",(done)=> {
  //         try {
  //           // take one attribute from object1 or object2 and its value
  //           let res = user.getMany("userName","pavithra1");
  //           expect(res).to.eventually.be.a("array")
  //           //enter proper length according to input value
  //           .to.have.length(1)
  //           .notify(done);
  //         } catch (e) {
  //           expect.fail(e, null, `exception: ${e}`);
  //         }
  //       });

  //       it('should return empty array i.e. [] as no user is identified by this attribute', (done) => {
  //         try {
  //           // replace validAttribute and add a bad value to it
  //           var res = user.getMany("userName","uydfgvb");
  //           expect(res).to.eventually.to.eql([])
  //             .notify(done);
  //         } catch (e) {
  //           expect.fail(e, null, `exception: ${e}`);
  //         }
  //       });

  //       it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
  //         try {
  //           //replace validvalue with a valid value for an attribute
  //           let undefinedAttribute;
  //           let res = user.getMany(undefinedAttribute,"pavithta");
  //           expect(res)
  //             .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //             .notify(done);
  //         } catch (e) {
  //           expect.fail(e, null, `exception: ${e}`);
  //         }
  //       });

  //       it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
  //         try {
  //           // replace validAttribute with a valid attribute name
  //           let undefinedValue;
  //           let res = user.getMany("userName",undefinedValue);
  //           expect(res)
  //             .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //             .notify(done);
  //         } catch (e) {
  //           expect.fail(e, null, `exception: ${e}`);
  //         }
  //       });

  //       it("should throw IllegalArgumentException for null attribute parameter ", (done) => {
  //         try {
  //           //replace validValue with a valid value for an attribute
  //           let res = user.getMany(null,"pavithra");
  //           expect(res)
  //             .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //             .notify(done);
  //         } catch (e) {
  //           expect.fail(e, null, `exception: ${e}`);
  //         }
  //       });

  //       it("should throw IllegalArgumentException for null value parameter ", (done) => {
  //         try {
  //           //replace attributeValue with a valid attribute name
  //           let res = user.getMany("userName",null);
  //           expect(res)
  //             .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //             .notify(done);
  //         } catch (e) {
  //           expect.fail(e, null, `exception: ${e}`);
  //         }
  //       });
  //     });
  // describe("testing user.autheticate ", () => {
  //
  //
  //   beforeEach((done) => {
  //     db.deleteAll().then((res) => {
  //       user.save(object1).then((res) => {
  //         done();
  //       }).catch((e) => {
  //         done(e);
  //       });
  //     });
  //   });
  //
  //   it("should authenticate user", (done) => {
  //     let credentials = {
  //       userName: "kavyak",
  //       userPassword: "evolvus*123",
  //       enabledFlag: 1,
  //       processingStatus: "authorized",
  //       applicationCode: "DOCK"
  //     };
  //     var result = user.authenticate(credentials);
  //     expect(result).to.eventually.not.have.property('saltString').notify(done);
  //   });
  //
  //   it("should not authenticate user", (done) => {
  //     let credentials = {
  //       userName: "kavya",
  //       userPassword: "evolvus123",
  //       enabledFlag: 1,
  //       processingStatus: "authorized",
  //       applicationCode: "DOCK"
  //     };
  //     var result = user.authenticate(credentials);
  //     expect(result).to.be.rejectedWith("Invalid Credentials")
  //       .notify(done);
  //   });
  //
  //   it("should be rejected with Password Error", (done) => {
  //     let credentials = {
  //       userName: "kavyak",
  //       userPassword: "evolvu123",
  //       enabledFlag: 1,
  //       processingStatus: "authorized",
  //       applicationCode: "DOCK"
  //     };
  //     var result = user.authenticate(credentials);
  //     expect(result).to.be.rejectedWith("Password Error")
  //       .notify(done);
  //   });
  // });
});