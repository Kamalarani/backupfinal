const mongoose = require("mongoose");
const validator = require("validator");


var supportedDateFormatsSchema = new mongoose.Schema({
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
  formatCode: {
    type: String,
    minLength: 1,
    maxLength: 50,
    required: true
  },
  timeFormat: {
    type: String,
    minLength: 1,
    maxLength: 50
  },
  description: {
    type: String,
    minLength: 1,
    maxLength: 100
  },
  createdDate: {
    type: String,
    format: Date
  },
  lastUpdatedDate: {
    type: String,
    format: Date
  },
  createdBy: {
    type: String,
    minLength: 1,
    maxLength: 100
  },
  updatedBy: {
    type: String,
    minLength: 1,
    maxLength: 100
  },
  objVersion: {
    type: Number
  },
  enableFlag: {
    type: String,
    enum: ["0", "1"],
    default: "1"
  }
});

module.exports = supportedDateFormatsSchema;

supportedDateFormatsSchema.index({
  tenantId: 1,
  formatCode: 1
}, {
  unique: true
});

module.exports = supportedDateFormatsSchema;
