const mongoose = require("mongoose");
const validator = require("validator");

var lookupSchema = new mongoose.Schema({
  // Add all attributes below tenantId
  tenantId: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 64
  },
  wfInstanceId: {
    type: String,
    minlength: 3,
    maxlength: 20
  },
  wfInstanceStatus: {
    type: String,
    minlength: 3,
    maxlength: 20
  },
  lookupCode: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  value: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100
  },
  valueOne: {
    type: String,
    required: false
  },
  valueTwo: {
    type: String,
    required: false
  },
  valueThree: {
    type: String,
    required: false
  },
  valueFour: {
    type: String,
    required: false
  },
  enableFlag: {
    type: String,
    default: '1'
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String
  },
  createdDate: {
    type: Date,
    required: true
  },
  lastUpdatedDate: {
    type: Date
  }
});

module.exports = lookupSchema;