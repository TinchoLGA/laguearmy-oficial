import React, { useState, useEffect } from "react";

export default function App() {
  const [latestVideo, setLatestVideo] = useState(null);
  const [latestArtVideo, setLatestArtVideo] = useState(null);
  const [showEmbed, setShowEmbed] = useState("none");

  // 🔧 Configuración de tus canales
  const config = {
    twitchUrl: "https://www.twitch.tv/tincholga",
    kickUrl: "https://kick.com/tincholislga",
    youtubeChannelId: "UC5DMFwES3smhKGbbpDBta2A",
    youtubeArtChannelId: "UCLTue1FuQ4Vp9PycuvvndMQ",
    apiKey: "AIzaSyDdTnC50jZgmJ7FuAJYVlhUIk6jhIFd8QE",
  };

  // 🧠 Obtener último video de YouTube (Gaming y Artístico)
  useEffect(() => {
    async function fetchLatest(channelId, setter) {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${config.apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setter(data.items[0].id.videoId);
        }
      } catch (e) {
        console.error("Error al obtener videos:", e);
      }
    }

    fetchLatest(config.youtubeChannelId, setLatestVideo);
    fetchLatest(config.youtubeArtChannelId, setLatestArtVideo);
  }, []);

  // 🎥 Componentes de streaming
  const TwitchEmbed = () => (
    <iframe
      title="Twitch Stream"
      src={`https://player.twitch.tv/?channel=${config.twitchUrl.split("/").pop()}&parent=${window.location.hostname}`}
      frameBorder="0"
      allowFullScreen
      className="stream-frame"
    />
  );

  const KickEmbed = () => (
    <iframe
      title="Kick Stream"
      src={`https://player.kick.com/${config.kickUrl.split("/").pop()}`}
      frameBorder="0"
      allowFullScreen
      className="stream-frame"
      onError={(e) => {
        e.target.outerHTML = `<div class='kick-fallback'>
          <p>No se puede cargar el stream de Kick 😔</p>
          <a href='${config.kickUrl}' target='_blank' class='kick-button'>Ver en Kick</a>
        </div>`;
      }}
    />
  );

  const YouTubeEmbed = ({ videoId }) =>
    videoId ? (
      <iframe
        title="YouTube Video"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allowFullScreen
        className="stream-frame"
      />
    ) : (
      <p>Cargando video...</p>
    );

  return (
    <div className="container">
      {/* Banner */}
      <header className="banner">
        <img src="Miniatura.png" alt="Avatar" className="avatar" />
        <div className="title">
          <h1>LAGUEARMY</h1>
          <p>Bienvenido a la LagueArmy</p>
        </div>
      </header>

      {/* Botones de plataformas */}
      <div className="buttons">
        <button onClick={() => setShowEmbed("twitch")} className="btn twitch">
          Twitch
        </button>
        <button onClick={() => setShowEmbed("kick")} className="btn kick">
          Kick
        </button>
        <button onClick={() => setShowEmbed("youtube")} className="btn yt-gamer">
          YouTube TinchoLGA
        </button>
        <button onClick={() => setShowEmbed("art")} className="btn yt-art">
          YouTube Artístico
        </button>
      </div>

      {/* Pantalla del stream */}
      <div className="embed-section">
        {showEmbed === "twitch" && <TwitchEmbed />}
        {showEmbed === "kick" && <KickEmbed />}
        {showEmbed === "youtube" && <YouTubeEmbed videoId={latestVideo} />}
        {showEmbed === "art" && <YouTubeEmbed videoId={latestArtVideo} />}
      </div>

      {/* Últimos videos */}
      <section className="videos">
        <h2>Últimos videos</h2>
        <div className="video-list">
          {latestVideo && (
            <iframe
              title="Último video gaming"
              src={`https://www.youtube.com/embed/${latestVideo}`}
              frameBorder="0"
              allowFullScreen
            />
          )}
          {latestArtVideo && (
            <iframe
              title="Último video artístico"
              src={`https://www.youtube.com/embed/${latestArtVideo}`}
              frameBorder="0"
              allowFullScreen
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>
          LagueArmy · Hecho con <span className="heart">❤</span>
        </p>
      </footer>
    </div>
  );
}

