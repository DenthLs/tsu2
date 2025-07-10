const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Недопустимый формат файла'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;