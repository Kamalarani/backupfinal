const mongoose = require("mongoose");
const validator = require("validator");
const menu = require("@evolvus/evolvus-menu");

// const Menu = mongoose.model("menu", menu.db);
var roleSchema = new mongoose.Schema({
  // Add all attributes below tenantId
  tenantId: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 64
  },
  roleType: {
    type: String,
    minLength: 5,
    maxLength: 30
  },
  txnType: {
    type: Array,
    items: {
      type: String
    }
  },
  wfInstanceId: {
    type: String,
    minlength: 0,
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
    minLength: 3,
    maxLength: 20
  },
  roleName: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 35,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z-0-9-_ ]+$/.test(v);
      },
      message: "{PATH} can contain only alphabets and numbers"
    }
  },
  menuGroup: [menu.dbSchema],

  description: {
    type: String,
    minLength: 0,
    maxLength: 140
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
  selectedFlag: {
    type: String,
    enum: ["0", "1"]
  },
  lastUpdatedDate: {
    type: Date,
    required: true
  },
  enableFlag: {
    type: String,
    enum: ["0", "1"]
  },
  activationStatus: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    required: true
  },
  processingStatus: {
    type: String,
    enum: ['PENDING_AUTHORIZATION', 'AUTHORIZED', 'REJECTED'],
    default: 'PENDING_AUTHORIZATION'
  },
  associatedUsers: {
    type: Number,
    required: true
  },
  accessLevel: {
    type: String

  },
  entityId: {
    type: String

  }
});


module.exports = roleSchema;