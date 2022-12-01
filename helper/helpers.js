const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
});

function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg" || file.type === "image/gif") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage });

module.exports = { upload };