import React, { useState, useRef, useEffect } from "react";
import { usePodcast } from "../context/PodcastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, User } from "lucide-react";

export default function ChatPanel() {
  const { activeEpisode, chatHistory, sendChatMessage } = usePodcast();
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const activeHistory = chatHistory[activeEpisode.id] || [];

  const quickChips = [
    "What is Agentic AI?",
    "Explain multi-agent systems",
    "Key takeaways",
    "AI ethics discussion"
  ];

  // Auto-scroll chat window
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeHistory, isTyping]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(activeEpisode.id, inputText.trim());
    setInputText("");
    setIsTyping(true);

    // Turn off typing animation after delay (matches response delay in context)
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handleChipClick = (chip) => {
    sendChatMessage(activeEpisode.id, chip);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="glass-card p-6 border border-white/5 flex flex-col h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary fill-primary/10" />
          <h3 className="text-base font-heading font-bold text-white">Chat with Podcast</h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-text-muted">
          Active Episode Analysis
        </span>
      </div>

      {/* Quick Prompts Chips */}
      <div className="flex flex-wrap gap-2 py-3 shrink-0 select-none">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip)}
            className="text-[10px] font-semibold px-3 py-1.5 rounded-full bg-white/5 hover:bg-primary/15 border border-white/5 hover:border-primary/20 text-slate-300 hover:text-white transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Stream Bubble Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-1 space-y-4 my-2 scrollbar-thin"
      >
        <AnimatePresence initial={false}>
          {activeHistory.map((msg, index) => {
            const isBot = msg.role === "assistant";
            return (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`flex gap-3 items-start ${!isBot ? "justify-end" : "justify-start"}`}
              >
                {/* Bot Icon */}
                {isBot && (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble content */}
                <div 
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed font-medium ${
                    isBot 
                      ? "bg-white/[0.02] border border-white/5 text-slate-200 rounded-tl-sm" 
                      : "bg-gradient-to-r from-primary to-secondary text-white rounded-tr-sm shadow-neon-purple"
                  }`}
                >
                  <p>{msg.content}</p>
                  <div className="flex justify-end mt-1.5">
                    <span className={`text-[9px] ${isBot ? "text-text-muted" : "text-white/60"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {/* User Icon */}
                {!isBot && (
                  <div className="w-8 h-8 rounded-lg bg-secondary/15 border border-secondary/25 flex items-center justify-center text-secondary shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Animated Bot Typing Loader */}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-start"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl rounded-tl-sm p-4 flex gap-1.5 items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSubmit} className="flex gap-3 pt-3 border-t border-white/5 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about this podcast..."
          className="flex-1 text-xs py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 focus:border-primary/50 text-white placeholder-text-muted outline-none transition-all focus:ring-1 focus:ring-primary/20"
        />
        <button
          type="submit"
          className="p-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-95 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-neon-purple"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}
