
import React, { useEffect, useMemo, useRef, useState } from "react";

// Production-clean version for Vercel deployment
// Paste your Microsoft Form URL below after creating the form.
const GAME_DURATION_SECONDS = 25 * 60;

const DEFAULT_MISSIONS = [
  {
    id: "m01",
    title: "MISSION FILE 01",
    codename: "The Endless Library",
    answer: "internet",
    type: "General Knowledge",
    points: 100,
    hintCost: 20,
    hint: "It connects billions of pages, people, and systems globally.",
    clue: `Every day it grows without asking permission.

It has no librarian.
No closing hours.
No final edition.

Yet it quietly teaches almost every AI model.

Find its name.

Password = One Word`
  },
  {
    id: "m02",
    title: "MISSION FILE 02",
    codename: "Digital Companion",
    answer: "copilot",
    type: "Microsoft Workplace AI",
    points: 100,
    hintCost: 20,
    hint: "It is Microsoft's AI assistant inside work apps.",
    clue: `Some assistants wait until you ask.

This one prepares before you do.

It writes.
It summarizes.
It creates.
It even attends your meetings.

It belongs inside Microsoft's workplace.

Password = One Word`
  },
  {
    id: "m03",
    title: "MISSION FILE 03",
    codename: "Ancient Messenger",
    answer: "hello",
    type: "Caesar Cipher",
    points: 120,
    hintCost: 25,
    hint: "Shift each letter three steps backward.",
    clue: `Long before computers,
people protected messages by shifting letters.

One famous ruler made this technique popular.

Encrypted Message

KHOOR

Restore it.

Password = Original Word`
  },
  {
    id: "m04",
    title: "MISSION FILE 04",
    codename: "Digital Language",
    answer: "roche",
    type: "Base64",
    points: 120,
    hintCost: 25,
    hint: "This is Base64. Decode the text.",
    clue: `Computers sometimes speak in a language humans rarely read.

It's not encryption.

It's simply another representation.

Uk9DSEU=

Identify the organization.

Password = One Word`
  },
  {
    id: "m05",
    title: "MISSION FILE 05",
    codename: "Logic Gate",
    answer: "fortytwo",
    type: "Pattern Recognition",
    points: 140,
    hintCost: 30,
    hint: "The number is 42. The vault accepts letters only, not digits.",
    clue: `Some doors open with keys.

This one opens with patterns.

2
6
12
20
30
?

Numbers won't help.

The vault only understands words.

Password = One Word`
  },
  {
    id: "m06",
    title: "MISSION FILE 06",
    codename: "Future Fragment",
    answer: "future",
    type: "Anagram",
    points: 100,
    hintCost: 20,
    hint: "Rearrange the letters into a word about tomorrow.",
    clue: `Recovered Fragment

TEUNRFU

Rebuild the word.

It represents tomorrow,
innovation,
and progress.

Password = One Word`
  },
  {
    id: "m07",
    title: "MISSION FILE 07",
    codename: "Binary Signal",
    answer: "ai",
    type: "Binary",
    points: 120,
    hintCost: 25,
    hint: "Each group is an ASCII character.",
    clue: `01000001 01001001

Machines understand this language immediately.

Humans usually ask AI.

Decode the message.

Password = One Word`
  },
  {
    id: "m08",
    title: "MISSION FILE 08",
    codename: "QR Mystery",
    answer: "qrcode",
    type: "Visual Tech",
    points: 100,
    hintCost: 20,
    hint: "People scan it using a camera.",
    clue: `A square full of tiny blocks.

People don't read it.

They scan it.

Identify its common name.

Password = One Word`
  },
  {
    id: "m09",
    title: "MISSION FILE 09",
    codename: "Missing Planet",
    answer: "mars",
    type: "Science",
    points: 90,
    hintCost: 15,
    hint: "The red planet.",
    clue: `The fourth planet from the Sun.

Scientists dream of living there.

AI is helping make that dream possible.

Password = One Word`
  },
  {
    id: "m10",
    title: "MISSION FILE 10",
    codename: "Cloud Clue",
    answer: "cloud",
    type: "Cloud Computing",
    points: 100,
    hintCost: 20,
    hint: "It is computing power delivered through the internet.",
    clue: `It stores files.

Runs applications.

Scales endlessly.

Yet you cannot touch it.

Identify this technology.

Password = One Word`
  },
  {
    id: "m11",
    title: "MISSION FILE 11",
    codename: "Robot Brain",
    answer: "model",
    type: "AI Fundamentals",
    points: 120,
    hintCost: 25,
    hint: "It learns patterns from data.",
    clue: `Without memory,
reasoning disappears.

Without learning,
intelligence stops growing.

What powers modern AI?

Password = One Word`
  },
  {
    id: "m12",
    title: "MISSION FILE 12",
    codename: "Digital Fingerprint",
    answer: "hash",
    type: "Cybersecurity",
    points: 130,
    hintCost: 25,
    hint: "Security teams use it to verify file integrity.",
    clue: `Every file has one.

Change a single character,
and it changes completely.

Security teams trust it.

Password = One Word`
  },
  {
    id: "m13",
    title: "MISSION FILE 13",
    codename: "Secret Key",
    answer: "asymmetric",
    type: "Cryptography",
    points: 150,
    hintCost: 35,
    hint: "Public key and private key cryptography.",
    clue: `One key locks.

Another unlocks.

They never have to be identical.

What type of cryptography uses this idea?

Password = One Word`
  },
  {
    id: "m14",
    title: "MISSION FILE 14",
    codename: "Silent Assistant",
    answer: "chatbot",
    type: "Conversational AI",
    points: 100,
    hintCost: 20,
    hint: "This conversation itself is an example.",
    clue: `You ask.

It predicts.

You refine.

It improves.

This conversation itself is an example.

What are you interacting with?

Password = One Word`
  },
  {
    id: "m15",
    title: "MISSION FILE 15",
    codename: "Final Activation",
    answer: "ai",
    type: "Final Reveal",
    points: 200,
    hintCost: 0,
    hint: "Look at the theme of every mission.",
    clue: `No password.
No cipher.
No pattern.

Look back.

Every answer you've discovered has one thing in common.

Together they describe the technology that solved every challenge in this mission.

What is it?

Password = Two Letters`
  }
];

