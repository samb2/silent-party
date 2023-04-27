const socket = io();
const audio = document.getElementById('audio');

function play(musicName) {
    if (musicName.split('.').pop() !== 'mp3') {
        musicName = `${musicName}.mp3`;
    }
    audio.src = `/stream/${musicName}`;
    socket.emit('admin:selectMusic', { musicName });
    audio.play();
}

audio.addEventListener('play', function () {
    socket.emit('admin:playButton');
});

audio.addEventListener('pause', function () {
    const musicInfo = {
        //src: audio.src,
        currentTime: audio.currentTime,
    };
    socket.emit('admin:pauseButton', musicInfo);
    audio.pause();
});

audio.addEventListener('ended', function () {
    // code to run when the audio has ended
    const src = audio.src;
    let musicName = src.split('/').pop();
    musicName = musicName.replace(/%20/g, ' ');
    console.log('music ended!', musicName);
    socket.emit('admin:songEnded', musicName);
});

socket.on('admin:playNextSong', function (nextMusicName) {
    play(nextMusicName);
});
