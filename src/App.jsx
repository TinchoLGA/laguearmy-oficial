import React, { useState, useEffect } from "react";

/**
 * Recomendaciones:
 * - Asegúrate de que /Miniatura.png exista en /public/ o en /dist/
 * - Actualizá los channel URLs o los IDs si cambiás de canal
 */

export default function App() {
  const [latestVideo, setLatestVideo] = useState(null);
  const [latestArtVideo, setLatestArtVideo] = useState(null);
  const [showEmbed, setShowEmbed] = useState("none"); // "twitch" | "kick" | "youtube" | "none"

  // --- Configuración (ajustá si querés) ---
  const config = {
    twitchUrl: "https://www.twitch.tv/tincholga",
    kickUrl: "https://kick.com/tincholisl-lga",
    youtubeChannelId: "UCSDMfweS3smhKGbbpBBtaZA",
    youtubeArtChannelId: "UCLTue1FuQ4Y0yPYcvuwvdMQ",
    apiKey: "AIzaSyDdTnC50jZgmJ7FuAJYVlhUIk6jhIFd8QE",
  };

  // --- Obtener últimos videos de YouTube (canal gamer y artístico) ---
  useEffect(() => {
    async function fetchLatest(channelId, setter) {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${config.apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.items.length > 0) {
          const vid = data.items.find((it) => it.id && it.id.videoId);
          if (vid) {
            setter({
              id: vid.id.videoId,
              title: vid.snippet.title,
              thumbnail: vid.snippet.thumbnails.medium.url,
            });
          }
        }
      } catch (err) {
        console.error("Error al obtener videos:", err);
      }
    }

    fetchLatest(config.youtubeChannelId, setLatestVideo);
    fetchLatest(config.youtubeArtChannelId, setLatestArtVideo);
  }, []);

  // --- Embed components ---

  const TwitchEmbed = ({ url }) => {
    const channel = url.replace(/https:\/\/www\.twitch\.tv\//, "");
    const parent = window.location.hostname;
    const src = `https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=false&autoplay=false`;
    return (
      <div className="embed-container">
        <iframe title="Twitch" src={src} allowFullScreen frameBorder="0" />
      </div>
    );
  };

  const KickEmbed = ({ url }) => {
    const channel = url.replace(/https:\/\/kick\.com\//, "");
    const src = `https://player.kick.com/${channel}`;

    // Fallback si Kick no permite embebido
    return (
      <div className="embed-container">
        <iframe
          title="Kick"
          src={src}
          allowFullScreen
          frameBorder="0"
          onError={(e) => {
            e.target.style.display = "none";
            const msg = document.createElement("div");
            msg.className = "embed-error";
            msg.innerHTML = `
              <p>⚠️ Kick no permite mostrar el stream embebido.</p>
              <a href="${url}" target="_blank" rel="noopener noreferrer" class="kick-button">Ver en Kick</a>
            `;
            e.target.parentNode.appendChild(msg);
          }}
        />
      </div>
    );
  };

  const YouTubeLiveEmbed = ({ channelId }) => {
    const src = `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=0`;
    return (
      <div className="embed-container">
        <iframe title="YouTube Live" src={src} allowFullScreen frameBorder="0" />
      </div>
    );
  };

  // --- Render ---
  return (
    <div className="app-container">
      <header className="banner">
        <img src="/Miniatura.png" alt="Avatar" className="avatar" />
        <div className="banner-text">
          <h1>LAGUEARMY</h1>
          <p>Bienvenido a la LagueArmy</p>
        </div>
      </header>

      <div className="buttons">
        <button
          className={showEmbed === "twitch" ? "active" : ""}
          onClick={() => setShowEmbed("twitch")}
        >
          Twitch
        </button>
        <button
          className={showEmbed === "kick" ? "active" : ""}
          onClick={() => setShowEmbed("kick")}
        >
          Kick
        </button>
        <button
          className={showEmbed === "youtube" ? "active" : ""}
          onClick={() => setShowEmbed("youtube")}
        >
          YouTube TinchoLGA
        </button>
        <button
          className={showEmbed === "art" ? "active" : ""}
          onClick={() => setShowEmbed("art")}
        >
          YouTube Artístico
        </button>
      </div>

      <div className="player">
        {showEmbed === "twitch" && <TwitchEmbed url={config.twitchUrl} />}
        {showEmbed === "kick" && <KickEmbed url={config.kickUrl} />}
        {showEmbed === "youtube" && (
          <YouTubeLiveEmbed channelId={config.youtubeChannelId} />
        )}
        {showEmbed === "art" && (
          <YouTubeLiveEmbed channelId={config.youtubeArtChannelId} />
        )}
      </div>

      <section className="videos">
        <h2>Últimos videos</h2>
        <div className="video-grid">
          {latestVideo && (
            <div className="video-card">
              <img src={latestVideo.thumbnail} alt={latestVideo.title} />
              <p>{latestVideo.title}</p>
            </div>
          )}
          {latestArtVideo && (
            <div className="video-card">
              <img src={latestArtVideo.thumbnail} alt={latestArtVideo.title} />
              <p>{latestArtVideo.title}</p>
            </div>
          )}
        </div>
      </section>

      <footer>
        <p>LagueArmy • Hecho con ❤️</p>
      </footer>
    </div>
  );
}

