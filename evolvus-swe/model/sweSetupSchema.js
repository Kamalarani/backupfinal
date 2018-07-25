/*
 ** JSON Schema representation of the application model
 */
const schema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "sweSetupModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "minlength": 3,
      "maxLength": 64,
      "filterable": false, //custom attributes
      "sortable": false //custom attribute
    },
    "wfEntity": {
      "type": "string",
      "minlength": 3,
      "maxlength": 20
    },
    "wfEntityAction": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20
    },
    "enabled": {
      "type": "string",
      "minLength": 4,
      "maxLength": 10,
      "default": "true"
    },
    "description": {
      "type": "string",
      "minLength": 0,
      "maxLength": 255
    },
    "flowCode": {
      "type": "string",
      "minLength": 1,
      "maxLength": 10
    },
    "flowExpr": {
      "type": "string"
    },
    "createdBy": {
      "type": "string"
    },
    "updatedBy": {
      "type": "string"
    },
    "createdDate": {
      "type": Date
    },
    "updatedDate": {
      "type": Date
    },
    "required": ["tenantId", "wfEntity", "wfEntityAction", "flowCode", "createdBy", "createdDate"]
  }
};

module.exports = schema;
