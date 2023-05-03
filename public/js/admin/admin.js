const socket = io();
const audio = document.getElementById('audio');
const users = document.getElementById('users');

function play(musicName) {
    if (musicName.split('.').pop() !== 'mp3') {
        musicName = `${musicName}.mp3`;
    }
    audio.src = `/stream/${musicName}`;
    socket.emit('admin:selectMusic', musicName);
    audio.play();
}

function getMusicName(src) {
    let musicName = src.split('/').pop();
    musicName = musicName.replace(/%20/g, ' ');
    return musicName;
}

audio.addEventListener('play', function() {
    socket.emit('admin:playButton');
});

audio.addEventListener('pause', function() {
    const musicInfo = {
        currentTime: audio.currentTime,
        musicName: getMusicName(audio.src),
    };
    socket.emit('admin:pauseButton', musicInfo);
    audio.pause();
});

audio.addEventListener('ended', function() {
    // code to run when the audio has ended
    const musicName = getMusicName(audio.src);
    socket.emit('admin:songEnded', musicName);
});

socket.on('admin:playNextSong', function(nextMusicName) {
    play(nextMusicName);
});

socket.on('admin:getCurrentTime', function() {
    const currentTime = audio.currentTime;
    socket.emit('admin:setCurrentTime', currentTime);
});

socket.on('admin:addNewUser', function(userInfo) {
    $('#users').append(`<p id='${userInfo.id}'>${userInfo.username}</p>`);
});

socket.on('admin:deleteUser', function(userId) {
    $('#' + userId).remove();
});

socket.on('chat message', (data) => {
    const { username, msg } = data;
    const li = document.createElement('li');
    li.textContent = `${username}: ${msg}`;
    messages.appendChild(li);
});