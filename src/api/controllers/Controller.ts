import autoBind from 'auto-bind';
import ip from 'ip';
import qr from 'qrcode';
import queue from '../../utils/queue';
import fs from 'fs';
import NodeID3 from 'node-id3';
import getMP3Duration from 'get-mp3-duration';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

export default class Controller {
    constructor() {
        autoBind(this);
    }

    async qrCodeGenerator(): Promise<{ qrCode: any; url: string }> {
        const ipAddress = await ip.address();
        const url: string = `http://${ipAddress}:${process.env.PORT}`;
        const [qrCode] = await Promise.all([qr.toDataURL(url)]);
        return { qrCode, url };
    }

    async convertMusic(file): Promise<void> {
        await new Promise((resolve, reject) => {
            ffmpeg(file.path)
                .audioBitrate('64k') // Set the desired low bitrate
                .output('musics/' + file.originalname)
                .on('end', resolve)
                .on('error', reject)
                .run();
        });
    }

    async deleteTemp(): Promise<void> {
        const directory = './musics/temp';
        const files = fs.readdirSync(directory);
        files.forEach((file) => {
            const filePath = path.join(directory, file);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return;
                }
            });
        });
    }

    async getMusicsInfo() {
        // ------------ Generate QR Code ------------
        const { qrCode, url } = await this.qrCodeGenerator();
        // ------------ get Tracks ---------------
        const files: string[] = queue.getTracks();

        const musicsInfo: any = [];

        for (const file of files) {
            const filePath: string = `${queue.getDirectory()}${file}`;
            const stats: fs.Stats = fs.statSync(filePath);
            const buffer: Buffer = fs.readFileSync(filePath);

            const tags: NodeID3.Tags = NodeID3.read(filePath);
            const image = tags.image;
            const artist: string | undefined = tags.artist;

            // ----------- Get Duration -----------
            const duration = getMP3Duration(buffer);
            const total_seconds: number = duration / 1000;
            const minutes: number = Math.floor(total_seconds / 60);
            const seconds: number = Math.floor(total_seconds % 60);
            const formatDuration: string = `${minutes.toString().padStart(2, '0')}:${seconds
                .toString()
                .padStart(2, '0')}`;
            // ------------------------------------

            //----------- Get File Size -----------
            const fileSizeInBytes: string = (stats.size / 1048576).toFixed(2);

            //----------- Get File Format & Name -----------
            const fileFormat: string | undefined = file.split('.').pop();
            const fileName: string | undefined = file.split('.').shift();

            if (fileFormat === 'mp3') {
                musicsInfo.push({
                    name: fileName,
                    format: fileFormat,
                    size: fileSizeInBytes,
                    duration: formatDuration,
                    image,
                    artist,
                });
            }
        }
        return { qrCode, url, musicsInfo };
    }
}
