let player;
let isPlaying = false;

// 1. Esta función debe llamarse EXACTAMENTE así para que YT la detecte
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: 'dQw4w9WgXcQ', // Video por defecto (RickRoll para probar)
        playerVars: {
            'controls': 0,
            'disablekb': 1,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    document.getElementById('status').innerText = "Listo para reproducir";
    
    // Configurar botones
    document.getElementById('play-pause').addEventListener('click', togglePlay);
    document.getElementById('load-video').addEventListener('click', loadNewVideo);
    document.getElementById('next').addEventListener('click', () => player.seekTo(player.getCurrentTime() + 10));
    document.getElementById('prev').addEventListener('click', () => player.seekTo(player.getCurrentTime() - 10));

    // Iniciar actualización de barra de progreso
    setInterval(updateProgressBar, 1000);
}

function togglePlay() {
    if (isPlaying) {
        player.pauseVideo();
        document.getElementById('play-pause').innerText = "▶";
    } else {
        player.playVideo();
        document.getElementById('play-pause').innerText = "⏸";
    }
    isPlaying = !isPlaying;
}

function loadNewVideo() {
    const url = document.getElementById('youtube-url').value;
    const videoId = extractVideoId(url);
    if (videoId) {
        player.loadVideoById(videoId);
        document.getElementById('status').innerText = "Cargando nuevo audio...";
        isPlaying = true;
        document.getElementById('play-pause').innerText = "⏸";
    } else {
        alert("URL no válida");
    }
}

function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function updateProgressBar() {
    if (player && player.getCurrentTime) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        if (duration > 0) {
            const percentage = (currentTime / duration) * 100;
            document.getElementById('progress-bar').style.width = percentage + '%';
        }
    }
}

function onPlayerError(e) {
    document.getElementById('status').innerText = "Error al cargar video (posible restricción)";
}
