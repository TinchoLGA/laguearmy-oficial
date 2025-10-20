import React, { useState, useEffect } from "react";

export default function App() {
  const defaults = {
    brandName: "LAGUEARMY",
    title: "Bienvenido a la LagueArmy",
    color: "#1E90FF",
    banner: "/banner.png",
    avatar: "",
    twitch: "https://www.twitch.tv/tincholga/",
    kick: "https://kick.com/tinchulis-lga",
    youtube: "https://www.youtube.com/@tincholga",
    youtubeArtist: "https://www.youtube.com/@tincholisoficial",
    showEmbed: "twitch",
  };

  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem("laguearmy_state");
      return raw ? JSON.parse(raw) : defaults;
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    localStorage.setItem("laguearmy_state", JSON.stringify(state));
  }, [state]);

  // === API YouTube para último video ===
  const [latestVideo, setLatestVideo] = useState(null);
  const [latestVideoArtist, setLatestVideoArtist] = useState(null);
  const YT_API_KEY = "AIzaSyDdTnC50jZgmJ7FuAJYVlhUIk6jhIFd8QE";

  useEffect(() => {
    async function fetchLatestVideo(channelId, setter) {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1`
        );
        const data = await res.json();
        const video = data.items?.[0];
        if (video?.id?.videoId) {
          setter({
            id: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.high.url,
          });
        }
      } catch (err) {
        console.error("Error al obtener video:", err);
      }
    }

    fetchLatestVideo("UC5DMwFEs3smhK6WbgDBatZA", setLatestVideo); // Canal Tincholga
    fetchLatestVideo("UCLTue1FuQ4Y0yPYcvuwvdMQ", setLatestVideoArtist); // Canal artístico
  }, []);

  // === Embeds originales ===
  const channelFromUrl = (url) => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      return parts[0] || "";
    } catch {
      return "";
    }
  };

  const TwitchEmbed = ({ channel }) => {
    const parent = window.location.hostname || "localhost";
    const channelSlug = channelFromUrl(channel) || channel;
    const src = `https://player.twitch.tv/?channel=${encodeURIComponent(
      channelSlug
    )}&parent=${encodeURIComponent(parent)}&muted=false&autoplay=false`;
    return (
      <div className="w-full h-64 md:h-96 bg-black rounded overflow-hidden">
        <iframe
          title="Twitch"
          src={src}
          allowFullScreen
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      </div>
    );
  };

  const KickEmbed = ({ channel }) => {
    const channelSlug = channelFromUrl(channel) || channel;
    const src = `https://kick.com/embed/channel/${encodeURIComponent(
      channelSlug
    )}?autoplay=false`;
    return (
      <div className="w-full h-64 md:h-96 bg-black rounded overflow-hidden">
        <iframe
          title="Kick"
          src={src}
          allowFullScreen
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="rounded-2xl overflow-hidden shadow mb-6 relative">
          <div className="h-44 bg-gradient-to-r from-green-700 via-black to-purple-700 flex items-center justify-center">
            {state.banner ? (
              <img
                src={state.banner}
                alt="Banner"
                className="w-full h-44 object-cover opacity-80"
              />
            ) : (
              <h1 className="text-3xl font-bold text-green-400">
                Bienvenido a LagueArmy
              </h1>
            )}
          </div>
          <div className="p-6 -mt-10 flex items-center gap-4">
            <div className="w-24 h-24 rounded-full ring-4 ring-green-500 overflow-hidden bg-gray-900">
              {state.avatar ? (
                <img
                  src={state.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Avatar
                </div>
              )}
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: state.color }}
              >
                {state.brandName}
              </h1>
              <div className="text-xl text-gray-300">{state.title}</div>
            </div>
          </div>
        </header>

        {/* === Botones === */}
        <section className="bg-gray-900 rounded-2xl shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={state.twitch}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[#6441A5] text-white shadow hover:opacity-90"
            >
              Twitch
            </a>
            <a
              href={state.kick}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[#52FF00] text-black font-semibold shadow hover:opacity-90"
            >
              Kick
            </a>
            <a
              href={state.youtube}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[#FF0000] text-white shadow hover:opacity-90"
            >
              YouTube Tincholga
            </a>
            <a
              href={state.youtubeArtist}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[#FF4081] text-white shadow hover:opacity-90"
            >
              YouTube Artístico
            </a>
          </div>
        </section>

        {/* === Últimos videos === */}
        <section className="bg-gray-900 rounded-2xl shadow p-6 mb-6">
          <h3 className="font-semibold mb-4 text-lg text-green-400">
            Últimos videos
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {latestVideo && (
              <a
                href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg overflow-hidden bg-black hover:opacity-90"
              >
                <img
                  src={latestVideo.thumbnail}
                  alt={latestVideo.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 text-sm">{latestVideo.title}</div>
              </a>
            )}
            {latestVideoArtist && (
              <a
                href={`https://www.youtube.com/watch?v=${latestVideoArtist.id}`}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg overflow-hidden bg-black hover:opacity-90"
              >
                <img
                  src={latestVideoArtist.thumbnail}
                  alt={latestVideoArtist.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 text-sm">{latestVideoArtist.title}</div>
              </a>
            )}
          </div>
        </section>

        <footer className="text-center text-xs text-gray-500 py-6">
          LagueArmy • Hecho con ❤️
        </footer>
      </div>
    </div>
  );
}

