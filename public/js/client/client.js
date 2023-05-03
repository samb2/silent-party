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

socket.on('client:playSelectedSong', function(musicName) {
    audio.src = `/stream/${musicName}`;
    audio.play();
});

socket.on('client:pauseButton', function() {
    audio.pause();
});

socket.on('client:playButton', function() {
    audio.play();
});

socket.on('client:playIsPlayingSong', function(musicInfo) {
    audio.src = `/stream/${musicInfo.musicName}`;
    audio.currentTime = musicInfo.currentTime;
    audio.play();
});


const form = document.getElementById('form');
const input = document.getElementById('input');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (msg !== '') {
        // Emit the chat message to the server
        socket.emit('chat message', msg);
        input.value = '';
    }
});

// Handle incoming chat messages
const messages = document.getElementById('messages');
socket.on('chat message', (data) => {
    const { username, msg } = data;
    const li = document.createElement('li');
    li.textContent = `${username}: ${msg}`;
    messages.appendChild(li);
});