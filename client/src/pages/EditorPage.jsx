import { useState, useEffect, useRef } from "react";
import { Link, useParams , useNavigate } from "react-router-dom";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { socket } from "../socket.js";
import {toast} from 'react-hot-toast';
import axios from "axios";

const EditorPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Anonymous";
  const [clients, setClients] = useState([
    {
      socketId: "local",
      username,
    },
  ]);
  const [language , setLanguage] = useState("javascript");
  const [executionResult, setExecutionResult] = useState({
    stdout: "",
    stderr: "",
    exitCode: null,
  });
  const [isRunning, setIsRunning] = useState(false);

  const codeRef = useRef("");

  useEffect(()=>{
    console.log("Connecting to socket server...")

    socket.connect();

    socket.emit("join",{
      roomId,
      username,
    })

    socket.on("joined" , ({clients, username, socketId}) => {
      setClients(clients);
      console.log(`${username} joined the room. Socket ID: ${socketId}`);
    });

    return () => {
      console.log("Disconnecting from socket server...")
      socket.off("joined");
      socket.disconnect();
    }
  }, []);

  const copyRoomId = async() => {
    try{
      await navigator.clipboard.writeText(roomId)
      toast.success('Room ID copied to clipboard')
    }
    catch(err){
      toast.error('Failed to copy room ID')
    }
  }

  const leaveRoom = () => {
    localStorage.removeItem('username')
    navigate('/')
  }

  const handleRunCode = async () => {
  try {
    setIsRunning(true);
    setExecutionResult({
      stdout: "",
      stderr: "Running code...",
      exitCode: null,
    });
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/run`,
      { code: codeRef.current }
    );
    setExecutionResult(response.data);
  } catch (err) {
    toast.error("Error running code");
    setExecutionResult({
      stdout: "",
      stderr: "Failed to connect to server.",
      exitCode: 1,
    });
  } finally {
    setIsRunning(false);
  }
};

  const languages = [ "javascript", "python", "java", "cpp" ];

  return (
    <div className="min-h-screen overflow-hidden px-5 py-6 text-slate-100 sm:px-8 lg:px-12"
      style={{ background: 'radial-gradient(circle at top left, #3B3664 0%, #07240F 45%, #07240F 100%)' }}>
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col">
          <header className="flex flex-wrap items-center justify-between gap-4 py-2">
            <Link to="/" className="flex items-center gap-3 text-left">
              <span className="grid size-10 place-items-center rounded-lg font-mono text-lg font-black shadow-lg"
                style={{ background: '#09BBC8', color: '#07240F', boxShadow: '0 4px 20px rgba(9,187,200,0.35)' }}>
                C
              </span>
              <span>
                <span className="block text-base font-semibold tracking-wide" style={{ color: '#D9FCED' }}>CODITA</span>
                <span className="block text-xs font-medium" style={{ color: '#09BBC8' }}>Realtime coding rooms</span>
              </span>
              <span className="hidden rounded-full border px-4 py-2 text-sm shadow-sm backdrop-blur sm:inline-flex"
                style={{ border: '1px solid rgba(64,95,250,0.25)', background: 'rgba(64,95,250,0.1)', color: '#D9FCED' }}>
                Secure shared editor
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="rounded-full border px-4 py-2 text-sm shadow-sm backdrop-blur"
                style={{ border: '1px solid rgba(9,187,200,0.3)', background: 'rgba(9,187,200,0.1)', color: '#D9FCED' }}>
                Live Session
              </span>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-4 py-2 rounded-full font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#405FFA', color: '#D9FCED', boxShadow: '0 4px 20px rgba(64,95,250,0.4)' }}
                onMouseEnter={e => { if (!isRunning) e.target.style.background = '#09BBC8'; }}
                onMouseLeave={e => { if (!isRunning) e.target.style.background = '#405FFA'; }}
              >
                  {isRunning ? "Running..." : "Run Code"}
              </button>
              <button onClick={copyRoomId} className="rounded-full border px-4 py-2 text-sm shadow-sm backdrop-blur transition hover:opacity-80"
                style={{ border: '1px solid rgba(64,95,250,0.25)', background: 'rgba(64,95,250,0.1)', color: '#D9FCED' }}>
                Copy ROOM-ID
              </button>
              <button onClick={leaveRoom} className="rounded-full border px-4 py-2 text-sm shadow-sm backdrop-blur transition hover:opacity-80"
                style={{ border: '1px solid rgba(64,95,250,0.25)', background: 'rgba(64,95,250,0.1)', color: '#D9FCED' }}>
                Leave Room
              </button>
            </div>
          </header>

          <main className="grid flex-1 gap-4 py-5 lg:grid-cols-[260px_1fr_300px]">

  {/* Left Sidebar */}
  <aside className="rounded-2xl p-4 shadow-sm backdrop-blur"
    style={{ border: '1px solid rgba(64,95,250,0.2)', background: 'rgba(59,54,100,0.35)' }}>

    {/* Workspace Info */}
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgba(217,252,237,0.4)' }}>
        Workspace
      </p>
      <h1 className="mt-2 text-2xl font-black" style={{ color: '#D9FCED' }}>
        Pair Editor
      </h1>
      <p className="mt-2 text-sm leading-6" style={{ color: 'rgba(217,252,237,0.55)' }}>
        Share context, write together, and keep everyone in the same flow.
      </p>
    </div>

    {/* Connected Users */}
    <div className="rounded-xl p-3" style={{ border: '1px solid rgba(64,95,250,0.2)', background: 'rgba(7,36,15,0.4)' }}>
      <p className="text-sm font-semibold" style={{ color: '#D9FCED' }}>
        Connected
      </p>
      <div className="mt-3 space-y-3">
        {clients.map((client) => (
          <Client key={client.socketId} username={client.username} isCurrentUser={client.socketId === socket.id} />
        ))}
      </div>
    </div>

    <div className="mt-5 rounded-xl p-3" style={{ border: '1px solid rgba(64,95,250,0.2)', background: 'rgba(7,36,15,0.4)' }}>
        <button onClick={copyRoomId} className="w-full rounded-xl px-6 py-2 font-bold shadow-lg transition"
          style={{ background: '#405FFA', color: '#D9FCED', boxShadow: '0 4px 16px rgba(64,95,250,0.35)' }}
          onMouseEnter={e => e.target.style.background = '#09BBC8'}
          onMouseLeave={e => e.target.style.background = '#405FFA'}>
          Copy ROOM-ID
        </button>
    </div>

  </aside>

  {/* Editor Section */}
  <section className="overflow-hidden rounded-2xl shadow-2xl"
    style={{ border: '1px solid rgba(64,95,250,0.2)', background: 'rgba(7,36,15,0.85)' }}>

    {/* Editor Toolbar */}
    <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3"
      style={{ borderColor: 'rgba(64,95,250,0.18)', background: 'rgba(59,54,100,0.25)' }}>

      {/* Left Side */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-rose-400" />
          <span className="size-3 rounded-full bg-amber-300" />
          <span className="size-3 rounded-full" style={{ background: '#09BBC8' }} />
        </div>
        <span className="font-mono text-sm" style={{ color: 'rgba(217,252,237,0.5)' }}>
          main.js
        </span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'rgba(217,252,237,0.5)' }}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-md px-2 py-1 text-sm shadow-sm outline-none"
          style={{
            background: 'rgba(64,95,250,0.15)',
            color: '#D9FCED',
            border: '1px solid rgba(64,95,250,0.3)',
          }}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang} style={{ background: '#07240F', color: '#D9FCED' }}>
              {lang}
            </option>
          ))}
        </select>

        <span className="rounded-md px-2 py-1" style={{ background: 'rgba(9,187,200,0.12)', color: '#09BBC8' }}>
          Auto Sync
        </span>
      </div>

    </div>

    {/* Editor Body */}
    <div className="min-h-[550px] p-5">
      <Editor
          language={language}
          roomId={roomId}
          codeRef={codeRef}
      />
    </div>

  </section>

  {/* Activity Panel */}
  <aside className="grid gap-4">

  {/* Session Card */}
  <div className="rounded-2xl p-4 shadow-sm backdrop-blur"
    style={{ border: '1px solid rgba(64,95,250,0.2)', background: 'rgba(59,54,100,0.35)' }}>
    <p className="text-sm font-semibold" style={{ color: '#D9FCED' }}>
      Session
    </p>
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="rounded-xl p-3" style={{ background: 'rgba(7,36,15,0.5)' }}>
        <span className="block text-2xl font-black" style={{ color: '#D9FCED' }}>
          {clients.length}
        </span>
        <span className="text-xs" style={{ color: 'rgba(217,252,237,0.4)' }}>
          Online
        </span>
      </div>
      <div className="rounded-xl p-3" style={{ background: 'rgba(7,36,15,0.5)' }}>
        <span className="block text-2xl font-black" style={{ color: '#09BBC8' }}>
          Live
        </span>
        <span className="text-xs" style={{ color: 'rgba(217,252,237,0.4)' }}>
          Status
        </span>
      </div>
    </div>
  </div>

  {/* Activity Feed */}
  <div className="rounded-2xl p-4 shadow-sm backdrop-blur"
    style={{ border: '1px solid rgba(64,95,250,0.2)', background: 'rgba(59,54,100,0.35)' }}>
    <p className="text-sm font-semibold" style={{ color: '#D9FCED' }}>
      Activity
    </p>
    <div className="mt-4 space-y-4">
      <div className="flex gap-3">
        <span className="mt-1 size-2 rounded-full" style={{ background: '#09BBC8' }} />
        <div>
          <p className="text-sm" style={{ color: 'rgba(217,252,237,0.8)' }}>
            <span className="font-semibold" style={{ color: '#D9FCED' }}>
              {username}
            </span>{" "}
            created this room
          </p>
          <p className="text-xs" style={{ color: 'rgba(217,252,237,0.35)' }}>
            just now
          </p>
        </div>
      </div>
    </div>
  </div>

</aside>

</main>

<div className="mt-4 rounded-lg p-4" style={{ background: '#07240F', border: '1px solid rgba(64,95,250,0.25)' }}>
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold" style={{ color: '#D9FCED' }}>
      Terminal
    </h3>

    {executionResult.exitCode === 0 && (
      <span className="text-sm" style={{ color: '#09BBC8' }}>
        ✓ Success
      </span>
    )}

    {executionResult.exitCode === 1 && (
      <span className="text-sm text-red-400">
        ✗ Runtime Error
      </span>
    )}

    {executionResult.exitCode === null && isRunning && (
      <span className="text-sm" style={{ color: '#405FFA' }}>
        Running...
      </span>
    )}
  </div>

  <pre className={`whitespace-pre-wrap font-mono text-sm ${
    executionResult.exitCode === 1 ? "text-red-400" : ""
  }`}
    style={{ color: executionResult.exitCode === 1 ? undefined : '#09BBC8' }}
  >
  {executionResult.stdout ||
    executionResult.stderr ||
    "Run your code to see the output..."}
  </pre>
</div>
    </div>

    </div>
  );
};

export default EditorPage;
