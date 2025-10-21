import React, { useEffect, useState } from "react";
import "./index.css";

export default function App() {
  const [selectedPlatform, setSelectedPlatform] = useState("twitch");
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [gamingVideoId, setGamingVideoId] = useState(null);
  const [musicVideoId, setMusicVideoId] = useState(null);
  const [loadingGaming, setLoadingGaming] = useState(true);
  const [loadingMusic, setLoadingMusic] = useState(true);
  const [errorGaming, setErrorGaming] = useState(null);
  const [errorMusic, setErrorMusic] = useState(null);

  const GAMING_CHANNEL_ID = "UC5DMwFEs3smhK6WbgDBatZA";
  const MUSIC_CHANNEL_ID = "UCLTue1FuQ4Y0yPYcvuwvdMQ";
  const YT_KEY_GAMING = import.meta.env.VITE_YT_API_KEY_GAMING || "";
  const YT_KEY_MUSIC = import.meta.env.VITE_YT_API_KEY_MUSIC || "";

  const getParentHost = () =>
    typeof window !== "undefined" ? window.location.hostname : "localhost";

  // 🎮 Gaming video
  useEffect(() => {
    if (!YT_KEY_GAMING) {
      setErrorGaming("Falta VITE_YT_API_KEY_GAMING");
      setLoadingGaming(false);
      return;
    }

    setLoadingGaming(true);
    setErrorGaming(null);

    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${GAMING_CHANNEL_ID}&maxResults=1&order=date&type=video&key=${YT_KEY_GAMING}`
    )
      .then((res) => res.json())
      .then((data) => {
        const id = data?.items?.[0]?.id?.videoId;
        setGamingVideoId(id);
        if (!currentVideoId && id) setCurrentVideoId(id);
      })
      .catch((err) => setErrorGaming(err.message))
      .finally(() => setLoadingGaming(false));
  }, [YT_KEY_GAMING]);

  // 🎵 Music video
  useEffect(() => {
    if (!YT_KEY_MUSIC) {
      setErrorMusic("Falta VITE_YT_API_KEY_MUSIC");
      setLoadingMusic(false);
      return;
    }

    setLoadingMusic(true);
    setErrorMusic(null);

    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${MUSIC_CHANNEL_ID}&maxResults=1&order=date&type=video&key=${YT_KEY_MUSIC}`
    )
      .then((res) => res.json())
      .then((data) => {
        const id = data?.items?.[0]?.id?.videoId;
        setMusicVideoId(id);
      })
      .catch((err) => setErrorMusic(err.message))
      .finally(() => setLoadingMusic(false));
  }, [YT_KEY_MUSIC]);

  const renderMainPlayer = () => {
    if (selectedPlatform === "twitch") {
      const parent = encodeURIComponent(getParentHost());
      return (
        <iframe
          title="Twitch Player"
          src={`https://player.twitch.tv/?channel=tincholga&parent=${parent}&autoplay=true`}
          allowFullScreen
          frameBorder="0"
          className="video-frame"
        />
      );
    }

    if (selectedPlatform === "kick") {
      return (
        <iframe
          title="Kick Player"
          src="https://kick.com/embed/channel/tinchulis-lga?autoplay=1"
          allowFullScreen
          frameBorder="0"
          className="video-frame"
        />
      );
    }

    if (selectedPlatform === "youtube" && currentVideoId) {
      return (
        <iframe
          title="YouTube Player"
          src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          className="video-frame"
        />
      );
    }

    return <p className="muted">Seleccioná una plataforma</p>;
  };

  return (
    <div className="app">
      {/* 🧠 Banner */}
      <header className="banner">
        <img src="/banner.png" alt="Banner" className="banner-img" />
        <div className="header-overlay">
          <img src="/Miniatura.png" alt="Avatar" className="avatar" />
          <h1 className="title-neon">LAGUEARMY</h1>
          <p className="subtitle-glow">Bienvenido a la LagueArmy</p>
        </div>
      </header>

      {/* 🌐 Botones principales (van a tus canales) */}
      <section className="link-buttons">
        <a
          href="https://www.twitch.tv/tincholga"
          target="_blank"
          rel="noreferrer"
          className="btn btn-twitch"
        >
          Twitch
        </a>
        <a
          href="https://kick.com/tinchulis-lga"
          target="_blank"
          rel="noreferrer"
          className="btn btn-kick"
        >
          Kick
        </a>
        <a
          href="https://www.youtube.com/@tincholga"
          target="_blank"
          rel="noreferrer"
          className="btn btn-youtube"
        >
          YouTube
        </a>
      </section>

      {/* 🎥 Selector de reproductor */}
      <section className="embed-section">
        <div className="embed-buttons">
          <button
            onClick={() => setSelectedPlatform("twitch")}
            className={`embed-btn ${
              selectedPlatform === "twitch" ? "active" : ""
            }`}
          >
            Twitch
          </button>
          <button
            onClick={() => setSelectedPlatform("kick")}
            className={`embed-btn ${selectedPlatform === "kick" ? "active" : ""}`}
          >
            Kick
          </button>
          <button
            onClick={() => {
              setSelectedPlatform("youtube");
              if (gamingVideoId) setCurrentVideoId(gamingVideoId);
            }}
            className={`embed-btn ${
              selectedPlatform === "youtube" ? "active" : ""
            }`}
          >
            YouTube (Gaming)
          </button>
        </div>

        <div className="main-player">{renderMainPlayer()}</div>
      </section>

      {/* 🎮 Últimos Videos Gaming */}
      <section className="latest-videos">
        <h2 className="latest-title">🎮 Últimos Videos Gaming</h2>
        {loadingGaming ? (
          <p className="muted">Cargando...</p>
        ) : errorGaming ? (
          <p className="muted">Error: {errorGaming}</p>
        ) : gamingVideoId ? (
          <div
            className="video-card"
            onClick={() => {
              setSelectedPlatform("youtube");
              setCurrentVideoId(gamingVideoId);
            }}
          >
            <img
              src={`https://img.youtube.com/vi/${gamingVideoId}/hqdefault.jpg`}
              alt="Último video gaming"
              className="thumb"
            />
          </div>
        ) : (
          <p className="muted">No se encontró video gaming.</p>
        )}
      </section>

      {/* 🎵 Últimos Videos Música */}
      <section className="latest-videos">
        <h2 className="latest-title">🎵 Últimos Videos Música</h2>
        {loadingMusic ? (
          <p className="muted">Cargando...</p>
        ) : errorMusic ? (
          <p className="muted">Error: {errorMusic}</p>
        ) : musicVideoId ? (
          <div className="music-card">
            <iframe
              title="Último video música"
              src={`https://www.youtube.com/embed/${musicVideoId}?autoplay=1&controls=1&modestbranding=1`}
              className="music-embed"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="muted">No se encontró video de música.</p>
        )}
      </section>

      <footer className="footer">© 2025 LagueArmy • Hecho con ❤️ y pasión gamer</footer>
    </div>
  );
}
