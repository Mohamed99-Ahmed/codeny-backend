const Website = require("../models/websiteModel");
const factory = require("./handlerFactory");
// Use factory methods for standard CRUD operations
exports.getAllWebsites = factory.getAll(Website);
exports.getSingleWebsite = factory.getOne(Website);

// it will be handled should be authorized by admin or empoloyer
exports.createWebsite = factory.createOne(Website);
// it will only handle by adimin
exports.deletWebsite = factory.deleteOne(Website);

// update specific Website image  + resize image + update Website
exports.uploadWebsiteImage = factory.uploadDocumentImage;
exports.resizeWebsitePhoto = factory.resizeDocumentPhoto(Website);
exports.updatespcificWebsite = factory.updateOneWithIMage(Website); 