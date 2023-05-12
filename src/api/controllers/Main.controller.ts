import Controller from './Controller';
import { Response, Request, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import queue from '../../utils/queue';

class MainController extends Controller {
    async index(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            return res.render('index');
        } catch (e: any) {
            next(e);
        }
    }

    stream(req: Request, res: Response, next: NextFunction): void {
        try {
            const musicName: string = req.params.music;
            const musicPath: string = path.join(process.cwd(), `musics/${musicName}`);

            // Get the file stats to determine the file size
            const stat: fs.Stats = fs.statSync(musicPath);
            const fileSize: number = stat.size;

            // Parse the range header if present
            const range: string | undefined = req.headers.range;
            if (range) {
                const [start, end] = range.replace('bytes=', '').split('-');
                const startByte: number = parseInt(start, 10);
                const endByte: number = end ? parseInt(end, 10) : fileSize - 1;

                const chunkSize: number = endByte - startByte + 1;

                res.writeHead(206, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': chunkSize,
                    'Content-Range': `bytes ${startByte}-${endByte}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                });

                const stream: fs.ReadStream = fs.createReadStream(musicPath, { start: startByte, end: endByte });
                stream.pipe(res);
            } else {
                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': fileSize,
                });

                const stream: fs.ReadStream = fs.createReadStream(musicPath);
                stream.pipe(res);
            }
        } catch (e: any) {
            next(e);
        }
    }

    async upload(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.convertMusic(req.file);
            queue.addTrack(req.file.originalname);
            await this.deleteTemp();
            res.redirect('/admin');
        } catch (e: any) {
            next(e);
        }
    }
}

export default new MainController();
