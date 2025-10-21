import React, { useState, useEffect } from "react";

const App = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("twitch");
  const [currentVideo, setCurrentVideo] = useState(null);
  const [gamingVideo, setGamingVideo] = useState(null);
  const [musicVideo, setMusicVideo] = useState(null);

  // IDs y claves desde las variables de entorno (Render)
  const gamingChannelId = "UC5DMwFEs3smhK6WbgDBatZA";
  const musicChannelId = "UCLTue1FuQ4Y0yPYcvuwvdMQ";
  const gamingApiKey = import.meta.env.VITE_YT_API_KEY_GAMING;
  const musicApiKey = import.meta.env.VITE_YT_API_KEY_MUSIC;

  // Obtener último video Gaming
  useEffect(() => {
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${gamingChannelId}&maxResults=1&order=date&type=video&key=${gamingApiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const video = data.items?.[0]?.id?.videoId;
        setGamingVideo(video);
        if (!currentVideo) setCurrentVideo(video); // por defecto el reproductor arranca con el último video gaming
      })
      .catch((err) => console.error("Error al obtener video Gaming:", err));
  }, []);

  // Obtener último video Música
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

  // Control del reproductor
  const renderPlayer = () => {
    if (selectedPlatform === "twitch") {
      return (
        <iframe
          src="https://player.twitch.tv/?channel=tincholga&parent=render.com&autoplay=true"
          height="500"
          width="100%"
          allowFullScreen
        ></iframe>
      );
    } else if (selectedPlatform === "kick") {
      return (
        <iframe
          src="https://player.kick.com/tinchulis-lga"
          height="500"
          width="100%"
          allowFullScreen
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

      {/* Últimos videos */}
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

      <section className="videos-section">
        <h3>🎵 Últimos Videos Música</h3>
        {musicVideo && (
          <div
            className="video-thumbnail"
            onClick={() => {
              setSelectedPlatform("youtube");
              setCurrentVideo(musicVideo);
            }}
          >
            <img
              src={`https://img.youtube.com/vi/${musicVideo}/hqdefault.jpg`}
              alt="Último video música"
            />
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