const normalize = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const formatTime = (seconds) => {
  const safe = Math.max(0, seconds);
  const mins = Math.floor(safe / 60).toString().padStart(2, "0");
  const secs = Math.floor(safe % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

function beep(type = "success") {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = type === "success" ? 760 : type === "error" ? 180 : 520;
    gain.gain.value = 0.04;
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      ctx.close();
    }, type === "error" ? 160 : 120);
  } catch {
    // Audio may be blocked by browser policy. Game still works.
  }
}

function QRVisual() {
  const cells = [
    1,1,1,1,1,0,1,0,1,1,
    1,0,0,0,1,0,0,1,0,1,
    1,0,1,0,1,1,1,0,0,1,
    1,0,0,0,1,0,1,1,0,1,
    1,1,1,1,1,0,0,1,1,1,
    0,0,1,0,0,1,1,0,1,0,
    1,0,1,1,1,0,1,0,0,1,
    0,1,0,0,1,1,0,1,1,0,
    1,0,1,1,0,1,0,0,1,1,
    1,1,0,1,1,0,1,1,0,1
  ];
  return (
    <div className="mx-auto grid h-36 w-36 grid-cols-10 gap-1 rounded-xl bg-white p-3 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
      {cells.map((cell, index) => <div key={index} className={cell ? "rounded-sm bg-slate-950" : "rounded-sm bg-white"} />)}
    </div>
  );
}

function ConfettiBlast({ active }) {
  if (!active) return null;
  const colors = ["#00ffff", "#a855f7", "#f97316", "#22c55e", "#fde047", "#ec4899"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 85 }).map((_, index) => (
        <span
          key={index}
          className="absolute top-[-20px] h-3 w-2 rounded-sm confetti-piece"
          style={{
            left: `${(index * 37) % 100}%`,
            background: colors[index % colors.length],
            animationDelay: `${(index % 12) * 0.07}s`,
            animationDuration: `${2 + (index % 8) * 0.18}s`
          }}
        />
      ))}
    </div>
  );
}

