import fs from 'fs';
import _ from 'underscore';

class Queue {
    directory: string = process.cwd() + '/musics/';
    tracks: string[] = [];
    playingTrack: string = '';
    isPLaying: boolean = false;
    currentTime: number = 0;

    loadTracks(): void {
        const musics: string[] = fs.readdirSync(this.directory);
        const mp3Files: string[] = musics.filter((music) => music.endsWith('.mp3'));
        this.setTracks(mp3Files);
    }

    getTracks(): string[] {
        return this.tracks;
    }

    setTracks(tracks): void {
        this.tracks = tracks;
    }

    addTrack(musicName): void {
        if (!this.getTracks().includes(musicName)) {
            this.getTracks().push(musicName);
            const sortedArr: string[] = _.sortBy(this.getTracks());
            this.setTracks(sortedArr);
        }
    }

    tracksCount(): number {
        return this.getTracks().length;
    }

    getDirectory(): string {
        return this.directory;
    }

    nextSong(musicName): string {
        const musicNameIndex: number = this.getTracks().indexOf(musicName);
        if (musicNameIndex < this.tracksCount() - 1) {
            const nextTrackIndex: number = musicNameIndex + 1;
            return this.tracks[nextTrackIndex];
        }
        const nextTrackIndex = 0;
        return this.tracks[nextTrackIndex];
    }

    setPlayingTrack(value: string): void {
        this.playingTrack = value;
    }

    getPlayingTrack(): string {
        return this.playingTrack;
    }

    setIsPLaying(value: boolean): void {
        this.isPLaying = value;
    }

    getIsPLaying(): boolean {
        return this.isPLaying;
    }

    setCurrentTime(value: number): void {
        this.currentTime = value;
    }

    getCurrentTime(): number {
        return this.currentTime;
    }
}

export default new Queue();
