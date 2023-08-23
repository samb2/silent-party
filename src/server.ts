import * as http from 'http';

import debug0 from 'debug';

import { logger } from './config/logger';
import { App } from './app';
import { Server as IOServer } from 'socket.io';
import * as fs from 'fs';
import queue from './utils/queue';
import users from './utils/users';

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

    setServer(): void {
        /**
         * Create HTTP server.
         */
        this.server = http.createServer(new App().app);
        this.server.listen(this.port, () => {
            logger.info(`Server listening on port: ${this.port} Mode = ${Config.server.environment}`);
        });
        this.server.on('error', this.onError);
    }

    socketSetup(): void {
        const io: any = new IOServer(this.server);

        // let isPlaying = false;
        // let currentTime;

        io.on('connection', (socket): void => {
            // ---------------- users ----------------
            socket.on('users:addUser', (username): void => {
                const id: string = socket.id;
                if (users.checkUserExist(id)) {
                    users.changeUserName(id, username);
                    io.emit('admin:changeUser', { id, username });
                } else {
                    users.setUser({ id, username });
                    io.emit('admin:addNewUser', { id, username });
                }
            });

            // ---------------- Admin ----------------
            socket.on('admin:selectMusic', (musicName): void => {
                queue.setIsPLaying(true);
                queue.setPlayingTrack(musicName);
                io.emit('client:playSelectedSong', musicName);
            });

            socket.on('admin:playButton', (): void => {
                if (!queue.getIsPLaying()) {
                    queue.setIsPLaying(true);
                    io.emit('client:playButton');
                }
            });

            socket.on('admin:pauseButton', (musicInfo): void => {
                queue.setIsPLaying(false);
                queue.setCurrentTime(musicInfo.currentTime);
                queue.setPlayingTrack(musicInfo.musicName);
                io.emit('client:pauseButton');
            });

            socket.on('admin:songEnded', (musicName): void => {
                queue.setIsPLaying(false);
                const nextMusicName: string = queue.nextSong(musicName);
                io.emit('admin:playNextSong', nextMusicName);
            });

            socket.on('admin:setCurrentTime', (currentTime): void => {
                queue.setCurrentTime(currentTime);
                const musicInfo = {
                    musicName: queue.getPlayingTrack(),
                    currentTime: queue.getCurrentTime(),
                };
                io.emit('client:playIsPlayingSong', musicInfo);
            });

            // ---------------- client ---------------
            socket.on('client:checkPlaying', (): void => {
                if (queue.getIsPLaying()) {
                    io.emit('admin:getCurrentTime');
                }
            });
            // ----------- chat messages -------------
            socket.on('chat message', (msg) => {
                console.log(`Received message from ${socket.id}: ${msg}`);
                const username = users.getUsernameWithId(socket.id);

                // Broadcast the message to all connected clients
                io.emit('chat message', { username, msg });
            });

            socket.on('disconnect', (): void => {
                users.deleteUser(socket.id);
                io.emit('admin:deleteUser', socket.id);
            });
        });
    }

    checkDirectory(): void {
        const musicDirectoryPath = './musics';
        const musicMainDirectoryPath = './musics/temp';
        // Check if the directory already exists
        if (fs.existsSync(musicDirectoryPath)) return;
        if (fs.existsSync(musicMainDirectoryPath)) return;

        // If the directory doesn't exist, create it
        fs.mkdir(musicDirectoryPath, { recursive: true }, (err): void => {
            if (err) {
                logger.info('Failed to create directory');
            }
            logger.info('Music directory created successfully!');
        });
        fs.mkdir(musicMainDirectoryPath, { recursive: true }, (err): void => {
            if (err) {
                logger.info('Failed to create directory');
            }
            logger.info('Music directory created successfully!');
        });
    }

    loadTracks(): void {
        queue.loadTracks();
        const tracksCount = queue.tracksCount();
        setTimeout(() => {
            if (tracksCount > 1) {
                logger.info(`${tracksCount} Tracks Loaded!`);
            } else {
                logger.info(`${tracksCount} Track Loaded!`);
            }
        }, 1000);
    }

    /**
     * Event listener for HTTP server "error" event.
     */
    onError(error: any): void {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind: string = `Port ${this.port}`;

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
