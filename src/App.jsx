import React, { useState, useEffect } from "react";

export default function App() {
  const defaults = {
    brandName: "LAGUEARMY",
    title: "Bienvenido a la LagueArmy",
    color: "#1E90FF",
    banner: "/banner.png", // ✅ tu banner por defecto
    avatar: "/Miniatura.png", // ✅ tu avatar por defecto
    twitch: "https://www.twitch.tv/tincholga/",
    kick: "https://kick.com/tinchulis-lga",
    youtube: "https://www.youtube.com/@tincholga",
    showEmbed: "twitch",
  };

  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem("laguearmy_state");
      return raw ? JSON.parse(raw) : defaults;
    } catch (e) {
      return defaults;
    }
  });

  useEffect(() => {
    localStorage.setItem("laguearmy_state", JSON.stringify(state));
  }, [state]);

  const fileToDataUrl = (file, cb) => {
    const reader = new FileReader();
    reader.onload = (e) => cb(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFile = (ev, key) => {
    const file = ev.target.files[0];
    if (!file) return;
    fileToDataUrl(file, (data) => setState((prev) => ({ ...prev, [key]: data })));
  };

  const channelFromUrl = (url) => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      return parts[0] || "";
    } catch (e) {
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

  const YouTubeEmbed = ({ url }) => {
    let videoId = null;
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        if (u.searchParams.get("v")) videoId = u.searchParams.get("v");
      } else if (u.hostname === "youtu.be") {
        videoId = u.pathname.slice(1);
      }
    } catch (e) {
      videoId = null;
    }

    if (!videoId) {
      return (
        <div className="p-4 rounded bg-slate-50">
          <p className="text-sm">
            No se detectó un ID de video en la URL de YouTube.
          </p>
          <a
            className="mt-2 inline-block text-indigo-600"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            Abrir canal de YouTube
          </a>
        </div>
      );
    }

    const src = `https://www.youtube.com/embed/${videoId}`;
    return (
      <div className="w-full h-64 md:h-96 bg-black rounded overflow-hidden">
        <iframe
          title="YouTube"
          src={src}
          allowFullScreen
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* ✅ ENCABEZADO ACTUALIZADO CON TU BANNER Y AVATAR */}
        <header className="relative rounded-2xl overflow-hidden shadow mb-10">
          <img
            src={state.banner || "/banner.png"}
            alt="Banner"
            className="w-full h-48 object-cover opacity-90"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/30 backdrop-blur-sm">
            <img
              src={state.avatar || "/Miniatura.png"}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-3 bg-slate-800"
            />
            <h1 className="text-3xl font-bold text-cyan-400">
              {state.brandName}
            </h1>
            <p className="text-slate-200">{state.title}</p>
          </div>
        </header>

        {/* BOTONES DE ENLACES */}
        <section className="bg-slate-800/70 backdrop-blur-md rounded-2xl shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={state.twitch}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[#6441A5] text-white shadow"
            >
              Twitch
            </a>
            <a
              href={state.kick}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[#0B2545] text-white shadow"
            >
              Kick
            </a>
            <a
              href={state.youtube}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-lg bg-[#FF0000] text-white shadow"
            >
              YouTube
            </a>
          </div>
        </section>

        {/* EMBEDS DE STREAMING */}
        <section className="bg-slate-800/70 backdrop-blur-md rounded-2xl shadow p-6 mb-6">
          <h3 className="font-semibold mb-4 text-cyan-300">
            Transmisión en vivo
          </h3>
          <div className="flex gap-3 mb-4 justify-center">
            <button
              onClick={() =>
                setState((prev) => ({ ...prev, showEmbed: "twitch" }))
              }
              className={`px-3 py-1 rounded ${
                state.showEmbed === "twitch" ? "bg-cyan-500 text-black" : "bg-slate-600"
              }`}
            >
              Twitch
            </button>
            <button
              onClick={() =>
                setState((prev) => ({ ...prev, showEmbed: "kick" }))
              }
              className={`px-3 py-1 rounded ${
                state.showEmbed === "kick" ? "bg-cyan-500 text-black" : "bg-slate-600"
              }`}
            >
              Kick
            </button>
            <button
              onClick={() =>
                setState((prev) => ({ ...prev, showEmbed: "youtube" }))
              }
              className={`px-3 py-1 rounded ${
                state.showEmbed === "youtube" ? "bg-cyan-500 text-black" : "bg-slate-600"
              }`}
            >
              YouTube
            </button>
          </div>

          {state.showEmbed === "twitch" && <TwitchEmbed channel={state.twitch} />}
          {state.showEmbed === "kick" && <KickEmbed channel={state.kick} />}
          {state.showEmbed === "youtube" && <YouTubeEmbed url={state.youtube} />}

          <div className="mt-3 text-xs text-slate-400 text-center">
            <strong>Nota:</strong> Twitch requiere el parámetro <code>parent</code> coincida con tu dominio.
          </div>
        </section>

        <footer className="text-center text-xs text-slate-500 py-6">
          LagueArmy • Hecho con ❤️
        </footer>
      </div>
    </div>
  );
}
