import Controller from './Controller';
import { Response, Request, NextFunction } from 'express';
import users from '../../utils/users';

class AdminController extends Controller {
    async index(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            // ------------ Generate QR Code ------------
            const { qrCode, url } = await this.qrCodeGenerator();

            const musicsInfo = await this.getMusicsInfo();

            const allUser = users.getUsers();

            return res.render('admin2', { qrCode, url, musicsInfo, allUser });
        } catch (e: any) {
            next(e);
        }
    }
}

export default new AdminController();
