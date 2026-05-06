const media = document.getElementById("main-media"); // To jest nasz video tag
const playBtn = document.getElementById("play-btn");
const progressBar = document.getElementById("progress-bar");
const volumeSlider = document.getElementById("volume-slider");
const albumArt = document.getElementById("album-art");

const DISCORD_ID = "834059482761134090";

media.volume = 0.15;

function startExperience() {
    const enterScreen = document.getElementById("enter-screen");
    enterScreen.style.opacity = "0";
    
    setTimeout(() => {
        enterScreen.style.display = "none";
        document.getElementById("main-content").classList.add("active");
        
        
        media.muted = false; 
        togglePlayback(true);
    }, 1000);
}

function togglePlayback(play) {
    if (play) {
        media.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        albumArt.style.animationPlayState = "running";
    } else {
        media.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        albumArt.style.animationPlayState = "paused";
    }
}


playBtn.addEventListener('click', () => {
    togglePlayback(media.paused);
});


media.addEventListener("timeupdate", () => {
    if (!isNaN(media.duration)) {
        const pct = (media.currentTime / media.duration) * 100;
        progressBar.value = pct;
        document.getElementById("current-time").innerText = formatTime(media.currentTime);
    }
});


media.addEventListener("loadedmetadata", () => {
    document.getElementById("duration").innerText = formatTime(media.duration);
    
    const fileName = media.querySelector('source').src.split('/').pop().replace('%20', ' ').replace('.mp4', '');
    document.getElementById('track-title').innerText = fileName;
});


progressBar.addEventListener("input", () => {
    const time = (progressBar.value / 100) * media.duration;
    media.currentTime = time;
});


volumeSlider.addEventListener("input", (e) => {
    media.volume = e.target.value;
    const icon = document.getElementById('volume-icon');
    if (media.volume == 0) icon.className = "fa-solid fa-volume-xmark";
    else if (media.volume < 0.5) icon.className = "fa-solid fa-volume-low";
    else icon.className = "fa-solid fa-volume-high";
});

function formatTime(s) {
    let m = Math.floor(s / 60);
    let sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}


async function fetchLanyard() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const { data } = await response.json();
        if (!data) return;

        
        const avatarUrl = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.webp?size=256`;
        document.getElementById('discord-avatar').src = avatarUrl;
        
        
        const colors = { online: '#ffffff', idle: '#555555', dnd: '#990000', offline: '#111111' };
        document.getElementById('status-dot').style.background = colors[data.discord_status];
        document.getElementById('discord-status-text').innerText = data.discord_status.toUpperCase();

        
        const activityDetail = document.getElementById('activity-detail');
        const activityImg = document.getElementById('activity-img');
        const defaultIcon = document.getElementById('default-icon');

        if (data.listening_to_spotify) {
            activityImg.src = data.spotify.album_art_url;
            activityImg.style.display = 'block';
            defaultIcon.style.display = 'none';
            activityDetail.innerText = data.spotify.title;
        } else {
            const act = data.activities.find(a => a.type === 0);
            activityImg.style.display = 'none';
            defaultIcon.style.display = 'block';
            activityDetail.innerText = act ? act.name : "Nic nie robi...";
        }
    } catch (e) { console.error("Lanyard error"); }
}

fetchLanyard();
setInterval(fetchLanyard, 15000);