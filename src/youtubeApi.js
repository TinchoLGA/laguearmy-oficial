// ✅ youtubeApi.js
// Obtiene el último video subido de un canal de YouTube con su API Key.

export async function fetchLatestVideo(apiKey, channelId) {
  try {
    // 1️⃣ Obtener la lista de videos subidos del canal
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    const channelData = await channelRes.json();

    const uploadsId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsId) throw new Error("No se encontró la lista de uploads del canal.");

    // 2️⃣ Obtener el último video de esa lista
    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=1&key=${apiKey}`
    );
    const videoData = await videoRes.json();

    const video = videoData.items?.[0]?.snippet;
    if (!video) throw new Error("No se encontró ningún video.");

    return {
      title: video.title,
      videoId: video.resourceId.videoId,
      thumbnail: video.thumbnails.medium.url,
      publishedAt: video.publishedAt,
    };
  } catch (error) {
    console.error("Error al obtener el último video:", error);
    return null;
  }
}
