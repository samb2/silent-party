import * as http from 'http';

import debug0 from 'debug';

import { logger } from './config/logger';
import { App } from './app';
import { Server as IOServer } from 'socket.io';
import * as fs from 'fs';
import queue from './utils/queue';

export class Server {
    port: number = Config.server.port;
    server: any;
    debug = debug0('iRole-Express-Api:server');

    constructor() {
        this.setServer();
        this.checkDirectory();
        this.socketSetup();
        this.loadTracks();
    }

    setServer() {
        /**
         * Create HTTP server.
         */
        this.server = http.createServer(new App().app);
        this.server.listen(this.port, () => {
            logger.info(`Server listening on port: ${this.port} Mode = ${Config.server.environment}`);
        });
        this.server.on('error', this.onError);
    }

    socketSetup() {
        const io = new IOServer(this.server);

        let isPlaying = false;

        io.on('connection', (socket) => {
            // ---------------- Admin ----------------
            socket.on('admin:selectMusic', (musicName) => {
                console.log('admin:selectMusic');
                isPlaying = true;
                io.emit('client:playSelectedSong', musicName);
            });

            socket.on('admin:playButton', () => {
                if (!isPlaying) {
                    console.log('admin:playButton');
                }
            });

            socket.on('admin:pauseButton', (musicInfo) => {
                isPlaying = false;
                console.log(musicInfo);
            });

            socket.on('admin:songEnded', (musicName) => {
                console.log('admin:songEnded');
                isPlaying = false;
                const nextMusicName = queue.nextSong(musicName);
                io.emit('admin:playNextSong', nextMusicName);
            });

            // ---------------- client ---------------
            socket.on('disconnect', () => {
                //console.log('user disconnected');
            });
        });
    }

    checkDirectory() {
        const musicDirectoryPath = './musics';
        // Check if the directory already exists
        if (fs.existsSync('./musics')) return;

        // If the directory doesn't exist, create it
        fs.mkdir(musicDirectoryPath, { recursive: true }, (err) => {
            if (err) {
                logger.info('Failed to create directory');
            }
            logger.info('Music directory created successfully!');
        });
    }

    loadTracks() {
        queue.loadTracks();
        const tracksCount = queue.tracksCount();
        if (tracksCount > 1) {
            logger.info(`${tracksCount} Tracks Loaded!`);
        } else {
            logger.info(`${tracksCount} Track Loaded!`);
        }
    }

    /**
     * Event listener for HTTP server "error" event.
     */
    onError(error: any) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = `Port ${this.port}`;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                logger.error(`${bind} requires elevated privileges`, error);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                logger.error(`${bind} is already in use`, error);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
}
