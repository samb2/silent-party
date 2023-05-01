const socket = io();
const audio = document.getElementById('audio');

function usernamePrompt() {
    let username = prompt('Please enter your username');
    if (username != null && username !== '') {
        socket.emit('users:addUser', username);
        loadTracks();
    } else {
        usernamePrompt();
    }
}

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
