import autoBind from 'auto-bind';
import ip from 'ip';
import qr from 'qrcode';
import queue from '../../utils/queue';
import fs from 'fs';
import NodeID3 from 'node-id3';
import getMP3Duration from 'get-mp3-duration';

export default class Controller {
    constructor() {
        autoBind(this);
    }

    async qrCodeGenerator() {
        const ipAddress = await ip.address();
        const url = `http://${ipAddress}:${process.env.PORT}`;
        const [qrCode] = await Promise.all([qr.toDataURL(url)]);
        return { qrCode, url };
    }

    async getMusicsInfo() {
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
        return { qrCode, url, musicsInfo };
    }
}
