const _ = require('lodash');
/*
 ** JSON Schema representation of the lookup model
 */
var lookupSchema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "lookupModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "maxLength": 64,
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
    },
    "wfInstanceId": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20,
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
    },
    "wfInstanceStatus": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20,
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
    },
    "lookupCode": {
      "type": "string",
      "minLength": 3,
      "maxLength": 50,
      "filterable": true, //custom attributes
      "sortable": true //custom attributes
    },
    "value": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
    },
    "valueOne": {
      "type": "string",
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
    },
    "valueTwo": {
      "type": "string",
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
    },
    "valueThree": {
      "type": "string",
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
    },
    "valueFour": {
      "type": "string",
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
    },
    "enableFlag": {
      "type": "string",
      "default": "1",
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
    },
    "createdBy": {
      "type": "string",
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
    },
    "updatedBy": {
      "type": "string",
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
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
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
    }
  },
  "required": ["tenantId", "lookupCode", "value", "createdBy", "createdDate"]
};

module.exports.schema = lookupSchema;

filterAttributes = _.keys(_.pickBy(lookupSchema.properties, (a) => {
  return (a.filterable);
}));

module.exports.filterAttributes = filterAttributes;

sortableAttributes = _.keys(_.pickBy(lookupSchema.properties, (a) => {
  return (a.sortable);
}));

module.exports.sortableAttributes = sortableAttributes;
module.exports.schema = lookupSchema;