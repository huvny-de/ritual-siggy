"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Role = "user" | "assistant";
type Message = { role: Role; content: string };

const personalities = [
  "Gatekeeper",
  "Chaos Goblin",
  "Scholar of Ritual",
  "Cosmic Trader",
  "Sleepy Cat",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [personality, setPersonality] = useState("Gatekeeper");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input.trim() },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/siggy-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, personality }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.reply as string },
        ]);
      } else if (data.error) {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content:
              "Siggy flicks an ear. The Ritual spirits returned an error.",
          },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Siggy lost the connection to the Ritual oracles. Try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,#2b1f4a_0,#05010d_55%,#000000_100%)] text-slate-100">
      <div className="w-full max-w-6xl px-4 py-10">
        <div className="rounded-[28px] border border-violet-500/40 bg-slate-950/80 shadow-[0_0_70px_rgba(139,92,246,0.8)] backdrop-blur-2xl p-7">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-300 via-violet-400 to-emerald-300 shadow-[0_0_35px_rgba(244,114,182,0.9)] flex items-center justify-center text-3xl">
                😼
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h1 className="text-2xl font-semibold tracking-wide">
                    <span className="bg-gradient-to-r from-pink-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
                      Siggy
                    </span>{" "}
                    — Gatekeeper of Ritual
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.18em] border border-emerald-400/70 bg-emerald-400/10 text-emerald-200">
                    On‑chain Familiar
                  </span>
                </div>
                <p className="text-xs text-slate-300/80 mt-1">
                  A magical chain‑born cat spirit guiding Ritual builders through
                  the fog of decentralized AI.
                </p>
                <p className="text-[11px] text-slate-300/80 mt-1">
                  Try:{" "}
                  <code className="bg-slate-800/80 px-1.5 py-0.5 rounded-full border border-violet-500/60 text-[10px]">
                    scan my soul
                  </code>{" "}
                  • &quot;What should I build on Ritual?&quot; •
                  &nbsp;&quot;Explain Ritual like I&apos;m new&quot;
                </p>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 text-[11px] text-slate-300/80">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-600/70 bg-slate-900/80">
                <Image
                  src="https://ritual.net/meta/favicon.webp"
                  alt="Ritual Blockchain"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="uppercase tracking-[0.16em] text-[10px]">
                  Ritual Blockchain
                </span>
              </div>
              <span className="opacity-75">
                Powered by Ritual + Siggy&apos;s cosmic instincts.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-5 text-xs">
            <div className="flex flex-col gap-1">
              <span className="uppercase tracking-[0.18em] text-[10px] text-slate-400">
                Siggy Personality
              </span>
              <select
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                className="bg-slate-900/80 border border-slate-600/80 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/70"
              >
                {personalities.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div
            ref={chatRef}
            className="siggy-scroll h-[26rem] md:h-[34rem] overflow-y-auto rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-4 space-y-3 text-sm"
          >
            {messages.length === 0 && (
              <div className="text-xs text-slate-400">
                Siggy curls its tail around an on‑chain crystal, waiting for
                your first Ritual.
              </div>
            )}
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const bubbleBase =
                "max-w-[80%] rounded-2xl px-3 py-2 text-sm";
              const userBubble =
                "bg-gradient-to-br from-emerald-400/20 to-violet-400/20 border border-emerald-300/50 whitespace-pre-wrap";
              const assistantBubble =
                "bg-gradient-to-br from-violet-500/20 to-slate-800/90 border border-violet-400/60";

              const isHtml =
                !isUser && m.content.trim().startsWith("<");

              return (
                <div
                  key={i}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`${bubbleBase} ${
                      isUser ? userBubble : assistantBubble
                    }`}
                  >
                    {isHtml ? (
                      <div
                        className="prose prose-invert prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: m.content }}
                      />
                    ) : (
                      <span className={isUser ? "" : "whitespace-pre-wrap"}>
                        {m.content}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="text-[11px] text-violet-200 flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-violet-300 animate-pulse" />
                Siggy is consulting the Ritual oracles…
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="mt-4 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak your Ritual into existence..."
              className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/80"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-xs font-semibold disabled:opacity-50"
            >
              {loading ? "Channeling..." : "Cast"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
