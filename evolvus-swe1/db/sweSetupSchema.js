const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  // Add all attributes below tenantId
  tenantId: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 64
  },
  wfEntity: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  wfEntityAction: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  callbackURL: {
    type: String,
    minLength: 0,
    maxLength: 50
  },
  callbackMethod: {
    type: String,
    minLength: 0,
    maxLength: 20
  },
  enabled: {
    type: String,
    minlength: 4,
    maxlength: 10,
    default: "true"
  },
  description: {
    type: String,
    minlength: 0,
    maxlength: 255
  },
  flowCode: { // AA, MC
    type: String,
    minlength: 1,
    maxlength: 10
  },
  flowExpr: {
    type: String
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
  wfEntityAction: 3
}, {
  unique: true
});

module.exports = schema;