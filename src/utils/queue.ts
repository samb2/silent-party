import fs from 'fs';
import _ from 'underscore';

class Queue {
    directory = process.cwd() + '/musics/';
    tracks: any = [];

    loadTracks() {
        this.setTracks(fs.readdirSync(this.directory));
        //console.log('loadTracks', this.getTracks());
    }

    getTracks() {
        return this.tracks;
    }

    setTracks(tracks) {
        this.tracks = tracks;
    }

    addTrack(musicName) {
        this.getTracks().push(musicName);
        const sortedArr = _.sortBy(this.getTracks());
        this.setTracks(sortedArr);
        console.log('addTrack', this.getTracks());
    }

    tracksCount() {
        return this.getTracks().length;
    }

    getDirectory() {
        return this.directory;
    }

    nextSong(musicName) {
        const musicNameIndex = this.getTracks().indexOf(musicName);
        if (musicNameIndex < this.tracksCount() - 1) {
            const nextTrackIndex = musicNameIndex + 1;
            console.log(this.tracks[nextTrackIndex]);
            return this.tracks[nextTrackIndex];
        }
        const nextTrackIndex = 0;
        console.log(this.tracks[nextTrackIndex]);
        return this.tracks[nextTrackIndex];
    }
}

export default new Queue();
