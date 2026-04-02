import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  "What services do you offer?",
  "How much does it cost?",
  "How does AI automation work?",
  "How do I get started?"
];

const WELCOME = "Hey! I'm Apex, the AI assistant for Coded For You. I can help you learn about our AI automation services, pricing, and how we can help your business grow. What can I help you with?";

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(0,180,255,0.5)" }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 8,
        marginBottom: 10
      }}
    >
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #00B4FF, #0070CC)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "#fff",
          fontFamily: "'Orbitron', sans-serif"
        }}>A</div>
      )}
      <div style={{
        maxWidth: "78%",
        padding: "10px 14px",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: isUser
          ? "linear-gradient(135deg, rgba(0,180,255,0.25), rgba(0,100,200,0.2))"
          : "rgba(255,255,255,0.04)",
        border: isUser
          ? "1px solid rgba(0,180,255,0.3)"
          : "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.92)",
        fontSize: 13.5,
        lineHeight: 1.55,
        fontFamily: "'Exo 2', sans-serif",
        wordBreak: "break-word"
      }}>
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function ApexChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasGreeted = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasUnread(false);
      if (!hasGreeted.current) {
        hasGreeted.current = true;
        setMessages([{ role: "assistant", content: WELCOME }]);
      }
    }
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setShowSuggestions(false);
    setInput("");

    const userMsg = { role: "user", content: trimmed };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      if (!open) setHasUnread(true);

    } catch (err) {
      setError(err.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [messages, loading, open]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
  };

  return (
    <>
      {/* Floating bubble */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9999,
          width: 58, height: 58, borderRadius: "50%", border: "none",
          background: "linear-gradient(135deg, #00B4FF, #0055CC)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(0,180,255,0.45)"
        }}
        aria-label="Open Apex AI chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </motion.svg>
          ) : (
            <motion.svg key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }} width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </motion.svg>
          )}
        </AnimatePresence>
        {hasUnread && !open && (
          <div style={{
            position: "absolute", top: 0, right: 0,
            width: 14, height: 14, borderRadius: "50%",
            background: "#22c55e", border: "2px solid #050505"
          }} />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", bottom: 100, right: 28, zIndex: 9998,
              width: 360, maxHeight: 540,
              background: "rgba(8,8,18,0.97)",
              border: "1px solid rgba(0,180,255,0.18)",
              borderRadius: 20,
              display: "flex", flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,180,255,0.08)",
              backdropFilter: "blur(20px)"
            }}
          >
            {/* Header */}
            <div style={{
              padding: "14px 16px",
              background: "rgba(0,0,0,0.4)",
              borderBottom: "1px solid rgba(0,180,255,0.12)",
              display: "flex", alignItems: "center", gap: 12
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg, #00B4FF, #0055CC)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#fff",
                fontFamily: "'Orbitron', sans-serif",
                position: "relative", flexShrink: 0
              }}>
                A
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 10, height: 10, borderRadius: "50%",
                  background: "#22c55e", border: "2px solid #080812"
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>APEX</div>
                <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: "#22c55e", marginTop: 1 }}>● Online · Coded For You AI</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", padding: 4, borderRadius: 6, display: "flex", alignItems: "center" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              className="chat-messages"
              style={{ flex: 1, overflowY: "auto", padding: "16px 14px 8px" }}
            >
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #00B4FF, #0070CC)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "'Orbitron', sans-serif", flexShrink: 0 }}>A</div>
                  <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              {error && (
                <div style={{
                  textAlign: "center", padding: "8px 12px", margin: "4px 0",
                  background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)",
                  borderRadius: 10, color: "rgba(255,120,120,0.9)",
                  fontSize: 12, fontFamily: "'Exo 2', sans-serif"
                }}>
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ padding: "0 14px 10px", display: "flex", flexWrap: "wrap", gap: 6 }}
                >
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(0,180,255,0.2)",
                        borderRadius: 20, padding: "5px 11px",
                        color: "rgba(0,180,255,0.7)", fontSize: 11.5,
                        cursor: "pointer", fontFamily: "'Exo 2', sans-serif",
                        transition: "all 0.15s"
                      }}
                      onMouseEnter={e => { e.target.style.borderColor = "rgba(0,180,255,0.6)"; e.target.style.color = "#00B4FF"; }}
                      onMouseLeave={e => { e.target.style.borderColor = "rgba(0,180,255,0.2)"; e.target.style.color = "rgba(0,180,255,0.7)"; }}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input area */}
            <div style={{
              padding: "10px 12px",
              borderTop: "1px solid rgba(0,180,255,0.1)",
              background: "rgba(0,0,0,0.3)",
              display: "flex", gap: 8, alignItems: "flex-end"
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about our services..."
                rows={1}
                maxLength={1000}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(0,180,255,0.15)", borderRadius: 12,
                  padding: "9px 13px", color: "#fff", fontSize: 13.5,
                  fontFamily: "'Exo 2', sans-serif", resize: "none",
                  outline: "none", lineHeight: 1.45,
                  minHeight: 40, maxHeight: 96
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                style={{
                  width: 38, height: 38, borderRadius: 10, border: "none",
                  background: input.trim() && !loading
                    ? "linear-gradient(135deg, #00B4FF, #0055CC)"
                    : "rgba(255,255,255,0.07)",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.2s", alignSelf: "flex-end"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>

            {/* Footer */}
            <div style={{
              textAlign: "center", padding: "6px 8px",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              background: "rgba(0,0,0,0.2)",
              fontSize: 10, color: "rgba(255,255,255,0.2)",
              fontFamily: "'Exo 2', sans-serif"
            }}>
              Apex AI · Coded For You · Responses may not always be perfect
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
