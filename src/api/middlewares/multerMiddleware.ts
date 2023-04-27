import multer from 'multer';
import queue from '../../utils/queue';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './musics');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'audio/mpeg') {
        queue.addTrack(file.originalname);
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only MP3 files are allowed!'));
    }
};

export const multerMiddleware = multer({ storage: storage, fileFilter: fileFilter }).single('audio');
