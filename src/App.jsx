import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [active, setActive] = useState("twitch");

  return (
    <div className="app-container">
      {/* Banner y avatar */}
      <header className="header-container">
        <img src="/banner.png" alt="Banner" className="banner" />
        <div className="header-overlay">
          <img
            src="/Miniatura.png"
            alt="Avatar"
            className="avatar"
          />
          <h1 className="title-neon">LAGUEARMY</h1>
          <p className="subtitle-glow">Bienvenido a la LagueArmy</p>
        </div>
      </header>

      {/* Botones de enlaces */}
      <section className="link-buttons">
        <a
          href="https://www.twitch.tv/tincholga/"
          target="_blank"
          rel="noreferrer"
          className="btn-neon twitch"
        >
          Twitch
        </a>
        <a
          href="https://kick.com/tinchulis-lga"
          target="_blank"
          rel="noreferrer"
          className="btn-neon kick"
        >
          Kick
        </a>
        <a
          href="https://www.youtube.com/@tincholga"
          target="_blank"
          rel="noreferrer"
          className="btn-neon youtube"
        >
          YouTube
        </a>
      </section>

      {/* Reproductor dinámico */}
      <section className="embed-section">
        <div className="embed-buttons">
          <button
            onClick={() => setActive("twitch")}
            className={`embed-btn ${active === "twitch" ? "active" : ""}`}
          >
            Twitch en vivo
          </button>
          <button
            onClick={() => setActive("kick")}
            className={`embed-btn ${active === "kick" ? "active" : ""}`}
          >
            Kick en vivo
          </button>
          <button
            onClick={() => setActive("youtube")}
            className={`embed-btn ${active === "youtube" ? "active" : ""}`}
          >
            Último video YouTube
          </button>
        </div>

        <div className="embed-container">
          {active === "twitch" && (
            <iframe
              src="https://player.twitch.tv/?channel=tincholga&parent=laguearmy-oficial.onrender.com"
              title="Twitch Stream"
              allowFullScreen
            ></iframe>
          )}
          {active === "kick" && (
            <iframe
              src="https://kick.com/embed/tinchulis-lga"
              title="Kick Stream"
              allowFullScreen
            ></iframe>
          )}
          {active === "youtube" && (
            <iframe
              src="https://www.youtube.com/embed?listType=user_uploads&list=tincholga"
              title="YouTube Video"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </section>

      {/* Últimos videos */}
      <section className="latest-videos">
        <h2 className="latest-title">🎬 Últimos Videos</h2>
        <div className="videos-grid">
          <div className="video-card">
            <iframe
              src="https://www.youtube.com/embed?listType=user_uploads&list=UC5DMwFEs3smhK6WbgDBatZA"
              title="Gaming Channel"
              allowFullScreen
            ></iframe>
            <p>🎮 Canal Gaming</p>
          </div>
          <div className="video-card">
            <iframe
              src="https://www.youtube.com/embed?listType=user_uploads&list=UCLTue1FuQ4Y0yPYcvuwvdMQ"
              title="Music Channel"
              allowFullScreen
            ></iframe>
            <p>🎵 Canal Música</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>LagueArmy • Hecho con ❤️</p>
      </footer>
    </div>
  );
}
