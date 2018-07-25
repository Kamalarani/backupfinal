const _ = require("lodash");
var menuSchema = {

  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "menuModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "minLength": 1,
      "maxLength": 64,
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
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
    "applicationCode": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20,
      "filterable": true, //custom attributes
      "sortable": false //custom attributes
    },
    "menuGroupCode": {
      "type": "string",
      "minLength": 1,
      "maxLength": 20,
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 20,
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
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
    "lastUpdatedDate": {
      "type": "string",
      "format": "date-time",
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "enableFlag": {
      "type": "string",
      "enum": ["0", "1"],
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "deletedFlag": {
      "type": "number",
      "default": 0,
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "selectedFlag": {
      "type": "string",
      "enum": ["0", "1"],
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "menuGroupOrder": {
      "type": "number",
      "filterable": false, //custom attributes
      "sortable": false //custom attributes
    },
    "menuItems": {
      "type": "array",
      "minItems": 1,
      "items": {
        "properties": {
          "menuItemType": {
            "type": "string",
            "minLength": 1,
            "maxLength": 20,
            "filterable": false, //custom attributes
            "sortable": false //custom attributes
          },
          "applicationCode": {
            "type": "string",
            "minLength": 3,
            "maxLength": 20,
            "filterable": true, //custom attributes
            "sortable": false //custom attributes
          },
          "menuItemCode": {
            "type": "string",
            "minLength": 1,
            "maxLength": 20,
            "filterable": false, //custom attributes
            "sortable": false //custom attributes
          },
          "icon": {
            "type": "string",
            "minLength": 0,
            "maxLength": 30
          },
          "link": {
            "type": "string",
            "minLength": 0,
            "maxLength": 30
          },
          "title": {
            "type": "string",
            "minLength": 1,
            "maxLength": 20,
            "filterable": false, //custom attributes
            "sortable": false //custom attributes
          },
          "menuItemOrder": {
            "type": "number",
            "required": "true",
            "filterable": false, //custom attributes
            "sortable": false //custom attributes
          },
          "selectedFlag": {
            "type": "string",
            "enum": ["0", "1"],
            "filterable": false, //custom attributes
            "sortable": false //custom attributes
          },
          "SubMenuItems": {
            "type": "array",
            "items": {
              "properties": {
                "menuItemType": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 20,
                  "filterable": false, //custom attributes
                  "sortable": false //custom attributes
                },
                "applicationCode": {
                  "type": "string",
                  "minLength": 3,
                  "maxLength": 20,
                  "filterable": true, //custom attributes
                  "sortable": false //custom attributes
                },
                "menuItemCode": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 20,
                  "filterable": false, //custom attributes
                  "sortable": false //custom attributes
                },
                "icon": {
                  "type": "string",
                  "minLength": 0,
                  "maxLength": 30
                },
                "link": {
                  "type": "string",
                  "minLength": 0,
                  "maxLength": 30
                },
                "title": {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 20,
                  "filterable": false, //custom attributes
                  "sortable": false //custom attributes
                },
                "menuItemOrder": {
                  "type": "number",
                  "required": "true",
                  "filterable": false, //custom attributes
                  "sortable": false //custom attributes
                },
                "selectedFlag": {
                  "type": "string",
                  "enum": ["0", "1"],
                  "filterable": false, //custom attributes
                  "sortable": false //custom attributes
                }
              }
            }
          }
        },
        "required": ["menuItemType", "applicationCode", "menuItemCode", "title", "menuItemOrder"]
      }

    }
  },
  "required": ["tenantId", "applicationCode", "menuGroupCode", "menuGroupOrder", "title", "createdDate", "createdBy", "menuItems"]
};


module.exports.schema = menuSchema;

filterAttributes = _.keys(_.pickBy(menuSchema.properties, (a) => {
  return (a.filterable);
}));

module.exports.filterAttributes = filterAttributes;

sortableAttributes = _.keys(_.pickBy(menuSchema.properties, (a) => {
  return (a.sortable);
}));

module.exports.sortableAttributes = sortableAttributes;