import React, { useState, useEffect } from "react";

export default function App() {
  const defaults = {
    brandName: "LAGUEARMY",
    title: "Bienvenido a la LagueArmy",
    color: "#00BFFF",
    twitch: "https://www.twitch.tv/tincholga/",
    kick: "https://kick.com/tinchulis-lga",
    youtube: "https://www.youtube.com/@tincholga",
    showEmbed: "twitch",
  };

  const [state, setState] = useState(defaults);
  const [latestVideo, setLatestVideo] = useState(null);

  // Obtener el último video de YouTube automáticamente
  useEffect(() => {
    async function fetchLatestVideo() {
      try {
        const channelId = "UC5DMwFEs3smhK6WbgDBatZA";
        const apiKey = "AIzaSyDAVCOXcZ7Mc41EskJlVnAiEaBzUJMY6e0";
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1`
        );
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const video = data.items[0];
          setLatestVideo({
            id: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.high.url,
          });
        }
      } catch (error) {
        console.error("Error al obtener el último video:", error);
      }
    }
    fetchLatestVideo();
  }, []);

  const TwitchEmbed = ({ channel }) => {
    const parent = window.location.hostname || "localhost";
    const channelName = channel.split("/").filter(Boolean).pop();
    const src = `https://player.twitch.tv/?channel=${channelName}&parent=${parent}`;
    return (
      <iframe
        title="Twitch Stream"
        src={src}
        allowFullScreen
        className="w-full h-64 md:h-96 rounded-lg border border-gray-700"
      ></iframe>
    );
  };

  const KickEmbed = ({ channel }) => {
    const channelName = channel.split("/").filter(Boolean).pop();
    const src = `https://player.kick.com/${channelName}`;
    return (
      <iframe
        title="Kick Stream"
        src={src}
        allowFullScreen
        className="w-full h-64 md:h-96 rounded-lg border border-gray-700"
      ></iframe>
    );
  };

  const YouTubeEmbed = ({ url }) => {
    const src = `https://www.youtube.com/embed/live_stream?channel=UC5DMwFEs3smhK6WbgDBatZA`;
    return (
      <iframe
        title="YouTube Stream"
        src={src}
        allowFullScreen
        className="w-full h-64 md:h-96 rounded-lg border border-gray-700"
      ></iframe>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Banner */}
        <header className="relative rounded-2xl overflow-hidden mb-6 shadow-lg">
          <div className="h-56 bg-gradient-to-r from-blue-800 to-indigo-900 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-lg">
              Bienvenido a la LagueArmy
            </h1>
            <p className="text-slate-300 mt-2 text-lg">
              Tu central gamer • YouTube • Twitch • Kick
            </p>
          </div>
          {/* Avatar */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
            <div className="w-28 h-28 rounded-full ring-4 ring-cyan-400 overflow-hidden bg-white shadow-lg">
              <img
                src="/Miniatura.png"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <div className="mt-16 bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
          <h2
            className="text-3xl font-semibold mb-6"
            style={{ color: state.color }}
          >
            {state.brandName}
          </h2>
          <p className="text-slate-300 mb-6">{state.title}</p>

          {/* Botones */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a
              href={state.twitch}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[#6441A5] text-white font-semibold hover:opacity-80"
            >
              Twitch
            </a>
            <a
              href={state.kick}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[#53FC18] text-black font-semibold hover:opacity-90"
            >
              Kick
            </a>
            <a
              href={state.youtube}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[#FF0000] text-white font-semibold hover:opacity-80"
            >
              YouTube
            </a>
          </div>

          {/* Transmisiones */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={() => setState((p) => ({ ...p, showEmbed: "twitch" }))}
              className={`px-3 py-1 rounded ${
                state.showEmbed === "twitch" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Twitch
            </button>
            <button
              onClick={() => setState((p) => ({ ...p, showEmbed: "kick" }))}
              className={`px-3 py-1 rounded ${
                state.showEmbed === "kick" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              Kick
            </button>
            <button
              onClick={() => setState((p) => ({ ...p, showEmbed: "youtube" }))}
              className={`px-3 py-1 rounded ${
                state.showEmbed === "youtube" ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              YouTube
            </button>
          </div>

          {state.showEmbed === "twitch" && <TwitchEmbed channel={state.twitch} />}
          {state.showEmbed === "kick" && <KickEmbed channel={state.kick} />}
          {state.showEmbed === "youtube" && <YouTubeEmbed url={state.youtube} />}
        </div>

        {/* Último Video */}
        <section className="mt-10 bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-4 text-cyan-400">
            🎥 Último video en YouTube
          </h3>
          {latestVideo ? (
            <div>
              <a
                href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={latestVideo.thumbnail}
                  alt={latestVideo.title}
                  className="mx-auto rounded-lg shadow-lg hover:opacity-80 transition"
                />
              </a>
              <p className="mt-3 text-lg font-medium">{latestVideo.title}</p>
            </div>
          ) : (
            <p className="text-slate-400">Cargando el último video...</p>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-slate-500 text-xs py-6">
          LagueArmy • Hecho con ❤️ para la comunidad gamer
        </footer>
      </div>
    </div>
  );
}
