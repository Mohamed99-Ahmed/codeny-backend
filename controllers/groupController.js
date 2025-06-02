const Group = require('../models/groupsJobsModel');
const factory = require('./handlerFactory');

// Use factory methods for standard CRUD operations
exports.getAllGroups = factory.getAll(Group);
exports.getSingleGroup = factory.getOne(Group);

     // it will be handled should be authorized by admin or empoloyer
exports.createGroup = factory.createOne(Group);
       // it will only handle by adimin 
exports.deletGroup = factory.deleteOne(Group)



// update specific Group image  + resize image + update Group
exports.uploadGroupImage = factory.uploadDocumentImage;
exports.resizeGroupPhoto = factory.resizeDocumentPhoto(Group);
exports.updatespcificGroup = factory.updateOneWithIMage(Group);