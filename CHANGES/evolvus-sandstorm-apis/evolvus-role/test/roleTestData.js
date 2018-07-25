module.exports.validObject1 = {
  // valid role object
  "tenantId": "T001",
  "entityId": "H001B001",
  "accessLevel": "1",
  "applicationCode": "DOCKET",
  "wfInstanceId": "",
  "wfInstanceStatus": "INITIALIZE",
  "enableFlag": "1",
  "roleName": "admin_One",
  "roleType": "CHECKER",
  "txnType": ["BANKING"],
  "menuGroup": [{
    "tenantId": "tid",
    "applicationCode": "DOCKET",
    "menuGroupCode": "mgc",
    "menuGroupOrder": 1,
    "createdDate": new Date().toISOString(),
    "createdBy": "user",
    "title": "menugroup title",
    "menuItems": [{
      "menuItemType": "queues",
      "applicationCode": "DOCKET",
      "menuItemOrder": 1,
      "menuItemCode": "mic",
      "title": "menuItem title"
    }, {
      "menuItemType": "queues",
      "applicationCode": "DOCKET",
      "menuItemOrder": 2,
      "menuItemCode": "mic",
      "title": "menuItem title"
    }]
  }],
  "description": "admin_One decription *",
  "activationStatus": "ACTIVE",
  "associatedUsers": 5,
  "createdBy": "user",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString()
};

module.exports.validObject2 = {
  // valid role object
  "tenantId": "IVL",
  "entityId": "Entity2",
  "accessLevel": "1",
  "applicationCode": "CDA",
  "enableFlag": "1",
  "roleName": "admin_Two",
  "roleType": "CHECKER",
  "txnType": "[BANKING]",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "menuGroup": [{
    "tenantId": "tid",
    "applicationCode": "CDA",
    "menuGroupCode": "mgc1",
    "menuGroupOrder": 1,
    "createdDate": new Date().toISOString(),
    "createdBy": "user",
    "title": "menugroup title",
    "menuItems": [{
      "menuItemType": "queues",
      "applicationCode": "CDA",
      "menuItemOrder": 1,
      "menuItemCode": "mic",
      "title": "menuItem title"
    }, {
      "menuItemType": "queues",
      "applicationCode": "RTP",
      "menuItemOrder": 2,
      "menuItemCode": "mic",
      "title": "menuItem title"
    }]
  }],
  "description": "admin_One decription *",
  "activationStatus": "ACTIVE",
  "associatedUsers": 5,
  "createdBy": "kamalarani",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString()
};

module.exports.validObject3 = {
  // valid role object
  "tenantId": "IVL",
  "entityId": "Entity2",
  "enableFlag": 1,
  "accessLevel": "1",
  "roleType": "CHECKER",
  "txnType": "[BANKING]",
  "applicationCode": "FLUX",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "roleName": "admin_Three",
  "menuGroup": [{
    "tenantId": "tid",
    "applicationCode": "CDA",
    "menuGroupCode": "mgc",
    "menuGroupOrder": 1,
    "createdDate": new Date().toISOString(),
    "createdBy": "user",
    "title": "menugroup title",
    "menuItems": [{
      "menuItemType": "queues",
      "applicationCode": "CDA",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }, {
      "menuItemType": "queues",
      "applicationCode": "RTP",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }]
  }],
  "description": "admin_One decription *",
  "activationStatus": "ACTIVE",
  "associatedUsers": 5,
  "createdBy": "kamalarani",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString()
};

module.exports.validObject4 = {
  // valid role object
  "tenantId": "IVL",
  "entityId": "Entity2",
  "accessLevel": "1",
  "enableFlag": 1,
  "applicationCode": "ASBA",
  "roleType": "CHECKER",
  "txnType": "[BANKING]",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "roleName": "admin_Four",
  "menuGroup": [{
    "tenantId": "tid",
    "applicationCode": "CDA",
    "menuGroupCode": "mgc",
    "menuGroupOrder": 1,
    "createdDate": new Date().toISOString(),
    "createdBy": "user",
    "title": "menugroup title",
    "menuItems": [{
      "menuItemType": "queues",
      "applicationCode": "CDA",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }, {
      "menuItemType": "queues",
      "applicationCode": "RTP",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }]
  }],
  "description": "admin_One decription *",
  "activationStatus": "ACTIVE",
  "associatedUsers": 5,
  "createdBy": "kamalarani",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString()
};

