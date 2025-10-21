import React, {useState, useEffect} from "react";

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
    fileToDataUrl(file, (data) => setState(prev => ({...prev, [key]: data})));
  };

  const channelFromUrl = (url) => {
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/").filter(Boolean);
      return parts[0] || "";
    } catch (e) { return ""; }
  };

  // ✅ Ajuste: Twitch requiere "parent" igual al dominio donde se aloja el sitio
  const TwitchEmbed = ({channel}) => {
    const parent = window.location.hostname || "localhost";
    const safeParent = encodeURIComponent(parent === "localhost" ? "laguearmy-oficial.onrender.com" : parent);
    const channelSlug = channelFromUrl(channel) || channel;
    const src = `https://player.twitch.tv/?channel=${encodeURIComponent(channelSlug)}&parent=${safeParent}&muted=false&autoplay=false`;
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

  const KickEmbed = ({channel}) => {
    const channelSlug = channelFromUrl(channel) || channel;
    const src = `https://kick.com/embed/channel/${encodeURIComponent(channelSlug)}?autoplay=false`;
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

  const YouTubeEmbed = ({url}) => {
    let videoId = null;
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com")) {
        if (u.searchParams.get("v")) videoId = u.searchParams.get("v");
      } else if (u.hostname === "youtu.be") {
        videoId = u.pathname.slice(1);
      }
    } catch (e) { videoId = null; }

    if (!videoId) {
      return (
        <div className="p-4 rounded bg-slate-50">
          <p className="text-sm">No se detectó un ID de video en la URL de YouTube. Pega la URL de un video (ej: https://www.youtube.com/watch?v=VIDEO_ID)</p>
          <a className="mt-2 inline-block text-indigo-600" href={url} target="_blank" rel="noreferrer">Abrir canal de YouTube</a>
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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="rounded-2xl overflow-hidden shadow mb-6">
          <div className="h-44 bg-blue-500 flex items-center justify-center">
            {state.banner ? (
              <img src={state.banner} alt="Banner" className="w-full h-44 object-cover" />
            ) : (
              <div className="text-white text-center">LAGUEARMY</div>
            )}
          </div>
          <div className="p-6 -mt-10 flex items-center gap-4">
            <div className="w-24 h-24 rounded-full ring-4 ring-white overflow-hidden bg-white">
              {state.avatar ? (
                <img src={state.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">Avatar</div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{color: state.color}}>{state.brandName}</h1>
              <div className="text-xl text-slate-700">{state.title}</div>
            </div>
          </div>
        </header>

        <section className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <a href={state.twitch} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-lg bg-[#6441A5] text-white flex items-center gap-2 shadow">Twitch</a>
            <a href={state.kick} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-lg bg-[#0B2545] text-white flex items-center gap-2 shadow">Kick</a>
            <a href={state.youtube} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-lg bg-[#FF0000] text-white flex items-center gap-2 shadow">YouTube</a>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="font-semibold mb-4">Transmisión en vivo</h3>
          <div className="flex gap-3 mb-4">
            <button onClick={() => setState(prev => ({...prev, showEmbed: 'twitch'}))} className={`px-3 py-1 rounded ${state.showEmbed==='twitch' ? 'bg-slate-100' : ''}`}>Twitch</button>
            <button onClick={() => setState(prev => ({...prev, showEmbed: 'kick'}))} className={`px-3 py-1 rounded ${state.showEmbed==='kick' ? 'bg-slate-100' : ''}`}>Kick</button>
            <button onClick={() => setState(prev => ({...prev, showEmbed: 'youtube'}))} className={`px-3 py-1 rounded ${state.showEmbed==='youtube' ? 'bg-slate-100' : ''}`}>YouTube</button>
          </div>

          {state.showEmbed === 'twitch' && <TwitchEmbed channel={state.twitch} />}
          {state.showEmbed === 'kick' && <KickEmbed channel={state.kick} />}
          {state.showEmbed === 'youtube' && <YouTubeEmbed url={state.youtube} />}

          <div className="mt-3 text-xs text-slate-500">
            <strong>Nota:</strong> Twitch requiere el parámetro <code>parent</code> que coincida con tu dominio.
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="font-semibold mb-2">Descripción</h3>
          <p className="text-sm text-slate-700">Este es tu hub personal para streaming. Los visitantes podrán ver tus enlaces y la transmisión en vivo.</p>
        </section>

        <footer className="text-center text-xs text-slate-400 py-6">LagueArmy • Hecho con ❤️</footer>
      </div>

      {/* Panel de edición */}
      <div className="fixed right-6 bottom-6">
        <details className="bg-white rounded-lg shadow p-4 w-80">
          <summary className="cursor-pointer font-semibold">Panel de edición</summary>
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-sm">Nombre marca</label>
              <input className="w-full mt-1 p-2 border rounded" value={state.brandName} onChange={e => setState(prev => ({...prev, brandName: e.target.value}))} />
            </div>
            <div>
              <label className="text-sm">Título / saludo</label>
              <input className="w-full mt-1 p-2 border rounded" value={state.title} onChange={e => setState(prev => ({...prev, title: e.target.value}))} />
            </div>
            <div>
              <label className="text-sm">Color principal</label>
              <input type="color" className="w-full mt-1 h-10 p-1" value={state.color} onChange={e => setState(prev => ({...prev, color: e.target.value}))} />
            </div>
            <div>
              <label className="text-sm">Banner (imagen)</label>
              <input type="file" accept="image/*" className="mt-1" onChange={(e) => handleFile(e, 'banner')} />
            </div>
            <div>
              <label className="text-sm">Avatar (imagen)</label>
              <input type="file" accept="image/*" className="mt-1" onChange={(e) => handleFile(e, 'avatar')} />
            </div>
            <div>
              <label className="text-sm">Twitch URL</label>
              <input className="w-full mt-1 p-2 border rounded" value={state.twitch} onChange={e => setState(prev => ({...prev, twitch: e.target.value}))} />
            </div>
            <div>
              <label className="text-sm">Kick URL</label>
              <input className="w-full mt-1 p-2 border rounded" value={state.kick} onChange={e => setState(prev => ({...prev, kick: e.target.value}))} />
            </div>
            <div>
              <label className="text-sm">YouTube URL</label>
              <input className="w-full mt-1 p-2 border rounded" value={state.youtube} onChange={e => setState(prev => ({...prev, youtube: e.target.value}))} />
            </div>

            <div className="flex gap-2">
              <button onClick={() => { localStorage.removeItem('laguearmy_state'); location.reload(); }} className="px-3 py-1 rounded border">Reset</button>
              <button onClick={() => {
                const exportData = JSON.stringify(state, null, 2);
                const blob = new Blob([exportData], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'laguearmy-settings.json';
                a.click();
              }} className="px-3 py-1 rounded border">Exportar settings</button>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}

