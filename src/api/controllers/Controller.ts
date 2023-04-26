import autoBind from 'auto-bind';
import ip from 'ip';
import qr from 'qrcode';

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
}
