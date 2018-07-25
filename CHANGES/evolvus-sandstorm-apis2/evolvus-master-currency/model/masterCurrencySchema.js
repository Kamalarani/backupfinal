const _ = require('lodash');


var masterCurrencySchema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "masterCurrencyModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "minLength": 1,
      "maxLength": 64,
      "filterable": true, //custom attributes
      "sortable": true //custom attribute
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
    "currencyCode": {
      "type": "string",
      "minLength": 1,
      "maxLength": 5,
      "unique": true,
      "filterable": false, //custom attributes
      "sortable": false //custom attribute
    },
    "currencyName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50,
      "filterable": false, //custom attributes
      "sortable": false //custom attribute

    },
    "decimalDigit": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": false //custom attribute
    },
    "delimiter": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": false //custom attribute
    },
    "createdDate": {
      "type": "string",
      "format": "date-time",
      "filterable": false, //custom attributes
      "sortable": false //custom attribute
    },
    "lastUpdatedDate": {
      "type": "string",
      "format": "date-time",
      "filterable": false, //custom attributes
      "sortable": false //custom attribute
    },
    "createdBy": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "filterable": false, //custom attributes
      "sortable": false //custom attribute
    },
    "updatedBy": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "filterable": false, //custom attributes
      "sortable": false //custom attribute
    },
    "objVersion": {
      "type": "number",
      "filterable": false, //custom attributes
      "sortable": false //custom attribute
    },
    "enableFlag": {
      "type": "string",
      "default": "1",
      "enum": ["0", "1"],
      "filterable": false, //custom attributes
      "sortable": false //custom attribute
    },
    "currencyLocale": {
      "type": "string",
      "filterable": false, //custom attributes
      "sortable": false //custom attribute

    }
  },
  "required": ["tenantId", "currencyCode", "currencyName"]
};

module.exports.schema = masterCurrencySchema;

filterAttributes = _.keys(_.pickBy(masterCurrencySchema.properties, (a) => {
  return (a.filterable);
}));

module.exports.filterAttributes = filterAttributes;

sortableAttributes = _.keys(_.pickBy(masterCurrencySchema.properties, (a) => {
  return (a.sortable);
}));

module.exports.sortableAttributes = sortableAttributes;