export default function AspireAIEscapeQuestProductionClean() {
  const [screen, setScreen] = useState("briefing");
  const [missions] = useState(DEFAULT_MISSIONS);
  const [current, setCurrent] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [usedHints, setUsedHints] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(GAME_DURATION_SECONDS);
  const [timerRunning, setTimerRunning] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const inputRef = useRef(null);

  const currentMission = missions[current];
  const maxScore = useMemo(() => missions.reduce((sum, mission) => sum + Number(mission.points || 0), 0), [missions]);
  const completedCount = screen === "complete" ? missions.length : current;
  const progress = missions.length ? Math.round((completedCount / missions.length) * 100) : 0;
  const performanceScore = maxScore ? Math.round((score / maxScore) * 100) : 0;

  useEffect(() => {
    if (!timerRunning || screen !== "game") return;
    const timer = setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          clearInterval(timer);
          setTimerRunning(false);
          setScreen("complete");
          setMessage("Time expired. Please screenshot the final result if visible.");
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerRunning, screen]);

  useEffect(() => {
    if (screen === "game") setTimeout(() => inputRef.current?.focus(), 60);
  }, [screen, current]);

  const startGame = () => {
    setCurrent(0);
    setAnswer("");
    setScore(0);
    setUsedHints([]);
    setAttempts(0);
    setMessage("");
    setSecondsLeft(GAME_DURATION_SECONDS);
    setTimerRunning(true);
    setScreen("game");
  };

  const finishGame = (finalScore) => {
    setTimerRunning(false);
    setScore(finalScore);
    setScreen("complete");
    setConfetti(true);
    beep("success");
    setTimeout(() => setConfetti(false), 2600);
  };

  const submitAnswer = () => {
    if (!currentMission) return;
    const expected = normalize(currentMission.answer);
    const actual = normalize(answer);

    if (!actual) {
      setMessage("Enter a password to unlock this mission.");
      return;
    }

    if (actual === expected) {
      const hintPenalty = usedHints.includes(currentMission.id) ? Number(currentMission.hintCost || 0) : 0;
      const attemptPenalty = Math.min(attempts * 5, 25);
      const earned = Math.max(10, Number(currentMission.points || 0) - hintPenalty - attemptPenalty);
      const nextScore = score + earned;
      setScore(nextScore);
      setMessage(`ACCESS GRANTED +${earned} points`);
      setConfetti(true);
      beep("success");
      setTimeout(() => setConfetti(false), 1500);

      setTimeout(() => {
        if (current >= missions.length - 1) {
          finishGame(nextScore);
        } else {
          setCurrent((value) => value + 1);
          setAnswer("");
          setAttempts(0);
          setMessage("");
        }
      }, 850);
    } else {
      setAttempts((value) => value + 1);
      setMessage("ACCESS DENIED. Re-check the mission file.");
      beep("error");
    }
  };

  const revealHint = () => {
    if (!currentMission) return;
    if (!usedHints.includes(currentMission.id)) setUsedHints((items) => [...items, currentMission.id]);
    setMessage(`Hint: ${currentMission.hint}`);
  };

  const copyResult = async () => {
    const resultText = `AGENT AI: MISSION ZERO\nTeam: ${teamName || "Unnamed Team"}\nRaw Score: ${score} / ${maxScore}\nPerformance Score: ${performanceScore}%\nTime Left: ${formatTime(secondsLeft)}`;
    try {
      await navigator.clipboard.writeText(resultText);
      setMessage("Result copied. Now take a screenshot and submit.");
    } catch {
      setMessage("Copy blocked by browser. Please take screenshot directly.");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <style>{`
        @keyframes gridMove { from { background-position: 0 0; } to { background-position: 80px 80px; } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 24px rgba(34,211,238,.20); } 50% { box-shadow: 0 0 48px rgba(168,85,247,.45); } }
        @keyframes fall { 0% { transform: translateY(-12vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(115vh) rotate(720deg); opacity: 0; } }
        .cyber-grid { background-image: linear-gradient(rgba(34,211,238,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.08) 1px, transparent 1px); background-size: 42px 42px; animation: gridMove 20s linear infinite; }
        .glass { background: linear-gradient(135deg, rgba(15,23,42,.92), rgba(30,41,59,.72)); border: 1px solid rgba(125,211,252,.25); backdrop-filter: blur(14px); }
        .confetti-piece { animation-name: fall; animation-timing-function: linear; animation-fill-mode: forwards; }
      `}</style>

      <ConfettiBlast active={confetti} />
      <div className="cyber-grid fixed inset-0 opacity-70" />
      <div className="fixed -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="fixed bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-6">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-cyan-300/20 bg-slate-950/70 p-5 shadow-2xl md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.35em] text-cyan-200">ASPIRE DAY</div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">AGENT AI: MISSION ZERO</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">Solve all mission files, activate the AI core, then post the final screenshot and copied result text in the Teams Submission Channel.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-slate-900/80 p-4"><div className="text-xs text-slate-400">Timer</div><div className="text-2xl font-black text-orange-300">{formatTime(secondsLeft)}</div></div>
            <div className="rounded-2xl bg-slate-900/80 p-4"><div className="text-xs text-slate-400">Score</div><div className="text-2xl font-black text-emerald-300">{performanceScore}%</div></div>
            <div className="rounded-2xl bg-slate-900/80 p-4"><div className="text-xs text-slate-400">Progress</div><div className="text-2xl font-black text-cyan-300">{progress}%</div></div>
          </div>
        </header>

        {screen === "briefing" && (
          <section className="mx-auto max-w-5xl">
            <div className="glass rounded-3xl p-8" style={{ animation: "pulseGlow 3s infinite" }}>
              <div className="mb-6 text-7xl">🕵️‍♂️🤖</div>
              <h2 className="mb-4 text-3xl font-black text-cyan-100">Mission Briefing</h2>
              <p className="mb-5 text-lg leading-relaxed text-slate-200">Your team is now an AI field unit. Decode every mission file in sequence, unlock the AI core, take a screenshot of the completion card, copy the result text, and post both in the Teams Submission Channel.</p>
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-950/60 p-4"><b>Missions:</b><br />{missions.length}</div>
                <div className="rounded-2xl bg-slate-950/60 p-4"><b>Max Raw Score:</b><br />{maxScore}</div>
                <div className="rounded-2xl bg-slate-950/60 p-4"><b>Final Score:</b><br />Out of 100%</div>
                <div className="rounded-2xl bg-slate-950/60 p-4"><b>Submit:</b><br />Screenshot only</div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input className="flex-1 rounded-2xl border border-cyan-300/20 bg-slate-950/80 px-4 py-3 outline-none focus:border-cyan-300" placeholder="Enter Team Name" value={teamName} onChange={(event) => setTeamName(event.target.value)} />
                <button onClick={startGame} className="rounded-2xl bg-cyan-400 px-8 py-3 font-black text-slate-950 hover:bg-cyan-300">Start Quest</button>
              </div>
              <div className="mt-5 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-4 text-sm leading-relaxed text-yellow-100">
                <b>Important:</b> Mission map is read-only. Teams must progress by solving each mission. Final screenshot is mandatory for score validation.
              </div>
            </div>
          </section>
        )}

        {screen === "game" && currentMission && (
          <section className="grid gap-6 lg:grid-cols-[.35fr_.65fr]">
            <aside className="glass rounded-3xl p-5">
              <h3 className="mb-4 text-xl font-black text-cyan-100">Mission Map</h3>
              <div className="mb-5 h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all" style={{ width: `${progress}%` }} /></div>
              <div className="max-h-[520px] space-y-2 overflow-auto pr-1">
                {missions.map((mission, index) => (
                  <div key={mission.id} className={`w-full rounded-xl border p-3 text-left text-sm transition ${index === current ? "border-cyan-300 bg-cyan-400/15" : index < current ? "border-emerald-400/30 bg-emerald-500/10" : "border-slate-700 bg-slate-900/50 opacity-60"}`}>
                    <div className="font-black">{index < current ? "✅" : index === current ? "🔓" : "🔒"} {mission.title}</div>
                    <div className="text-xs text-slate-400">{mission.codename}</div>
                  </div>
                ))}
              </div>
            </aside>

            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">{currentMission.type}</div>
                  <h2 className="text-3xl font-black md:text-5xl">{currentMission.codename}</h2>
                  <p className="mt-1 text-slate-400">{currentMission.title} • {currentMission.points} raw points</p>
                </div>
                <div className="rounded-2xl border border-orange-300/40 bg-orange-400/10 px-5 py-3 text-center"><div className="text-xs text-orange-200">Attempts</div><div className="text-2xl font-black">{attempts}</div></div>
              </div>

              {currentMission.answer === "qrcode" && <div className="mb-6"><QRVisual /></div>}
              <pre className="mb-6 whitespace-pre-wrap rounded-3xl border border-slate-700 bg-slate-950/80 p-6 font-sans text-lg leading-relaxed text-slate-100 shadow-inner">{currentMission.clue}</pre>

              <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <input ref={inputRef} className="rounded-2xl border border-cyan-300/20 bg-white px-5 py-4 text-lg font-bold text-slate-950 outline-none focus:border-cyan-300" placeholder="Enter password" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submitAnswer()} />
                <button onClick={submitAnswer} className="rounded-2xl bg-emerald-400 px-7 py-4 font-black text-slate-950 hover:bg-emerald-300">Unlock</button>
                <button onClick={revealHint} className="rounded-2xl bg-yellow-300 px-7 py-4 font-black text-slate-950 hover:bg-yellow-200">Hint -{currentMission.hintCost}</button>
              </div>

              {message && <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-4 text-center text-lg font-black">{message}</div>}
            </div>
          </section>
        )}

        {screen === "complete" && (
          <section className="glass mx-auto max-w-5xl rounded-3xl p-8 text-center" style={{ animation: "pulseGlow 2s infinite" }}>
            <div className="mb-4 text-8xl">🎉</div>
            <h2 className="mb-2 text-5xl font-black text-cyan-100">AI CORE ACTIVATED</h2>
            <p className="mb-6 text-lg text-slate-300">Team <b>{teamName || "Unnamed Team"}</b> completed the mission sequence.</p>
            <div className="mx-auto mb-6 grid max-w-4xl gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-slate-950/70 p-5"><div className="text-sm text-slate-400">Performance Score</div><div className="text-4xl font-black text-emerald-300">{performanceScore}%</div></div>
              <div className="rounded-2xl bg-slate-950/70 p-5"><div className="text-sm text-slate-400">Raw Score</div><div className="text-3xl font-black text-cyan-300">{score}/{maxScore}</div></div>
              <div className="rounded-2xl bg-slate-950/70 p-5"><div className="text-sm text-slate-400">Time Left</div><div className="text-4xl font-black text-orange-300">{formatTime(secondsLeft)}</div></div>
              <div className="rounded-2xl bg-slate-950/70 p-5"><div className="text-sm text-slate-400">Missions</div><div className="text-4xl font-black text-purple-300">{missions.length}</div></div>
            </div>
            <div className="mx-auto mb-6 max-w-3xl rounded-3xl border border-cyan-300/30 bg-slate-950/80 p-5">
  <div className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
    Screenshot Submission Required
  </div>

  <p className="text-lg leading-relaxed text-slate-200">
    📸 Take a screenshot of this complete screen.
    <br /><br />

    📋 Click <strong>Copy Result Text</strong>.
    <br /><br />

    📢 Post BOTH the screenshot and copied result text in the
    <strong> Teams Submission Channel</strong>.
    <br /><br />

    🏆 Judges will validate submissions and update the live leaderboard.
  </p>
</div>

<div className="flex justify-center">
  <button
    onClick={copyResult}
    className="rounded-2xl bg-yellow-300 px-8 py-4 font-black text-slate-950 hover:bg-yellow-200"
  >
    📋 Copy Result Text
  </button>
</div>
            {message && <div className="mt-4 rounded-xl bg-slate-950/70 p-3 text-sm font-bold">{message}</div>}
          </section>
        )}
      </main>
    </div>
  );
}