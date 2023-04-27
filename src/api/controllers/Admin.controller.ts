import Controller from './Controller';
import { Response, Request, NextFunction } from 'express';

class AdminController extends Controller {
    async index(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { url, musicsInfo, qrCode } = await this.getMusicsInfo();

            return res.render('admin', { qrCode, url, musicsInfo });
        } catch (e: any) {
            next(e);
        }
    }
}

export default new AdminController();