module.exports.validObject5 = {
  // valid role object
  "tenantId": "IVL",
  "entityId": "Entity2",
  "accessLevel": "1",
  "applicationCode": "CDA-CONSOLE",
  "roleType": "CHECKER",
  "txnType": "[BANKING]",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "roleName": "admin_Five",
  "enableFlag": 1,
  "menuGroup": [{
    "tenantId": "tid",
    "applicationCode": "CDA",
    "menuGroupCode": "mgc",
    "menuGroupOrder": 1,
    "createdDate": new Date().toISOString(),
    "createdBy": "user",
    "title": "menugroup title",
    "menuItems": [{
      "menuItemType": "queues",
      "applicationCode": "CDA",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }, {
      "menuItemType": "queues",
      "applicationCode": "RTP",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }]
  }],
  "description": "admin_One decription *",
  "activationStatus": "ACTIVE",
  "associatedUsers": 5,
  "createdBy": "kamalarani",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString()
};

module.exports.validObject6 = {
  // valid role object
  "tenantId": "IVL",
  "entityId": "Entity2",
  "accessLevel": "1",
  "applicationCode": "RTP-CONSOLE",
  "roleName": "admin_SIX",
  "roleType": "CHECKER",
  "txnType": "[BANKING]",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "enableFlag": 1,
  "menuGroup": [{
    "tenantId": "tid",
    "applicationCode": "CDA",
    "menuGroupCode": "mgc",
    "menuGroupOrder": 1,
    "createdDate": new Date().toISOString(),
    "createdBy": "user",
    "title": "menugroup title",
    "menuItems": [{
      "menuItemType": "queues",
      "applicationCode": "CDA",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }, {
      "menuItemType": "queues",
      "applicationCode": "RTP",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }]
  }],
  "description": "admin_One decription *",
  "activationStatus": "ACTIVE",
  "associatedUsers": 5,
  "createdBy": "kamalarani",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString()
};

module.exports.validObject7 = {
  // valid role object
  "tenantId": "IVL",
  "entityId": "Entity2",
  "accessLevel": "1",
  "applicationCode": "FLUX-CONSOLE",
  "roleName": "admin_Seven",
  "roleType": "CHECKER",
  "txnType": "[BANKING]",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "enableFlag": 0,
  "menuGroup": [{
    "tenantId": "tid",
    "applicationCode": "CDA",
    "menuGroupCode": "mgc1",
    "menuGroupOrder": 1,
    "createdDate": new Date().toISOString(),
    "createdBy": "user",
    "title": "menugroup title",
    "menuItems": [{
      "menuItemType": "queues",
      "applicationCode": "CDA",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }, {
      "menuItemType": "queues",
      "applicationCode": "RTP",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }]
  }],
  "description": "admin_One decription *",
  "activationStatus": "ACTIVE",
  "associatedUsers": 5,
  "createdBy": "kamalarani",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString()
};

module.exports.validObject8 = {
  // valid role object
  "tenantId": "IVL",
  "entityId": "Entity2",
  "accessLevel": "1",
  "applicationCode": "FLUX-CONSOLE",
  "roleName": "admin_Eight",
  "roleType": "CHECKER",
  "txnType": "[BANKING]",
  "wfInstanceId": "wfID",
  "wfInstanceStatus": "wfStatus",
  "enableFlag": 0,
  "menuGroup": [{
    "tenantId": "tid",
    "applicationCode": "CDA",
    "menuGroupCode": "mgc",
    "menuGroupOrder": 1,
    "createdDate": new Date().toISOString(),
    "createdBy": "user",
    "title": "menugroup title",
    "menuItems": [{
      "menuItemType": "queues",
      "applicationCode": "CDA",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }, {
      "menuItemType": "queues",
      "applicationCode": "RTP",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }]
  }],
  "description": "admin_One decription *",
  "activationStatus": "ACTIVE",
  "associatedUsers": 5,
  "createdBy": "kamalarani",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString()
};

module.exports.invalidObject1 = {
  // invalid role object
  "tenantId": "IVL",
  "entityId": "Entity",
  "accessLevel": "1",
  "menuGroup": [{
    "tenantId": "tid",
    "applicationCode": "CDA",
    "menuGroupCode": "mgc",
    "title": "menugroup title",
    "menuItems": [{
      "menuItemType": "queues",
      "applicationCode": "CDA",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }, {
      "menuItemType": "queues",
      "applicationCode": "RTP",
      "menuItemCode": "mic",
      "title": "menuItem title"
    }]
  }],
  "description": "admin_One decription *",
  "activationStatus": "ACTIVE",
  "associatedUsers": 5,
  "createdBy": "kamalarani",
  "createdDate": new Date().toISOString(),
  "lastUpdatedDate": new Date().toISOString()
};