let player;
let isPlaying = false;
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8l7KmycMoI4ucXVopwCvo7Q79ZJGGFzNGiVKoWT7sWWX7eNT8wI18z5K2Gf9RiUcRBNFqqvH72gqG/pub?gid=0&single=true&output=csv";

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: '', // Empezamos vacío
        playerVars: { 'controls': 0, 'disablekb': 1 },
        events: {
            'onReady': () => {
                document.getElementById('status').innerText = "API lista. Cargando canciones...";
                cargarDatosSheets();
            }
        }
    });
}

async function cargarDatosSheets() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.text();
        
        // Convertir CSV a Array (saltando la primera fila de cabecera si la hay)
        const filas = data.split("\n").slice(1); 
        const container = document.getElementById('button-container');
        container.innerHTML = ""; // Limpiar mensaje de carga

        filas.forEach(fila => {
            const columnas = fila.split(",");
            if (columnas.length >= 2) {
                const etiqueta = columnas[0].trim();
                const url = columnas[1].trim();
                const videoId = extractVideoId(url);

                if (videoId) {
                    const btn = document.createElement('button');
                    btn.innerText = etiqueta;
                    btn.className = "music-btn";
                    btn.onclick = () => reproducir(videoId, etiqueta);
                    container.appendChild(btn);
                }
            }
        });
        document.getElementById('status').innerText = "Selecciona una canción";
    } catch (error) {
        console.error("Error cargando Sheets:", error);
        document.getElementById('status').innerText = "Error al conectar con Google Sheets";
    }
}

function reproducir(id, titulo) {
    player.loadVideoById(id);
    document.getElementById('video-title').innerText = titulo;
    document.getElementById('play-pause').innerText = "⏸";
    isPlaying = true;
}

function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2].trim() : null;
}

// Botón Play/Pause básico
document.getElementById('play-pause').addEventListener('click', () => {
    if (isPlaying) {
        player.pauseVideo();
        document.getElementById('play-pause').innerText = "▶";
    } else {
        player.playVideo();
        document.getElementById('play-pause').innerText = "⏸";
    }
    isPlaying = !isPlaying;
});

// Barra de progreso
setInterval(() => {
    if (player && player.getCurrentTime) {
        const p = (player.getCurrentTime() / player.getDuration()) * 100;
        document.getElementById('progress-bar').style.width = (p || 0) + '%';
    }
}, 1000);
