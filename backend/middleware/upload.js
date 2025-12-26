const multer = require("multer");
const cloudinaryStorage = require("./cloudinary");

module.exports = multer({ storage: cloudinaryStorage }).single("image");
