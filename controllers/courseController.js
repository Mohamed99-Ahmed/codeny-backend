const Course = require('../models/courseModel');
const factory = require('./handlerFactory');

// Use factory methods for standard CRUD operations
exports.getAllCourses = factory.getAll(Course);
exports.getSingleCourse = factory.getOne(Course);

     // it will be handled should be authorized by admin or empoloyer
exports.createCourse = factory.createOne(Course);
       // it will only handle by adimin 
exports.deletCourse = factory.deleteOne(Course)



// update specific Course image  + resize image + update Course
exports.uploadCourseImage = factory.uploadDocumentImage;
exports.resizeCoursePhoto = factory.resizeDocumentPhoto(Course);
exports.updatespcificCourse = factory.updateOneWithIMage(Course);