const _ = require('lodash');
/*
 ** JSON Schema representation of the user model
 */
var userSchema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "userModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "minLength": 1,
      "maxLength": 64,
      "filterable": true,
      "sortable": false,
      "displayable": false
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
    "userId": {
      "type": "string",
      "minLength": 6,
      "maxLength": 35,
      "pattern": "^[A-Za-z0-9_-]*$",
      "filterable": true,
      "sortable": true,
      "displayable": true
    },
    "userName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 64,
      "pattern": "^[ a-zA-Z0-9!@#$&()\\-`.+,/\"]*$",
      "filterable": true,
      "sortable": true,
      "displayable": true
    },
    "userPassword": {
      "type": "string",
      "minLength": 1,
      "maxLength": 64,
      "filterable": false,
      "sortable": false,
      "displayable": false
    },
    "saltString": {
      "type": "string",
      "filterable": false,
      "sortable": false,
      "displayable": false
    },
    "token": {
      "type": "string",
      "filterable": false,
      "sortable": false,
      "displayable": false
    },
    "loginStatus": {
      "type": "string",
      "enum": [
        "LOGGED_IN",
        "LOGGED_OUT"
      ],
      "default": "LOGGED_OUT",
      "filterable": true,
      "sortable": false,
      "displayable": true
    },
    "supportedDateFormats": {
      "type": "string",
      "filterable": false,
      "sortable": false,
      "displayable": true
    },
    "masterCurrency": {
      "type": "string",
      "filterable": false,
      "sortable": false,
      "displayable": true
    },
    "masterTimeZone": {
      "type": "string",
      "filterable": false,
      "sortable": false,
      "displayable": true
    },
    "entityId": {
      "type": "string",
      "minLength": 5,
      "maxLength": 100,
      "filterable": true,
      "sortable": true,
      "displayable": true
    },
    "createdBy": {
      "type": "string",
      "filterable": false,
      "sortable": true,
      "displayable": true
    },
    "updatedBy": {
      "type": "string",
      "filterable": false,
      "sortable": true,
      "displayable": true
    },
    "createdDate": {
      "type": "string",
      "format": "date-time",
      "filterable": false,
      "sortable": true,
      "displayable": true
    },
    "lastUpdatedDate": {
      "type": "string",
      "format": "date-time",
      "filterable": false,
      "sortable": true,
      "displayable": true
    },
    "enabledFlag": {
      "type": "string",
      "default": "1",
      "filterable": true,
      "sortable": true,
      "displayable": true
    },
    "deletedFlag": {
      "type": "string",
      "default": "0",
      "filterable": true,
      "sortable": true,
      "displayable": true
    },
    "accessLevel": {
      "type": "string",
      "filterable": true,
      "sortable": true,
      "displayable": true
    },
    "activationStatus": {
      "type": "string",
      "enum": [
        "ACTIVE",
        "INACTIVE"
      ],
      "filterable": true,
      "sortable": false,
      "displayable": true
    },
    "processingStatus": {
      "type": "string",
      "enum": [
        "PENDING_AUTHORIZATION",
        "AUTHORIZED",
        "REJECTED"
      ],
      "default": "PENDING_AUTHORIZATION",
      "filterable": true,
      "sortable": true,
      "displayable": true
    },
    "dailyLimit": {
      "type": "number",
      "minLength": 16,
      "maxLength": 16,
      "filterable": false,
      "sortable": false,
      "displayable": false
    },
    "individualTransactionLimit": {
      "type": "number",
      "minLength": 16,
      "maxLength": 16,
      "filterable": false,
      "sortable": false,
      "displayable": false
    },
    "designation": {
      "type": "string",
      "minLength": 6,
      "maxLength": 35,
      "filterable": false,
      "sortable": false,
      "displayable": true
    },
    "role": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "maxLength": 64,
          "filterable": true, //custom attributes
          "sortable": false //custom attribute
        },
        "roleType": {
          "type": "string",
          "minLength": 5,
          "maxLength": 30,
          "filterable": true, //custom attributes
          "sortable": false //custom attribute
        },
        "txnType": {
          "type": "array",
          "items": {
            "type": "string"
          },
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
        "applicationCode": {
          "type": "string",
          "minLength": 3,
          "maxLength": 20,
          "filterable": true, //custom attributes
          "sortable": true //custom attributes
        },
        "roleName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 100,
          "pattern": "^[a-zA-Z-0-9-_ ]+$",
          "message": "RoleName can contain only alphanumeric and two specialcharacters hyphen and underscore",
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
        "activationStatus": {
          "type": "string",
          "enum": ["ACTIVE", "INACTIVE"],
          "displayable": true,
          "filterable": true, //custom attributes
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
        "associatedUsers": {
          "type": "number",
          "filterable": false, //custom attributes
          "sortable": false //custom attributes
        },
        "accessLevel": {
          "type": "string",
          "filterable": true, //custom attributes
          "sortable": false //custom attributes
        },
        "entityId": {
          "type": "string",
          "filterable": true, //custom attributes
          "sortable": false //custom attributes
        },
        "menuGroup": {
          "type": "array",
          "minItems": 1,
          "message": "Menus are required",
          "items": {
            "properties": {
              "tenantId": {
                "type": "string",
                "minLength": 1,
                "maxLength": 64,
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
                    }
                  },
                  "required": ["menuItemType", "applicationCode", "menuItemCode", "title", "menuItemOrder"]
                }
              }
            },
            "required": ["tenantId", "applicationCode", "menuGroupCode", "menuGroupOrder", "title", "createdDate", "createdBy", "menuItems"]
          }
        },
        "description": {
          "type": "string",
          "minLength": 0,
          "maxLength": 255,
          "filterable": false, //custom attributes
          "sortable": false, //custom attributes
          "displayable": true
        }
      },
      "required": [
        "tenantId",
        "applicationCode",
        "roleName",
        "menuGroup",
        "activationStatus",
        "associatedUsers",
        "createdBy",
        "createdDate",
        "lastUpdatedDate",
        "entityId"
      ]
    },
    "contact": {
      "type": "object",
      "properties": {
        "firstName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50
        },
        "middleName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50
        },
        "lastName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50
        },
        "emailId": {
          "type": "string",
          "minLength": 8,
          "maxLength": 140,
          "format": "email"
        },
        "emailVerified": {
          "type": "boolean"
        },
        "phoneNumber": {
          "type": "string",
          "maxLength": 10
        },
        "mobileNumber": {
          "type": "string",
          "maxLength": 10
        },
        "mobileVerified": {
          "type": "boolean"
        },
        "faxNumber": {
          "type": "string",
          "minLength": 0,
          "maxLength": 10
        },
        "companyName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 64
        },
        "Address1": {
          "type": "string"
        },
        "Address2": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "state": {
          "type": "string",
          "maxLength": 140
        },
        "country": {
          "type": "string"
        },
        "zipCode": {
          "type": "string"
        }
      },
      "required": [
        "emailId",
        "state",
        "city",
        "country"
      ]
    }
  },
  "required": [
    "tenantId",
    "userId",
    "userName",
    "userPassword",
    "createdBy",
    "createdDate",
    "lastUpdatedDate",
    "contact",
    "role",
    "entityId"
  ]
};

module.exports.schema = userSchema;


filterAttributes = _.keys(_.pickBy(userSchema.properties, (a) => {
  return (a.filterable);
}));



module.exports.filterAttributes = filterAttributes;

sortableAttributes = _.keys(_.pickBy(userSchema.properties, (a) => {
  return (a.sortable);
}));

module.exports.sortableAttributes = sortableAttributes;