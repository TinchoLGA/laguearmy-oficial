import React, { useState, useEffect } from "react";
import "./index.css";

export default function App() {
  // --- Configuración general ---
  const config = {
    twitchUrl: "https://www.twitch.tv/tincholga",
    kickUrl: "https://kick.com/tincholisl-ga",
    youtubeChannelId: "UCSDMfWES3smkNGbpbBAtz1A", // Canal gamer
    youtubeArtChannelId: "UCLTue1FuQ4Y9PVcyuvwdMQ", // Canal artístico
    apiKey: "AIzaSyDdTnC50jZgmJ7FuAJYVlhUIk6jhIFd8QE"
  };

  const [latestVideo, setLatestVideo] = useState(null);
  const [latestArtVideo, setLatestArtVideo] = useState(null);
  const [showEmbed, setShowEmbed] = useState("none");

  // --- Obtener el último video de un canal de YouTube ---
  useEffect(() => {
    async function fetchLatest(channelId, setter) {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${config.apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setter(data.items[0]);
        }
      } catch (err) {
        console.error("Error obteniendo videos:", err);
      }
    }

    fetchLatest(config.youtubeChannelId, setLatestVideo);
    fetchLatest(config.youtubeArtChannelId, setLatestArtVideo);
  }, []);

  // --- Componentes embeds ---
  const TwitchEmbed = () => (
    <iframe
      title="Twitch Stream"
      src="https://player.twitch.tv/?channel=tincholga&parent=laguearmy-oficial.vercel.app&muted=false&autoplay=false"
      allowFullScreen
      frameBorder="0"
      className="embed-frame"
    ></iframe>
  );

  const KickEmbed = () => (
    <iframe
      title="Kick Stream"
      src="https://player.kick.com/tincholisl-ga"
      allowFullScreen
      frameBorder="0"
      className="embed-frame"
    ></iframe>
  );

  const YouTubeEmbed = ({ video }) =>
    video ? (
      <iframe
        title="YouTube Video"
        src={`https://www.youtube.com/embed/${video.id.videoId}`}
        allowFullScreen
        frameBorder="0"
        className="embed-frame"
      ></iframe>
    ) : (
      <p>Cargando video...</p>
    );

  return (
    <div className="app">
      <header className="header">
        <div className="profile">
          <img src="/Miniatura.png" alt="Avatar" className="avatar" />
          <div>
            <h1 className="title">LAGUEARMY</h1>
            <p className="subtitle">Bienvenido a la LagueArmy</p>
          </div>
        </div>
      </header>

      <section className="buttons">
        <button onClick={() => setShowEmbed("twitch")} className="btn twitch">
          Twitch
        </button>
        <button onClick={() => setShowEmbed("kick")} className="btn kick">
          Kick
        </button>
        <button onClick={() => setShowEmbed("youtube")} className="btn youtube">
          YouTube TinchoLGA
        </button>
        <button
          onClick={() => setShowEmbed("youtubeArt")}
          className="btn youtube-art"
        >
          YouTube Artístico
        </button>
        <button onClick={() => setShowEmbed("none")} className="btn hide">
          Ocultar
        </button>
      </section>

      <section className="video-container">
        {showEmbed === "twitch" && <TwitchEmbed />}
        {showEmbed === "kick" && <KickEmbed />}
        {showEmbed === "youtube" && <YouTubeEmbed video={latestVideo} />}
        {showEmbed === "youtubeArt" && (
          <YouTubeEmbed video={latestArtVideo} />
        )}
      </section>

      <section className="latest">
        <h2>Últimos videos</h2>
        <div className="videos">
          {latestVideo && (
            <div className="video-card">
              <img src={latestVideo.snippet.thumbnails.medium.url} alt="Video" />
              <p>{latestVideo.snippet.title}</p>
            </div>
          )}
          {latestArtVideo && (
            <div className="video-card">
              <img
                src={latestArtVideo.snippet.thumbnails.medium.url}
                alt="Video artístico"
              />
              <p>{latestArtVideo.snippet.title}</p>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <p>
          LagueArmy · Hecho con <span className="heart">❤️</span>
        </p>
      </footer>
    </div>
  );
}

