const debug = require("debug")("evolvus-swe-client.test.index");
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const shortid = require("shortid");


chai.use(chaiAsPromised);

let index = require("../index");

describe('testing index.js', () => {
  let sweEventObject = {
    "tenantId": "T001",
    "wfEntity": "ENTITY",
    "wfEntityAction": "CREATE",
    "query": "5b4f2ab570b1da7bbf936b52",
    "createdBy": "KamalaraniP"
  };
  let invalidsweEvent = {

    flowCode: "flow",
    createdBy: "KamalaraniP"
  };

  describe("testing with sweEvent objects for initialize", () => {
    beforeEach((done) => {
      process.env.SWE_URL = "http://localhost:3000/api/swe/initialize";
      done();
    });

    it('should save valid object to database', (done) => {
      var res = index.initialize(sweEventObject);
      expect(res)
        .to.be.eventually.have.property('data')
        .to.include(sweEventObject)
        .notify(done);
    });

    it('should respond with status code 400 if sweObject is invalid', (done) => {
      var res = index.initialize(invalidsweEvent);
      expect(res)
        .to.be.fulfilled.then((resp) => {
          expect(resp.response.status)
            .to.be.eql(400);
          done();
        });
    });

    it('should be resolved with IllegalArgument when input object is null', (done) => {
      var res = index.initialize(null);
      expect(res)
        .to.be.eventually.include("IllegalArgument")
        .notify(done);
    });


    it('should be resolved with IllegalArgument when input object is undefined', (done) => {
      let input;
      var res = index.initialize(input);
      expect(res)
        .to.be.eventually.include("IllegalArgument")
        .notify(done);
    });
  });

  describe("testing with sweEvent objects for complete", () => {
    beforeEach((done) => {
      process.env.SWE_URL = "http://localhost:3000/api/swe/complete";
      done();
    });

    let wfInstanceId = shortid.generate();
    let sweObject = {
      "tenantId": "T001",
      "wfInstanceId": wfInstanceId,
      "wfEntity": "ENTITY",
      "wfEntityAction": "CREATE",
      "query": wfInstanceId,
      "createdBy": "KamalaraniP",
      "wfEvent": "complete",
      "comments": "complete"
    };


    it('should save valid object to database', (done) => {
      var res = index.Complete(sweObject);
      expect(res)
        .to.be.eventually.have.property('data')
        .to.include(sweObject)
        .notify(done);
    });

    it('should respond with status code 400 if sweObject is invalid', (done) => {
      var res = index.Complete(invalidsweEvent);
      expect(res)
        .to.be.fulfilled.then((resp) => {
          expect(resp.response.status)
            .to.be.eql(400);
          done();
        });
    });

    it('should be resolved with IllegalArgument when input object is null', (done) => {
      var res = index.Complete(null);
      expect(res)
        .to.be.eventually.include("IllegalArgument")
        .notify(done);
    });


    it('should be resolved with IllegalArgument when input object is undefined', (done) => {
      let input;
      var res = index.Complete(input);
      expect(res)
        .to.be.eventually.include("IllegalArgument")
        .notify(done);
    });
  });

  describe("testing when the server is down", () => {
    beforeEach((done) => {
      process.env.SWE_URL = "http://localhost:4000/api/swe";
      done();
    });

    it('should respond with connection refused if workflow engine is down', (done) => {
      var res = index.initialize(sweObject);
      expect(res)
        .to.be.fulfilled.then((resp) => {
          expect(resp.code)
            .to.be.include("ECONNREFUSED");
          done();
        });
    });
  });
});