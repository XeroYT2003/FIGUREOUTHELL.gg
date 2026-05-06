const DISCORD_ID = "834059482761134090";

async function updateDiscord() {
    try {
        // Poprawiony link API
        const response = await fetch(`https://lanyard.rest{DISCORD_ID}`);
        const data = await response.json();
        
        if (data.success) {
            const user = data.data.discord_user;
            const status = data.data.discord_status;

            // Poprawiony link do avatara
            const avatarUrl = `https://discordapp.com{user.id}/${user.avatar}.webp?size=256`;
            
            document.getElementById('discord-avatar').src = avatarUrl;
            document.getElementById('notif-avatar').src = avatarUrl;
            document.getElementById('discord-name').innerText = user.username.toUpperCase();
            document.getElementById('notif-user').innerText = user.username + " 🤍";

            const colors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
            document.getElementById('status-dot').style.background = colors[status] || colors.offline;
        }
    } catch (e) {
        console.error("Błąd wczytywania profilu:", e);
    }
}

const audio = document.getElementById("myAudio");
const playBtn = document.getElementById("play-btn");
const progressBar = document.getElementById("progress-bar");
const volumeSlider = document.getElementById("volume-slider");

// Aktualizacja czasu i paska
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressBar.value = pct;
        
        const min = Math.floor(audio.currentTime / 60);
        const sec = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
        document.getElementById("current-time").innerText = `${min}:${sec}`;
        
        progressBar.style.background = `linear-gradient(to right, #fff ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
    }
});

// Ustawienie całkowitego czasu
audio.addEventListener("loadedmetadata", () => {
    const min = Math.floor(audio.duration / 60);
    const sec = Math.floor(audio.duration % 60).toString().padStart(2, '0');
    document.getElementById("duration").innerText = `${min}:${sec}`;
});

// Głośność
volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value;
});

// Play/Pause
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.classList.replace('fa-play', 'fa-pause');
        document.getElementById("album-art").style.animationPlayState = 'running';
    } else {
        audio.pause();
        playBtn.classList.replace('fa-pause', 'fa-play');
        document.getElementById("album-art").style.animationPlayState = 'paused';
    }
});

// Autostart przy kliknięciu w stronę
document.body.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.classList.replace('fa-play', 'fa-pause');
        document.getElementById("album-art").style.animationPlayState = 'running';
    }
}, { once: true });

updateDiscord();
setInterval(updateDiscord, 30000);
