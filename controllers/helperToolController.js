const helperTool = require('../models/helperTool');
const factory = require('./handlerFactory');

// Use factory methods for standard CRUD operations
exports.getAllhelperTools = factory.getAll(helperTool);
exports.getSinglehelperTool = factory.getOne(helperTool);

     // it will be handled should be authorized by admin or empoloyer
exports.createhelperTool = factory.createOne(helperTool);
       // it will only handle by adimin 
exports.delethelperTool = factory.deleteOne(helperTool)



// update specific helperTool image  + resize image + update helperTool
exports.uploadhelperToolImage = factory.uploadDocumentImage;
exports.resizehelperToolPhoto = factory.resizeDocumentPhoto(helperTool);
exports.updatespcifichelperTool = factory.updateOneWithIMage(helperTool);