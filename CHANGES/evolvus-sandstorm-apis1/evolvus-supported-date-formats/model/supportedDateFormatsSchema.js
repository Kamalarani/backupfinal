const _ = require('lodash');
/*
 ** JSON Schema representation of the supportedDateFormats model
 */
var supportedDateFormatsSchema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "supportedDateFormatsModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "minLength": 1,
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
    "formatCode": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50,
      "filterable": false, //custom attributes
      "sortable": false //custom attribute

    },
    "timeFormat": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50,
      "filterable": false, //custom attributes
      "sortable": false //custom attribute

    },
    "description": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "filterable": false, //custom attributes
      "sortable": false
    },
    "createdDate": {
      "type": "string",
      "format": "date-time",
      "filterable": false, //custom attributes
      "sortable": false
    },
    "lastUpdatedDate": {
      "type": "string",
      "format": "date-time",
      "filterable": false, //custom attributes
      "sortable": false
    },
    "createdBy": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "filterable": false, //custom attributes
      "sortable": false
    },
    "updatedBy": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "filterable": false, //custom attributes
      "sortable": false
    },
    "objVersion": {
      "type": "number",
      "filterable": false, //custom attributes
      "sortable": false
    },
    "enableFlag": {
      "type": "string",
      "default": "1",
      "enum": ["0", "1"],
      "filterable": false, //custom attributes
      "sortable": false
    }
  },
  "required": ["tenantId", "formatCode"]
};

module.exports.schema = supportedDateFormatsSchema;

filterAttributes = _.keys(_.pickBy(supportedDateFormatsSchema.properties, (a) => {
  return (a.filterable);
}));

module.exports.filterAttributes = filterAttributes;

sortableAttributes = _.keys(_.pickBy(supportedDateFormatsSchema.properties, (a) => {
  return (a.sortable);
}));

module.exports.sortableAttributes = sortableAttributes;