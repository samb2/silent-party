const socket = io();
const audio = document.getElementById('audio');

function loadTracks() {
    console.log('load');
    audio.load();
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
    //const byteRange = `bytes=${Math.floor(data.currentTime)}-`;
    // if (data.currentTime > 0) {
    //     audio.src = `/stream/${data.musicName.music}`;
    //     audio.currentTime = data.currentTime;
    //     audio.play();
    // } else {
    //     audio.play();
    // }
});
