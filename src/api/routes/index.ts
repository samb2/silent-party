import express, { Router } from 'express';
import { NotFoundError, ErrorHandlerMiddleware } from 'irolegroup';
import MainController from '../controllers/Main.controller';
import AdminController from '../controllers/Admin.controller';
import { multerMiddleware } from '../middlewares/multerMiddleware';

const router: Router = express.Router();

router.get('/', MainController.index);
// Stream
router.get('/stream/:music', MainController.stream);
// upload musics
router.post('/upload', multerMiddleware, MainController.upload);
// admin
router.get('/admin', AdminController.index);

// Error 404
router.all('*', (): void => {
    throw new NotFoundError();
});
router.use(ErrorHandlerMiddleware);

export { router };
