import React, { useState, useEffect } from "react";

/**
 * Recomendaciones:
 * - Asegurate de que /Miniatura.png exista en public/ o en /dist/
 * - Actualizá los channel URLs o los IDs si cambiás de canal
 */

export default function App() {
  const [latestVideo, setLatestVideo] = useState(null);
  const [latestArtVideo, setLatestArtVideo] = useState(null);
  const [showEmbed, setShowEmbed] = useState("none"); // "twitch" | "kick" | "youtube" | "none"

  // --- Config (modificá si querés) ---
  const config = {
    twitchUrl: "https://www.twitch.tv/tincholga", // cambiar si hace falta
    kickUrl: "https://kick.com/tinchulis-lga",     // cambiar si hace falta
    youtubeChannelId: "UC5DMwFEs3smhK6WbgDBatZA",  // canal gamer (ejemplo)
    youtubeArtChannelId: "UCLTue1FuQ4Y0yPYcvuwvdMQ", // canal artístico
    gApiKey: "AIzaSyDdTnC50jZgmJ7FuAJYVlhUIk6jhIFd8QE", // tu API key
  };

  // --- Obtener últimos videos YouTube (gamer + artístico) ---
  useEffect(() => {
    async function fetchLatest(channelId, setter) {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${config.gApiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=4`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.items && data.items.length > 0) {
          // Tomamos el primer video válido con videoId
          const vid = data.items.find((it) => it.id && it.id.videoId);
          if (vid) {
            setter({
              id: vid.id.videoId,
              title: vid.snippet.title,
              thumb: vid.snippet.thumbnails?.high?.url || vid.snippet.thumbnails?.medium?.url,
            });
          }
        }
      } catch (e) {
        console.error("YouTube fetch error:", e);
      }
    }

    fetchLatest(config.youtubeChannelId, setLatestVideo);
    fetchLatest(config.youtubeArtChannelId, setLatestArtVideo);
  }, []);

  // --- Helpers para embeds ---
  const TwitchEmbed = ({ url }) => {
    const channel = url.replace(/\/$/, "").split("/").pop();
    const parent = window.location.hostname || "localhost";
    const src = `https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=false&autoplay=false`;
    return (
      <div className="embed-wrap">
        <iframe title="twitch" src={src} allowFullScreen frameBorder="0" />
      </div>
    );
  };

    const KickEmbed = ({ channel }) => {
  const channelSlug = channelFromUrl(channel) || channel;
  const cleanSlug = channelSlug.replace(/^https?:\/\/(www\.)?kick\.com\//, "");
  const src = `https://player.kick.com/${encodeURIComponent(cleanSlug)}`;

  return (
    <div className="w-full h-64 md:h-96 bg-black rounded overflow-hidden">
      <iframe
        title="Kick"
        src={src}
        allowFullScreen
        className="w-full h-full"
        frameBorder="0"
      />
    </div>
  );
};



  const YouTubeLiveEmbed = ({ channelId }) => {
    // Embed stream (muestra en vivo si hay)
    const src = `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=0`;
    return (
      <div className="embed-wrap">
        <iframe title="youtube-live" src={src} allowFullScreen frameBorder="0" />
      </div>
    );
  };

  return (
    <div className="page">
      <main className="container">
        {/* BANNER */}
        <section className="banner">
          <div className="banner-inner">
            <h1>Bienvenido a la LagueArmy</h1>
            <p className="sub">Tu central gamer · YouTube · Twitch · Kick</p>
          </div>
          <div className="avatar">
            <img src="/Miniatura.png" alt="avatar" />
          </div>
        </section>

        {/* CONTROLES / BOTONES */}
        <section className="controls">
          <h2 className="brand">LAGUEARMY</h2>
          <p className="small">Bienvenido a la LagueArmy</p>

          <div className="buttons">
            <a className="btn twitch" href={config.twitchUrl} target="_blank" rel="noreferrer">Twitch</a>
            <a className="btn kick" href={config.kickUrl} target="_blank" rel="noreferrer">Kick</a>
            <a className="btn yt" href={`https://www.youtube.com/channel/${config.youtubeChannelId}`} target="_blank" rel="noreferrer">YouTube TinchoLGA</a>
            <a className="btn yta" href={`https://www.youtube.com/channel/${config.youtubeArtChannelId}`} target="_blank" rel="noreferrer">YouTube Artístico</a>
          </div>

          <div className="embed-switch">
            <button onClick={() => setShowEmbed("twitch")} className={showEmbed === "twitch" ? "active" : ""}>Twitch</button>
            <button onClick={() => setShowEmbed("kick")} className={showEmbed === "kick" ? "active" : ""}>Kick</button>
            <button onClick={() => setShowEmbed("youtube")} className={showEmbed === "youtube" ? "active" : ""}>YouTube</button>
            <button onClick={() => setShowEmbed("none")} className={showEmbed === "none" ? "active" : ""}>Ocultar</button>
          </div>

          <div className="embed-area">
            {showEmbed === "twitch" && <TwitchEmbed url={config.twitchUrl} />}
            {showEmbed === "kick" && <KickEmbed url={config.kickUrl} />}
            {showEmbed === "youtube" && <YouTubeLiveEmbed channelId={config.youtubeChannelId} />}
            {showEmbed === "none" && <div className="embed-placeholder">Seleccioná una plataforma para ver la transmisión en vivo</div>}
          </div>
        </section>

        {/* ÚLTIMOS VIDEOS */}
        <section className="videos">
          <h3>Últimos videos</h3>
          <div className="video-grid">
            {latestVideo ? (
              <article className="video-card">
                <a href={`https://www.youtube.com/watch?v=${latestVideo.id}`} target="_blank" rel="noreferrer">
                  <img src={latestVideo.thumb} alt={latestVideo.title} />
                </a>
                <h4>{latestVideo.title}</h4>
              </article>
            ) : (
              <div className="video-loading">Cargando video gamer...</div>
            )}

            {latestArtVideo ? (
              <article className="video-card">
                <a href={`https://www.youtube.com/watch?v=${latestArtVideo.id}`} target="_blank" rel="noreferrer">
                  <img src={latestArtVideo.thumb} alt={latestArtVideo.title} />
                </a>
                <h4>{latestArtVideo.title}</h4>
              </article>
            ) : (
              <div className="video-loading">Cargando video artístico...</div>
            )}
          </div>
        </section>

        <footer className="footer">LagueArmy — Hecho con ❤️</footer>
      </main>
    </div>
  );
}
