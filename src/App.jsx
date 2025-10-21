import React, { useEffect, useState } from "react";
import "./index.css";

export default function App() {
  // UI state
  const [selectedPlatform, setSelectedPlatform] = useState("twitch"); // twitch | kick | youtube
  const [currentVideoId, setCurrentVideoId] = useState(null); // video shown in main YouTube player (gaming)
  const [gamingVideoId, setGamingVideoId] = useState(null); // last gaming video id
  const [musicVideoId, setMusicVideoId] = useState(null); // last music video id
  const [loadingGaming, setLoadingGaming] = useState(true);
  const [loadingMusic, setLoadingMusic] = useState(true);
  const [errorGaming, setErrorGaming] = useState(null);
  const [errorMusic, setErrorMusic] = useState(null);

  // Channel IDs (confirmados)
  const GAMING_CHANNEL_ID = "UC5DMwFEs3smhK6WbgDBatZA";
  const MUSIC_CHANNEL_ID = "UCLTue1FuQ4Y0yPYcvuwvdMQ";

  // API keys de entorno (Render / Vite)
  const YT_KEY_GAMING = import.meta.env.VITE_YT_API_KEY_GAMING || "";
  const YT_KEY_MUSIC = import.meta.env.VITE_YT_API_KEY_MUSIC || "";

  // Obtener hostname para Twitch parent (funciona en Render y local)
  const getParentHost = () => {
    if (typeof window !== "undefined" && window.location && window.location.hostname) {
      return window.location.hostname;
    }
    return "localhost";
  };

  // Fetch: último video gaming
  useEffect(() => {
    if (!YT_KEY_GAMING) {
      setErrorGaming("Falta VITE_YT_API_KEY_GAMING");
      setLoadingGaming(false);
      return;
    }

    setLoadingGaming(true);
    setErrorGaming(null);

    const url = `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${GAMING_CHANNEL_ID}&maxResults=1&order=date&type=video&key=${YT_KEY_GAMING}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`YT gaming API ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const id = data?.items?.[0]?.id?.videoId ?? null;
        setGamingVideoId(id);
        if (!currentVideoId && id) setCurrentVideoId(id); // si no hay video principal asignado, usar el último gaming
      })
      .catch((err) => {
        console.error("Error fetching gaming video:", err);
        setErrorGaming(String(err));
      })
      .finally(() => setLoadingGaming(false));
  }, [YT_KEY_GAMING]);

  // Fetch: último video música
  useEffect(() => {
    if (!YT_KEY_MUSIC) {
      setErrorMusic("Falta VITE_YT_API_KEY_MUSIC");
      setLoadingMusic(false);
      return;
    }

    setLoadingMusic(true);
    setErrorMusic(null);

    const url = `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${MUSIC_CHANNEL_ID}&maxResults=1&order=date&type=video&key=${YT_KEY_MUSIC}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`YT music API ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const id = data?.items?.[0]?.id?.videoId ?? null;
        setMusicVideoId(id);
      })
      .catch((err) => {
        console.error("Error fetching music video:", err);
        setErrorMusic(String(err));
      })
      .finally(() => setLoadingMusic(false));
  }, [YT_KEY_MUSIC]);

  // Construir reproductores
  const renderMainPlayer = () => {
    // Twitch player (parent debe coincidir con el dominio del sitio)
    if (selectedPlatform === "twitch") {
      const parent = encodeURIComponent(getParentHost());
      return (
        <div className="player-wrap">
          <iframe
            title="Twitch Player"
            src={`https://player.twitch.tv/?channel=tincholga&parent=${parent}&autoplay=true`}
            allowFullScreen
            frameBorder="0"
            className="video-frame"
          />
        </div>
      );
    }

    // Kick player
    if (selectedPlatform === "kick") {
      // Usamos el embed de Kick
      return (
        <div className="player-wrap">
          <iframe
            title="Kick Player"
            src={`https://kick.com/embed/channel/tinchulis-lga?autoplay=1`}
            allowFullScreen
            frameBorder="0"
            className="video-frame"
          />
        </div>
      );
    }

    // YouTube main (gaming)
    if (selectedPlatform === "youtube") {
      if (!currentVideoId) {
        return (
          <div className="player-wrap">
            <div className="yt-placeholder">No hay video disponible.</div>
          </div>
        );
      }
      return (
        <div className="player-wrap">
          <iframe
            title="YouTube Main"
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            frameBorder="0"
            className="video-frame"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app">
      {/* Header / banner */}
      <header className="banner">
        <img src="/banner.png" alt="Banner" className="banner-img" />
        <div className="header-overlay">
          <img src="/Miniatura.png" alt="Avatar" className="avatar" />
          <h1 className="title-neon">LAGUEARMY</h1>
          <p className="subtitle-glow">Bienvenido a la LagueArmy</p>
        </div>
      </header>

      {/* Links principales */}
      <section className="link-buttons">
        <a href="https://www.twitch.tv/tincholga" target="_blank" rel="noreferrer" className="btn btn-twitch">Twitch</a>
        <a href="https://kick.com/tinchulis-lga" target="_blank" rel="noreferrer" className="btn btn-kick">Kick</a>
        <a href="https://www.youtube.com/@tincholga" target="_blank" rel="noreferrer" className="btn btn-youtube">YouTube</a>
      </section>

      {/* Selector de reproductor */}
      <section className="embed-section">
        <div className="embed-buttons">
          <button
            onClick={() => setSelectedPlatform("twitch")}
            className={`embed-btn ${selectedPlatform === "twitch" ? "active" : ""}`}
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
              // si hay video gaming, lo mostramos en main
              if (gamingVideoId) setCurrentVideoId(gamingVideoId);
            }}
            className={`embed-btn ${selectedPlatform === "youtube" ? "active" : ""}`}
          >
            YouTube (Gaming)
          </button>
        </div>

        {/* Main player */}
        <div className="main-player">{renderMainPlayer()}</div>

        <div className="small-note">Nota: Twitch requiere `parent` igual al dominio (ya incluido automáticamente).</div>
      </section>

      {/* Últimos videos Gaming */}
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
            role="button"
            tabIndex={0}
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

      {/* Últimos videos Música (miniatura con embed dentro) */}
      <section className="latest-videos">
        <h2 className="latest-title">🎵 Últimos Videos Música</h2>

        {loadingMusic ? (
          <p className="muted">Cargando...</p>
        ) : errorMusic ? (
          <p className="muted">Error: {errorMusic}</p>
        ) : musicVideoId ? (
          <div className="music-card">
            {/* Reproducir dentro de la miniatura con controles visibles */}
            <iframe
              title="Último video música"
              src={`https://www.youtube.com/embed/${musicVideoId}?autoplay=1&controls=1&modestbranding=1`}
              className="music-embed"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="muted">No se encontró video de música.</p>
        )}
      </section>

      <footer className="footer">LagueArmy • Hecho con ❤️</footer>
    </div>
  );
}

}
