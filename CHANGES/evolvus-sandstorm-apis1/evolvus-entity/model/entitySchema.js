const _ = require('lodash');
/*
 ** JSON Schema representation of the contact model
 */
var entitySchema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "entityModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "maxLength": 64,
      "filterable": true, //custom attributes
      "sortable": false //custom attribute
    },
    "wfInstanceId": {
      "type": "string",
      "minLength": 0,
      "maxLength": 20
    },
    "wfInstanceStatus": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20
    },
    "entityCode": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20,
      "filterable": true, //custom attributes
      "sortable": true, //custom attributes
      "pattern": "^[a-zA-Z-0-9-_ ]+$",
      "message": "EntityCode can contain only alphanumeric and two specialcharacters hyphen and underscore"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "pattern": "^[a-zA-Z\-0-9]+$",
      "message": "name can contain only alphabets and numbers",
      "filterable": true, //custom attributes
      "sortable": true //custom attributes
    },
    "enableFlag": {
      "type": "string",
      "enum": ["0", "1"],
      "filterable": true, //custom attributes
      "sortable": true //custom attributes
    },
    "createdBy": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": true //custom attributes
    },
    "updatedBy": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": true //custom attributes
    },
    "createdDate": {
      "type": "string",
      "format": "date-time",
      "filterable": true, //custom attributes
      "sortable": true //custom attributes
    },
    "lastUpdatedDate": {
      "type": ["string", "null"],
      "format": "date-time",
      "filterable": false, //custom attributes
      "sortable": true //custom attributes
    },
    "selectedFlag": {
      "type": "string",
      "enum": ["0", "1"],
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "processingStatus": {
      "type": "string",
      "enum": ['PENDING_AUTHORIZATION', 'AUTHORIZED', 'REJECTED'],
      "default": 'PENDING_AUTHORIZATION',
      "displayable": true,
      "filterable": true, //custom attributes
      "sortable": true //custom attributes
    },
    "accessLevel": {
      "type": "string",
      "filterable": true, //custom attributes
      "sortable": true //custom attributes
    },
    "parent": {
      "type": "string",
      "pattern": "^[a-zA-Z\-0-9 ]+$",
      "message": "parent can contain only alphabets and numbers",
      "filterable": true, //custom attributes
      "sortable": false //custom attributes
    },
    "entityId": {
      "type": "string",
      "minLength": 5,
      "maxLength": 100,
      "filterable": true, //custom attributes
      "sortable": false //custom attributes
    },
    "description": {
      "type": "string",
      "minLength": 0,
      "maxLength": 255,
      "filterable": false, //custom attributes
      "sortable": false, //custom attributes
      "displayable": true
    },
    "contact": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "maxLength": 64,
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "firstName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50,
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "middleName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50,
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "lastName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50,
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "emailId": {
          "type": "string",
          "minLength": 8,
          "maxLength": 50,
          "unique": false,
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "emailVerified": {
          "type": "boolean"
        },
        "phoneNumber": {
          "type": "string",
          "minLength": 9,
          "maxLength": 15,
          "unique": false,
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "mobileNumber": {
          "type": "string",
          "minLength": 9,
          "maxLength": 15,
          "unique": false,
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "mobileVerified": {
          "type": "boolean"
        },
        "faxNumber": {
          "type": "string",
          "minLength": 9,
          "maxLength": 15,
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "companyName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 64,
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "address1": {
          "type": "string"
        },
        "address2": {
          "type": "string"
        },
        "city": {
          "type": "string",
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "state": {
          "type": "string",
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "country": {
          "type": "string",
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "zipCode": {
          "type": "string",
          "filterable": false, //custom attributes
          "sortable": false //custom attribute
        },
        "createdDate": {
          "type": "string",
          "format": "date-time",
          "filterable": false, //custom attributes
          "sortable": false //custom attributes
        },
        "lastUpdatedDate": {
          "type": ["string", "null"],
          "format": "date-time",
          "filterable": false, //custom attributes
          "sortable": false //custom attributes
        }
      },
      "required": ["tenantId", "firstName", "lastName", "emailId", "mobileNumber", "phoneNumber", "faxNumber", "city", "state", "country", "createdDate", "lastUpdatedDate"]
    }
  },
  "required": ["tenantId", "entityCode", "name", "parent", "description", "createdBy", "createdDate", "lastUpdatedDate"]
};

module.exports.schema = entitySchema;

filterAttributes = _.keys(_.pickBy(entitySchema.properties, (a) => {
  return (a.filterable);
}));



module.exports.filterAttributes = filterAttributes;

sortableAttributes = _.keys(_.pickBy(entitySchema.properties, (a) => {
  return (a.sortable);
}));

module.exports.sortableAttributes = sortableAttributes;