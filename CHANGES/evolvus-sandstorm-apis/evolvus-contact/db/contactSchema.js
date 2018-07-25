const mongoose = require("mongoose");
const validator = require("validator");

var contactSchema = new mongoose.Schema({
  // Add all attributes below tenantId
  tenantId: {
    type: String,
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
  firstName: {
    type: String,
    minLength: 1,
    maxLength: 50
  },
  middleName: {
    type: String,
    minLength: 1,
    maxLength: 50
  },
  lastName: {
    type: String,
    minLength: 1,
    maxLength: 50
  },
  emailId: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 50,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
      isAsync: false
    }
  },
  emailVerified: {
    type: Boolean
  },
  phoneNumber: {
    type: String,
    maxLength: 15,
    validate: {
      validator: function(v) {
        return /^[0-9\-\+]+$/.test(v);
      },
      message: "{PATH} can contain only Numbers"
    }
  },
  mobileNumber: {
    type: String,
    maxLength: 15,
    validate: {
      validator: function(v) {
        return /^[0-9\-\+]+$/.test(v);
      },
      message: "{PATH} can contain only Numbers"
    }
  },
  mobileVerified: {
    type: Boolean
  },
  faxNumber: {
    type: String,
    maxLength: 10,
    validate: {
      validator: function(v) {
        return /^[0-9\-\+]+$/.test(v);
      },
      message: "{PATH} can contain only Numbers"
    }
  },
  companyName: {
    type: String,
    minLength: 1,
    maxLength: 64
  },
  address1: {
    type: String
  },
  address2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zipCode: {
    type: String
  },
  createdDate: {
    type: Date
  },
  lastUpdatedDate: {
    type: Date
  }
});



module.exports = contactSchema;
contactSchema.index({
  tenantId: 1,
  emailId: 1
}, {
  unique: true
});
module.exports = contactSchema;