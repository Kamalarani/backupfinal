const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  // Add all attributes below tenantId
  tenantId: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 64
  },
  wfInstanceId: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  wfInstanceStatus: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  wfEntity: {
    type: String,
    minlength: 3,
    maxlength: 10,
    default: "true"
  },
  wfEntityAction: {
    type: String,
    minlength: 1,
    maxlength: 255
  },
  query: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255
  },
  wfEventDate: {
    type: Date,
    default: Date.now()
  },
  wfEvent: {
    type: String
  },
  comments: {
    type: String,
    minLength: 1,
    maxLength: 255
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
  updatedDate: {
    type: Date
  }
});

schema.index({
  tenantId: 1,
  wfEntity: 2,
  wfEntityAction: 3,
  wfInstanceId: 4
}, {
  unique: true
});

module.exports = schema;