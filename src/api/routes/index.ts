import express from 'express';
import { NotFoundError, ErrorHandlerMiddleware } from 'irolegroup';
import MainController from '../controllers/Main.controller';
import AdminController from '../controllers/Admin.controller';

const router = express.Router();

router.get('/', MainController.index);
// admin
router.get('/admin', AdminController.index);

// Error 404
router.all('*', () => {
    throw new NotFoundError();
});
router.use(ErrorHandlerMiddleware);

export { router };
