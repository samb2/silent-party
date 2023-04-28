const socket = io();
const audio = document.getElementById('audio');

function loadTracks() {
    audio.load();
    checkPLaying();
}

function checkPLaying() {
    socket.emit('client:checkPlaying');
}

socket.on('client:playSelectedSong', function (musicName) {
    audio.src = `/stream/${musicName}`;
    audio.play();
});

socket.on('client:pauseButton', function () {
    audio.pause();
});

socket.on('client:playButton', function () {
    audio.play();
});

socket.on('client:playIsPlayingSong', function (musicInfo) {
    audio.src = `/stream/${musicInfo.musicName}`;
    audio.currentTime = musicInfo.currentTime;
    audio.play();
});
