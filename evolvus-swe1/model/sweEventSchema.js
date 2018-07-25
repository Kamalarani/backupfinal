/*
 ** JSON Schema representation of the application model
 */
const schema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "sweEventModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "minlength": 3,
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
    "query": {
      "type": "string",
      "minLength": 1,
      "maxLength": 255
    },
    "eventDate": {
      "type": Date
    },
    "eventStatus": {
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
    "required": ["tenantId", "wfInstanceId", "wfEntity", "wfEntityAction", "query", "eventStatus", "createdBy", "createdDate", "wfInstanceStatus"]
  }
};

module.exports = schema;