const _ = require('lodash');
/*
 ** JSON Schema representation of the masterTimeZone model
 */
var masterTimeZoneSchema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "masterTimeZoneModel",
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
    "zoneCode": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20,
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "zoneName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "offsetValue": {
      "type": "string"
    },
    "createdBy": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "updatedBy": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "createdDate": {
      "type": "string",
      "format": "date-time",
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "updatedDate": {
      "type": ["string", "null"],
      "format": "date-time",
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "offSet": {
      "type": "string"
    },
    "objVersion": {
      "type": "number"
    },
    "enableFlag": {
      "type": "string",
      "default": "1",
      "enum": ["0", "1"]
    }
  },
  "required": ["tenantId", "zoneCode", "zoneName"]
};

module.exports.schema = masterTimeZoneSchema;

filterAttributes = _.keys(_.pickBy(masterTimeZoneSchema.properties, (a) => {
  return (a.filterable);
}));

module.exports.filterAttributes = filterAttributes;

sortableAttributes = _.keys(_.pickBy(masterTimeZoneSchema.properties, (a) => {
  return (a.sortable);
}));

module.exports.sortableAttributes = sortableAttributes;