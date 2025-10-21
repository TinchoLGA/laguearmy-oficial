import React, { useState, useEffect } from "react";

export default function App() {
  const [latestVideo, setLatestVideo] = useState(null);
  const [latestArtVideo, setLatestArtVideo] = useState(null);
  const [showEmbed, setShowEmbed] = useState("none");

  // Configuración general
  const config = {
    twitchUrl: "https://www.twitch.tv/tincholga",
    kickUrl: "https://kick.com/tincholis-lga", // <- corregido formato embed
    youtubeChannelId: "UCSMdFWEs3smhKGbpb8BAZ1A", // canal gamer
    youtubeArtChannelId: "UCLTue1FuQ4Y9PvcyuvwdMQ", // canal artístico
    apiKey: "AIzaSyDdTnC50jZgmJ7FuAJYVlhUIk6jhIFd8QE",
    domain: "laguearmy-oficial.vercel.app"
  };

  // Obtener últimos videos
  useEffect(() => {
    async function fetchLatest(channelId, setter) {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${config.apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1`;
        const res = await fetch(url);
        const data = await res.json();
        if (data?.items?.length > 0) {
          const vid = data.items.find((it) => it.id.videoId);
          if (vid) {
            setter({
              id: vid.id.videoId,
              title: vid.snippet.title,
              thumb: vid.snippet.thumbnails.medium.url,
            });
          }
        }
      } catch (err) {
        console.error("Error obteniendo videos:", err);
      }
    }

    fetchLatest(config.youtubeChannelId, setLatestVideo);
    fetchLatest(config.youtubeArtChannelId, setLatestArtVideo);
  }, []);

  // Embeds
  const TwitchEmbed = ({ url }) => {
    const channel = url.split("/").pop();
    const src = `https://player.twitch.tv/?channel=${channel}&parent=${config.domain}&muted=false&autoplay=false`;
    return (
      <div className="embed-wrap">
        <iframe title="Twitch" src={src} allowFullScreen frameBorder="0"></iframe>
      </div>
    );
  };

  const KickEmbed = ({ url }) => {
    const channel = url.split("/").pop();
    const src = `https://kick.com/embed/${channel}`; // ✅ nuevo formato funcional
    return (
      <div className="embed-wrap">
        <iframe title="Kick" src={src} allowFullScreen frameBorder="0"></iframe>
      </div>
    );
  };

  const YouTubeEmbed = ({ videoId }) => {
    const src = `https://www.youtube.com/embed/${videoId}`;
    return (
      <div className="embed-wrap">
        <iframe title="YouTube" src={src} allowFullScreen frameBorder="0"></iframe>
      </div>
    );
  };

  return (
    <div className="root">
      <header className="header">
        <div className="logo">
          <img src="/Miniatura.png" alt="Logo" />
          <h1>LAGUEARMY</h1>
        </div>
        <p>Bienvenido a la LagueArmy</p>
        <div className="buttons">
          <button className="twitch" onClick={() => setShowEmbed("twitch")}>
            Twitch
          </button>
          <button className="kick" onClick={() => setShowEmbed("kick")}>
            Kick
          </button>
          <button className="ytgamer" onClick={() => setShowEmbed("ytgamer")}>
            YouTube TinchoLGA
          </button>
          <button className="ytart" onClick={() => setShowEmbed("ytart")}>
            YouTube Artístico
          </button>
          <button className="hide" onClick={() => setShowEmbed("none")}>
            Ocultar
          </button>
        </div>
      </header>

      <main>
        {showEmbed === "twitch" && <TwitchEmbed url={config.twitchUrl} />}
        {showEmbed === "kick" && <KickEmbed url={config.kickUrl} />}
        {showEmbed === "ytgamer" && latestVideo && (
          <YouTubeEmbed videoId={latestVideo.id} />
        )}
        {showEmbed === "ytart" && latestArtVideo && (
          <YouTubeEmbed videoId={latestArtVideo.id} />
        )}
      </main>

      <section className="videos">
        <h2>Últimos videos</h2>
        <div className="video-list">
          {latestVideo && (
            <a
              href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
              target="_blank"
            >
              <img src={latestVideo.thumb} alt={latestVideo.title} />
              <p>{latestVideo.title}</p>
            </a>
          )}
          {latestArtVideo && (
            <a
              href={`https://www.youtube.com/watch?v=${latestArtVideo.id}`}
              target="_blank"
            >
              <img src={latestArtVideo.thumb} alt={latestArtVideo.title} />
              <p>{latestArtVideo.title}</p>
            </a>
          )}
        </div>
      </section>

      <footer>
        <p>
          LagueArmy · Hecho con <span>❤️</span>
        </p>
      </footer>
    </div>
  );
}

