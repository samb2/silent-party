import Controller from './Controller';
import { Response, Request, NextFunction } from 'express';

class MainController extends Controller {
    async index(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            return res.render('index');
        } catch (e: any) {
            next(e);
        }
    }
}

export default new MainController();
