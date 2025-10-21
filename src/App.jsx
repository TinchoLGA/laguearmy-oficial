import React, { useState, useEffect } from "react";

const App = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("twitch");
  const [currentVideo, setCurrentVideo] = useState(null);
  const [gamingVideo, setGamingVideo] = useState(null);
  const [musicVideo, setMusicVideo] = useState(null);

  // IDs y claves
  const gamingChannelId = "UC5DMwFEs3smhK6WbgDBatZA"; // Gaming
  const musicChannelId = "UCLTue1FuQ4Y0yPYcvuwvdMQ"; // Música
  const gamingApiKey = import.meta.env.VITE_YT_API_KEY_GAMING;
  const musicApiKey = import.meta.env.VITE_YT_API_KEY_MUSIC;

  // Último video Gaming
  useEffect(() => {
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${gamingChannelId}&maxResults=1&order=date&type=video&key=${gamingApiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const video = data.items?.[0]?.id?.videoId;
        setGamingVideo(video);
        if (!currentVideo) setCurrentVideo(video);
      })
      .catch((err) => console.error("Error al obtener video Gaming:", err));
  }, []);

  // Último video Música
  useEffect(() => {
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${musicChannelId}&maxResults=1&order=date&type=video&key=${musicApiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const video = data.items?.[0]?.id?.videoId;
        setMusicVideo(video);
      })
      .catch((err) => console.error("Error al obtener video Música:", err));
  }, []);

  // Reproductor principal
  const renderPlayer = () => {
    if (selectedPlatform === "twitch") {
      return (
        <iframe
          src="https://player.twitch.tv/?channel=tincholga&parent=laguearmy-oficial.onrender.com&autoplay=true"
          height="500"
          width="100%"
          allowFullScreen
          frameBorder="0"
        ></iframe>
      );
    } else if (selectedPlatform === "kick") {
      return (
        <iframe
          src="https://player.kick.com/tinchulis-lga"
          height="500"
          width="100%"
          allowFullScreen
          frameBorder="0"
        ></iframe>
      );
    } else if (selectedPlatform === "youtube" && currentVideo) {
      return (
        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1&modestbranding=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      );
    }
    return null;
  };

  return (
    <div className="app">
      {/* Banner */}
      <header className="banner">
        <img src="/banner.png" alt="Banner" className="banner-img" />
        <h1 className="title">Bienvenidos a la LagueArmy</h1>
      </header>

      {/* Avatar */}
      <div className="avatar-container">
        <img src="/Miniatura.png" alt="Avatar" className="avatar" />
        <h2 className="neon-text">LAGUEARMY</h2>
      </div>

      {/* Botones de plataformas */}
      <div className="buttons">
        <button onClick={() => setSelectedPlatform("twitch")}>Twitch</button>
        <button onClick={() => setSelectedPlatform("kick")}>Kick</button>
        <button onClick={() => setSelectedPlatform("youtube")}>YouTube</button>
      </div>

      {/* Reproductor principal */}
      <div className="player-container">{renderPlayer()}</div>

      {/* Últimos videos Gaming */}
      <section className="videos-section">
        <h3>🎮 Últimos Videos Gaming</h3>
        {gamingVideo && (
          <div
            className="video-thumbnail"
            onClick={() => {
              setSelectedPlatform("youtube");
              setCurrentVideo(gamingVideo);
            }}
          >
            <img
              src={`https://img.youtube.com/vi/${gamingVideo}/hqdefault.jpg`}
              alt="Último video gaming"
            />
          </div>
        )}
      </section>

      {/* Últimos videos Música */}
      <section className="videos-section">
        <h3>🎵 Últimos Videos Música</h3>
        {musicVideo && (
          <div className="video-thumbnail-music">
            <iframe
              width="300"
              height="170"
              src={`https://www.youtube.com/embed/${musicVideo}?autoplay=1&controls=1&modestbranding=1`}
              title="Último video música"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 LagueArmy • Hecho con 💙 y pasión gamer</p>
      </footer>
    </div>
  );
};

export default App;
