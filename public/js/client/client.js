const socket = io();
const audio = document.getElementById('audio');
const usernameInput = document.getElementById('inputJoin');

$(window).on('load', function () {
    const localUsername = getUsername();
    if (localUsername !== null) {
        usernameInput.value = localUsername;
    }
    $('#usernameModal').modal('show');
});

function joinParty() {
    let username = usernameInput.value;

    if (username != null && username !== '') {
        setUsername(username);
        assignUsername(username);
    }
}

function getUsername() {
    return localStorage.getItem('username');
}

function setUsername(username) {
    localStorage.setItem('username', username);
}

function assignUsername(username) {
    socket.emit('users:addUser', username);
    loadTracks();
    $('#usernameModal').modal('hide');
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

$('#muteButton').click(function () {
    $(this).toggleClass('muted');
    $(this).find('i').toggleClass('fa-volume-high fa-volume-mute');
    var audioElement = document.getElementById("audio");
    if (audioElement.muted) {
        audioElement.muted = false;
    } else {
        audioElement.muted = true;
    }
});


