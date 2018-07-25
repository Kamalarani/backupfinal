var PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");

process.env.MONGO_DB_URL = "mongodb://10.10.69.204:27017/TestPlatform_Dev";
/*
 ** Test /api/audit API's
 */
const debug = require("debug")("evolvus-platform-server.test.routes.api");
const app = require("../../server")
  .app;
const roleTestData = require("./roleTestData");
const randomstring = require("randomstring");

let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

var serverUrl = "http://localhost:" + PORT;

describe("Testing routes", () => {
  before((done) => {
    app.on('application_started', done());
  });

  describe("Testing save role api", () => {

    it("should save role and return same attribute values", (done) => {
      chai.request(serverUrl)
        .post("/api/role")
        .set("X-ENTITY-ID", "H001B001").set("X-TENANT-ID", "T001").set("X-ACCESS-LEVEL", "1").set("X-USER", "user")
        .send(roleTestData.validObject1)
        .end((err, res) => {
          if (err) {
            debug(`error in the test ${err}`);
            done(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property('description').eql(`New role ${roleTestData.validObject1.roleName.toUpperCase()} has been added successfully for the application ${roleTestData.validObject1.applicationCode} and sent for the supervisor authorization.`);
            res.body.data.should.have.property('roleName')
              .eql(roleTestData.validObject1.roleName.toUpperCase());
            done();
          }
        });
    });

    //   it("should not save entity and return status 400", (done) => {
    //     chai.request(serverUrl)
    //       .post("/api/entity")
    //       .set('X-ENTITY-ID', 'H001B001').set("X-TENANT-ID", "T001").set("X-ACCESS-LEVEL", "1").set("X-USER", "user")
    //       .send({
    //         "name": "Docket"
    //       })
    //       .end((err, res) => {
    //         if (err) {
    //           debug(`error in the test ${err}`);
    //           done(err);
    //         } else {
    //           res.should.have.status(400);
    //           done();
    //         }
    //       });
    //   });
    //
    //   it("should not save entity and return status 400 and return data as entityCode is required ", (done) => {
    //     chai.request(serverUrl)
    //       .post("/api/entity")
    //       .set('X-ENTITY-ID', 'H001B001').set("X-TENANT-ID", "T001").set("X-ACCESS-LEVEL", "1").set("X-USER", "user")
    //       .send(entityTestData.validObject2)
    //       .end((err, res) => {
    //         if (err) {
    //           debug(`error in the test ${err}`);
    //           done(err);
    //         } else {
    //           res.should.have.status(400);
    //           res.body.should.be.a("object");
    //           res.body.should.have.property('data').eql('entityCode is required');
    //           done();
    //         }
    //       });
    //   });
    //
    //   it("should not save entity and return status 400", (done) => {
    //     chai.request(serverUrl)
    //       .post("/api/entity")
    //       .set('X-ENTITY-ID', 'H001B001').set("X-TENANT-ID", "T001").set("X-ACCESS-LEVEL", "1").set("X-USER", "user")
    //       .send({
    //         "name": "Dockethhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
    //       })
    //       .end((err, res) => {
    //         if (err) {
    //           debug(`error in the test ${err}`);
    //           done(err);
    //         } else {
    //           res.should.have.status(400);
    //           done();
    //         }
    //       });
    //   });
    //
    // });

  });
});