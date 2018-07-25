const mongoose = require("mongoose");
const validator = require("validator");

var applicationSchema = new mongoose.Schema({
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
  applicationCode: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  applicationName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
    validate: {
      validator: function(v) {
        return /^[A-Za-z ]*$/.test(v);
      },
      message: "{PATH} can contain only alphabets and spaces"
    }
  },
  enableFlag: {
    type: String,
    default: "1",
    enum: ["0", "1"]
  },
  description: {
    type: String,
    minlength: 0,
    maxlength: 255
  },
  accessLevel: {
    type: String
  },
  entityId: {
    type: String,
    minLength: 5,
    maxLength: 100
  },
  logo: {
    type: String
  },
  favicon: {
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
  lastUpdatedDate: {
    type: Date
  }
});

module.exports = applicationSchema;

applicationSchema.index({
  tenantId: 1,
  applicationName: 1,
  applicationCode: 1
}, {
  unique: true
});

module.exports = applicationSchema;
