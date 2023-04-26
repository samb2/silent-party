const socket = io();
const audio = document.getElementById('audio');

function play(musicName) {
    audio.src = `/stream/${musicName}.mp3`;
    audio.play();
}

audio.addEventListener('play', function () {
    //socket.emit('play');
});
audio.addEventListener('pause', function () {
    //const currentTime = audio.currentTime;
    //const src = audio.src;
    //audio.pause();
    //socket.emit('pause', { currentTime, src });
});
