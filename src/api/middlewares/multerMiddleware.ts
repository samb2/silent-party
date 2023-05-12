import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './musics/temp');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'audio/mpeg') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only MP3 files are allowed!'));
    }
};

export const multerMiddleware = multer({ storage, fileFilter }).single('audio');
