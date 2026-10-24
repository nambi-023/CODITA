import {v4 as uuidV4} from 'uuid'
import {useState} from 'react'
import {toast} from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'

const Home = () => {
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')
  const navigate = useNavigate()
  const createNewRoom = (e) => {
    e.preventDefault()
    const id = uuidV4()
    setRoomId(id)
    toast.success('Created a new room')
  }

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('Please enter a room ID and username')
      return
    }
    localStorage.setItem('username', username)
    navigate(`/editor/${roomId}`)
  }
  return (
    <div className="min-h-screen overflow-hidden px-5 py-6 text-slate-100 sm:px-8 lg:px-12"
      style={{ background: 'radial-gradient(circle at top left, #3B3664 0%, #07240F 50%, #07240F 100%)' }}>
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between py-2">
          <a href="/" className="flex items-center gap-3 text-left">
            <span className="grid size-10 place-items-center rounded-lg font-mono text-lg font-black text-[#07240F] shadow-lg"
              style={{ background: '#09BBC8', boxShadow: '0 4px 24px rgba(9,187,200,0.3)' }}>
              C
            </span>
            <span>
              <span className="block text-base font-semibold tracking-wide text-[#D9FCED]">CODITA</span>
              <span className="block text-xs font-medium" style={{ color: '#09BBC8' }}>Realtime coding rooms</span>
            </span>
          </a>

          <span className="hidden rounded-full border border-white/10 px-4 py-2 text-sm shadow-sm backdrop-blur sm:inline-flex"
            style={{ background: 'rgba(64,95,250,0.12)', color: '#D9FCED' }}>
            Secure shared editor
          </span>
        </header>

        <main className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr] lg:py-16">
          <section className="text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
              style={{ border: '1px solid rgba(9,187,200,0.3)', background: 'rgba(9,187,200,0.1)', color: '#D9FCED' }}>
              <span className="size-2 rounded-full" style={{ background: '#09BBC8', boxShadow: '0 0 16px rgba(9,187,200,0.8)' }} />
              Start a session in seconds
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl"
              style={{ color: '#D9FCED' }}>
              Build together in one focused coding room.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 sm:text-lg"
              style={{ color: 'rgba(217,252,237,0.7)' }}>
              Drop into a shared workspace, review ideas live, and keep the conversation close to the code.
            </p>

            <div className="mt-8 w-full max-w-xl rounded-2xl p-4 shadow-2xl backdrop-blur sm:p-5"
              style={{ border: '1px solid rgba(64,95,250,0.25)', background: 'rgba(59,54,100,0.45)' }}>
              <label htmlFor="room-id" className="mb-3 block text-sm font-semibold" style={{ color: '#D9FCED' }}>
                Paste invitation code
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="room-id"
                  type="text"
                  className="min-h-12 flex-1 rounded-xl border px-4 text-base outline-none transition"
                  style={{
                    border: '1px solid rgba(64,95,250,0.3)',
                    background: 'rgba(7,36,15,0.7)',
                    color: '#D9FCED',
                  }}
                  placeholder="Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#09BBC8'}
                  onBlur={e => e.target.style.borderColor = 'rgba(64,95,250,0.3)'}
                />
                <input
                  id="username"
                  type="text"
                  className="min-h-12 flex-1 rounded-xl border px-4 text-base outline-none transition"
                  style={{
                    border: '1px solid rgba(64,95,250,0.3)',
                    background: 'rgba(7,36,15,0.7)',
                    color: '#D9FCED',
                  }}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#09BBC8'}
                  onBlur={e => e.target.style.borderColor = 'rgba(64,95,250,0.3)'}
                />
                <button
                  onClick={joinRoom}
                  className="min-h-12 rounded-xl px-6 font-bold shadow-lg transition"
                  style={{ background: '#405FFA', color: '#D9FCED', boxShadow: '0 4px 20px rgba(64,95,250,0.4)' }}
                  onMouseEnter={e => e.target.style.background = '#09BBC8'}
                  onMouseLeave={e => e.target.style.background = '#405FFA'}
                >
                  Join Room
                </button>
              </div>

              <p className="mt-4 text-sm" style={{ color: 'rgba(217,252,237,0.55)' }}>
                No invite yet?{' '}
                <a onClick={createNewRoom} href="/" className="font-semibold underline underline-offset-4 transition"
                  style={{ color: '#09BBC8', textDecorationColor: 'rgba(9,187,200,0.4)' }}>
                  Create a new room
                </a>
              </p>
            </div>
          </section>

          <section className="relative">
            <div className="absolute -inset-6 rounded-[2rem] blur-3xl" style={{ background: 'rgba(64,95,250,0.15)' }} />
            <div className="relative overflow-hidden rounded-2xl text-left shadow-2xl"
              style={{ border: '1px solid rgba(64,95,250,0.2)', background: 'rgba(7,36,15,0.85)' }}>
              <div className="flex items-center justify-between border-b px-4 py-3"
                style={{ borderColor: 'rgba(64,95,250,0.15)', background: 'rgba(59,54,100,0.2)' }}>
                <div className="flex gap-2">
                  <span className="size-3 rounded-full bg-rose-400" />
                  <span className="size-3 rounded-full bg-amber-300" />
                  <span className="size-3 rounded-full" style={{ background: '#09BBC8' }} />
                </div>
                <span className="rounded-md px-2 py-1 text-xs font-semibold"
                  style={{ background: 'rgba(9,187,200,0.15)', color: '#09BBC8' }}>
                  3 online
                </span>
              </div>

              <div className="space-y-4 p-5 font-mono text-sm leading-7 sm:p-6"
                style={{ color: 'rgba(217,252,237,0.7)' }}>
                <p><span className="text-slate-600">01</span> <span style={{ color: '#405FFA' }}>const</span> room = <span style={{ color: '#09BBC8' }}>'codita'</span></p>
                <p><span className="text-slate-600">02</span> <span style={{ color: '#405FFA' }}>function</span> pairProgram<span className="text-slate-500">()</span> {'{'}</p>
                <p><span className="text-slate-600">03</span> &nbsp;&nbsp;<span style={{ color: '#D9FCED' }}>shareCursor</span><span className="text-slate-500">(</span>room<span className="text-slate-500">)</span></p>
                <p><span className="text-slate-600">04</span> &nbsp;&nbsp;<span style={{ color: '#D9FCED' }}>syncIdeas</span><span className="text-slate-500">()</span></p>
                <p><span className="text-slate-600">05</span> {'}'}</p>
              </div>

              <div className="grid grid-cols-3 border-t text-center"
                style={{ borderColor: 'rgba(64,95,250,0.15)' }}>
                <div className="p-4">
                  <span className="block text-lg font-bold" style={{ color: '#D9FCED' }}>Live</span>
                  <span className="text-xs text-slate-500">editing</span>
                </div>
                <div className="border-x p-4" style={{ borderColor: 'rgba(64,95,250,0.15)' }}>
                  <span className="block text-lg font-bold" style={{ color: '#D9FCED' }}>Fast</span>
                  <span className="text-xs text-slate-500">rooms</span>
                </div>
                <div className="p-4">
                  <span className="block text-lg font-bold" style={{ color: '#D9FCED' }}>Clean</span>
                  <span className="text-xs text-slate-500">review</span>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="text-center text-sm text-slate-500">
          Made with ❤️ by nambi_023.
        </footer>
      </div>
    </div>
  )
}

export default Home
