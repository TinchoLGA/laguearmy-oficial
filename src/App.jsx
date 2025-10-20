import React, { useState, useEffect } from "react";

export default function App() {
  const defaults = {
    brandName: "LAGUEARMY",
    title: "Bienvenido a la LagueArmy",
    color: "#00BFFF",
    twitch: "https://www.twitch.tv/tincholga/",
    kick: "https://kick.com/tinchulis-lga",
    youtube: "https://www.youtube.com/@tincholga",
    youtubeArt: "https://www.youtube.com/@TinchoHH",
    showEmbed: "twitch",
  };

  const [state, setState] = useState(defaults);
  const [latestVideo, setLatestVideo] = useState(null);
  const [latestArtVideo, setLatestArtVideo] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const apiKey = "AIzaSyDdTnC50jZgmJ7FuAJYVlhUIk6jhIFd8QE";

        // Canal gamer
        const res1 = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=UC5DMwFEs3smhK6WbgDBatZA&part=snippet,id&order=date&maxResults=1`
        );
        const data1 = await res1.json();
        if (data1.items?.length) {
          const video = data1.items[0];
          setLatestVideo({
            id: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.high.url,
          });
        }

        // Canal artístico
        const res2 = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=UCLTue1FuQ4Y0yPYcvuwvdMQ&part=snippet,id&order=date&maxResults=1`
        );
        const data2 = await res2.json();
        if (data2.items?.length) {
          const video = data2.items[0];
          setLatestArtVideo({
            id: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.high.url,
          });
        }
      } catch (error) {
        console.error("Error al obtener los videos:", error);
      }
    }
    fetchVideos();
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

  const YouTubeEmbed = ({ channelId }) => {
    const src = `https://www.youtube.com/embed/live_stream?channel=${channelId}`;
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

        {/* Info */}
        <div className="mt-16 bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-3xl font-semibold mb-6" style={{ color: state.color }}>
            {state.brandName}
          </h2>
          <p className="text-slate-300 mb-6">{state.title}</p>

          {/* Botones */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href={state.twitch} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-lg bg-[#6441A5] text-white font-semibold hover:opacity-80">Twitch</a>
            <a href={state.kick} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-lg bg-[#53FC18] text-black font-semibold hover:opacity-90">Kick</a>
            <a href={state.youtube} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-lg bg-[#FF0000] text-white font-semibold hover:opacity-80">YouTube Gaming</a>
            <a href={state.youtubeArt} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-lg bg-[#FF66CC] text-white font-semibold hover:opacity-90">YouTube Artístico</a>
          </div>

          {/* Transmisiones */}
          <div className="flex justify-center gap-3 mb-4">
            <button onClick={() => setState((p) => ({ ...p, showEmbed: "twitch" }))} className={`px-3 py-1 rounded ${state.showEmbed === "twitch" ? "bg-blue-600" : "bg-gray-700"}`}>Twitch</button>
            <button onClick={() => setState((p) => ({ ...p, showEmbed: "kick" }))} className={`px-3 py-1 rounded ${state.showEmbed === "kick" ? "bg-blue-600" : "bg-gray-700"}`}>Kick</button>
            <button onClick={() => setState((p) => ({ ...p, showEmbed: "youtube" }))} className={`px-3 py-1 rounded ${state.showEmbed === "youtube" ? "bg-blue-600" : "bg-gray-700"}`}>YouTube</button>
          </div>

          {state.showEmbed === "twitch" && <TwitchEmbed channel={state.twitch} />}
          {state.showEmbed === "kick" && <KickEmbed channel={state.kick} />}
          {state.showEmbed === "youtube" && <YouTubeEmbed channelId="UC5DMwFEs3smhK6WbgDBatZA" />}
        </div>

        {/* Últimos Videos */}
        <section className="mt-10 bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-4 text-cyan-400">🎥 Últimos videos</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {latestVideo ? (
              <div>
                <a href={`https://www.youtube.com/watch?v=${latestVideo.id}`} target="_blank" rel="noreferrer">
                  <img src={latestVideo.thumbnail} alt={latestVideo.title} className="mx-auto rounded-lg shadow-lg hover:opacity-80 transition" />
                </a>
                <p className="mt-3 text-lg font-medium">{latestVideo.title}</p>
              </div>
            ) : (
              <p className="text-slate-400">Cargando video gamer...</p>
            )}

            {latestArtVideo ? (
              <div>
                <a href={`https://www.youtube.com/watch?v=${latestArtVideo.id}`} target="_blank" rel="noreferrer">
                  <img src={latestArtVideo.thumbnail} alt={latestArtVideo.title} className="mx-auto rounded-lg shadow-lg hover:opacity-80 transition" />
                </a>
                <p className="mt-3 text-lg font-medium">{latestArtVideo.title}</p>
              </div>
            ) : (
              <p className="text-slate-400">Cargando video artístico...</p>
            )}
          </div>
        </section>

        <footer className="text-center text-slate-500 text-xs py-6">
          LagueArmy • Hecho con ❤️ para la comunidad gamer
        </footer>
      </div>
    </div>
  );
}
