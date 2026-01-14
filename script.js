function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Evento para el botón "Cargar"
document.getElementById('load-video').addEventListener('click', () => {
    const url = document.getElementById('youtube-url').value;
    const videoId = extractVideoId(url);

    if (videoId && player) {
        player.loadVideoById(videoId); // Método oficial de la API para cambiar de video
        document.getElementById('status').innerText = "Video cargado con éxito";
    } else {
        alert("Por favor, introduce una URL de YouTube válida.");
    }
});
