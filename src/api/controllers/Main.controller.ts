import Controller from './Controller';
import { Response, Request, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

class MainController extends Controller {
    async index(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            return res.render('index');
        } catch (e: any) {
            next(e);
        }
    }

    stream(req: Request, res: Response, next: NextFunction) {
        try {
            const musicName = req.params.music;
            const musicPath = path.join(process.cwd(), `musics/${musicName}`);

            // Get the file stats to determine the file size
            const stat = fs.statSync(musicPath);
            const fileSize = stat.size;

            // Parse the range header if present
            const range = req.headers.range;
            if (range) {
                const [start, end] = range.replace('bytes=', '').split('-');
                const startByte = parseInt(start, 10);
                const endByte = end ? parseInt(end, 10) : fileSize - 1;

                const chunkSize = endByte - startByte + 1;

                res.writeHead(206, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': chunkSize,
                    'Content-Range': `bytes ${startByte}-${endByte}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                });

                const stream = fs.createReadStream(musicPath, { start: startByte, end: endByte });
                stream.pipe(res);
            } else {
                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': fileSize,
                });

                const stream = fs.createReadStream(musicPath);
                stream.pipe(res);
            }
        } catch (e: any) {
            next(e);
        }
    }

    async upload(req: Request, res: Response, next: NextFunction) {
        try {
            res.redirect('/admin');
        } catch (e: any) {
            next(e);
        }
    }
}

export default new MainController();
