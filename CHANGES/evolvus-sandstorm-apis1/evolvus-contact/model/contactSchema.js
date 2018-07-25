const _ = require('lodash');
/*
 ** JSON Schema representation of the contact model
 */
var contactSchema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "contactModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "maxLength": 64,
      "filterable": false, //custom attributes
      "sortable": false //custom attribute
    },
    "wfInstanceId": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20
    },
    "wfInstanceStatus": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20
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
      "minLength": 1,
      "maxLength": 10,
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
  "required": ["emailId", "city", "state", "country"]
};

module.exports.schema = contactSchema;

filterAttributes = _.keys(_.pickBy(contactSchema.properties, (a) => {
  return (a.filterable);
}));

module.exports.filterAttributes = filterAttributes;

sortableAttributes = _.keys(_.pickBy(contactSchema.properties, (a) => {
  return (a.sortable);
}));

module.exports.sortableAttributes = sortableAttributes;
