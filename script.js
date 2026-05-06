const audio = document.getElementById("myAudio");
const playBtn = document.getElementById("play-btn");
const progressBar = document.getElementById("progress-bar");
const albumArt = document.getElementById("album-art");

// 1. DISCORD API - LINK WPISANY NA SZTYWNO DLA PEWNOŚCI
async function updateDiscord() {
    try {
        const response = await fetch("https://api.lanyard.rest/v1/users/834059482761134090");
        const data = await response.json();
        
        if (data.success) {
            const user = data.data.discord_user;
            const status = data.data.discord_status;
            
            // Tworzenie linku do avatara
            const avatarUrl = "https://discordapp.com" + user.id + "/" + user.avatar + ".webp?size=256";
            
            document.getElementById('discord-avatar').src = avatarUrl;
            document.getElementById('notif-avatar').src = avatarUrl;
            document.getElementById('discord-name').innerText = user.username.toUpperCase();
            document.getElementById('notif-user').innerText = user.username + " 🤍";

            // Kolory statusu
            const colors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
            document.getElementById('status-dot').style.background = colors[status] || colors.offline;
            
            console.log("Discord załadowany!");
        }
    } catch (e) {
        console.error("Błąd wczytywania profilu:", e);
    }
}

// 2. LOGIKA AUDIO
function formatTime(s) {
    if (isNaN(s)) return "0:00";
    let m = Math.floor(s / 60);
    let sec = Math.floor(s % 60);
    return m + ":" + (sec < 10 ? '0' + sec : sec);
}

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressBar.value = pct;
        document.getElementById("current-time").innerText = formatTime(audio.currentTime);
        progressBar.style.background = "linear-gradient(to right, #fff " + pct + "%, rgba(255,255,255,0.1) " + pct + "%)";
    }
});

audio.addEventListener("loadedmetadata", () => {
    document.getElementById("duration").innerText = formatTime(audio.duration);
});

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.classList.replace('fa-play', 'fa-pause');
        albumArt.style.animationPlayState = 'running';
    } else {
        audio.pause();
        playBtn.classList.replace('fa-pause', 'fa-play');
        albumArt.style.animationPlayState = 'paused';
    }
});

// START
updateDiscord();
setInterval(updateDiscord, 30000);
