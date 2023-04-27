import Controller from './Controller';
import { Response, Request, NextFunction } from 'express';
import fs from 'fs';
import getMP3Duration from 'get-mp3-duration';
import NodeID3 from 'node-id3';
import queue from '../../utils/queue';

class AdminController extends Controller {
    async index(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            // ------------ Generate QR Code ------------
            const { qrCode, url } = await this.qrCodeGenerator();
            // ------------ get Tracks ---------------
            const files = queue.getTracks();

            const musicsInfo: any = [];

            for (const file of files) {
                const filePath = `${queue.getDirectory()}${file}`;
                const stats = fs.statSync(filePath);
                const buffer = fs.readFileSync(filePath);

                const tags = NodeID3.read(filePath);
                const image = tags.image;
                const artist = tags.artist;

                // ----------- Get Duration -----------
                const duration = getMP3Duration(buffer);
                const total_seconds = duration / 1000;
                const minutes = Math.floor(total_seconds / 60);
                const seconds = Math.floor(total_seconds % 60);
                const formateDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                // ------------------------------------

                //----------- Get File Size -----------
                const fileSizeInBytes = (stats.size / 1048576).toFixed(2);

                //----------- Get File Format & Name -----------
                const fileFormat = file.split('.').pop();
                const fileName = file.split('.').shift();

                if (fileFormat === 'mp3') {
                    musicsInfo.push({
                        name: fileName,
                        format: fileFormat,
                        size: fileSizeInBytes,
                        duration: formateDuration,
                        image,
                        artist,
                    });
                }
            }

            return res.render('admin', { qrCode, url, musicsInfo });
        } catch (e: any) {
            next(e);
        }
    }
}

export default new AdminController();
