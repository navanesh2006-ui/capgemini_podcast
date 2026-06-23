import React, { useState, useRef, useEffect } from "react";
import { usePodcast } from "../context/PodcastContext";
import { usePodcastChat } from "../hooks/usePodcastChat";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, RotateCw } from "lucide-react";

export default function ChatPanel({ fullHeight = false }) {
  const { currentEpisode } = usePodcast();
  const {
    chatHistory,
    isTyping,
    apiKeyMissing,
    quickChips,
    sendMessage,
    retryLastMessage,
    seekToTimestamp
  } = usePodcastChat();

  const [inputText, setInputText] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll chat history window to the bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    sendMessage(inputText.trim());
    setInputText("");
  };

  const handleChipClick = (chipText) => {
    if (isTyping) return;
    sendMessage(chipText);
  };

  // Custom text formatter to support simple markdown syntax and interactive timestamp badges
  const renderMessageContent = (text) => {
    if (!text) return null;

    // Regex to match bracketed timestamps like [MM:SS] or [H:MM:SS]
    const timestampRegex = /(\[\d{1,2}:\d{2}\]|\[\d{1,2}:\d{2}:\d{2}\])/g;
    const lines = text.split("\n");

    return lines.map((line, lineIdx) => {
      // Check for bullet lists
      const bulletMatch = line.match(/^\s*([•\-*])\s*(.*)/);
      // Check for numbered lists
      const numberMatch = line.match(/^\s*(\d+\.)\s*(.*)/);

      let isBullet = !!bulletMatch;
      let isNumber = !!numberMatch;
      let cleanLine = line;

      if (isBullet) {
        cleanLine = bulletMatch[2];
      } else if (isNumber) {
        cleanLine = numberMatch[2];
      }

      // Helper to split text segments and wrap timestamps in clickable buttons
      const parseTimestampsInSegment = (segment) => {
        if (typeof segment !== "string") return segment;
        const parts = segment.split(timestampRegex);
        return parts.map((part, idx) => {
          if (timestampRegex.test(part)) {
            const cleanTime = part.replace(/[\[\]]/g, "");
            return (
              <button
                key={`ts-${idx}`}
                onClick={() => seekToTimestamp(cleanTime)}
                className="inline-flex items-center px-2 py-0.5 mx-1 text-[11px] font-bold rounded bg-[#7B5EFF]/25 hover:bg-[#7B5EFF]/45 border border-[#7B5EFF]/40 text-[#A088FF] hover:text-white transition-all cursor-pointer font-mono select-none"
                title={`Seek playhead to ${part}`}
              >
                {part}
              </button>
            );
          }
          return part;
        });
      };

      // Split line by double asterisks for bold formatting
      const boldParts = cleanLine.split("**");
      const formattedElements = [];

      boldParts.forEach((boldPart, boldIdx) => {
        // Split by single asterisk for italic formatting
        const italicParts = boldPart.split("*");
        const italicElements = italicParts.map((italicPart, italicIdx) => {
          const parsedContent = parseTimestampsInSegment(italicPart);
          if (italicIdx % 2 === 1) {
            return (
              <em key={`italic-${italicIdx}`} className="italic text-slate-300">
                {parsedContent}
              </em>
            );
          }
          return parsedContent;
        });

        if (boldIdx % 2 === 1) {
          formattedElements.push(
            <strong key={`bold-${boldIdx}`} className="font-bold text-white">
              {italicElements}
            </strong>
          );
        } else {
          formattedElements.push(...italicElements);
        }
      });

      if (isBullet) {
        return (
          <ul key={lineIdx} className="list-disc pl-5 my-1">
            <li className="text-slate-200">{formattedElements}</li>
          </ul>
        );
      }

      if (isNumber) {
        return (
          <ol key={lineIdx} className="list-decimal pl-5 my-1" start={parseInt(numberMatch[1])}>
            <li className="text-slate-200">{formattedElements}</li>
          </ol>
        );
      }

      return (
        <div key={lineIdx} className={lineIdx > 0 ? "mt-1.5 min-h-[1em]" : "min-h-[1em]"}>
          {formattedElements}
        </div>
      );
    });
  };

  return (
    <div
      className={`p-5 flex flex-col transition-all duration-300 ease-in-out shrink-0 select-none ${
        fullHeight ? "h-full" : "h-[450px]"
      }`}
      style={{
        background: "linear-gradient(rgba(13, 13, 18, 0.8), rgba(13, 13, 18, 0.8)) padding-box, linear-gradient(135deg, #7B5EFF, #FF5E9C) border-box",
        border: "1px solid transparent",
        borderRadius: "16px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)"
      }}
    >
      {/* Header Area */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-gradient-to-br from-[#7B5EFF]/20 to-[#FF5E9C]/20 border border-[#7B5EFF]/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#FF5E9C]" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide">Chat with Podcast</h3>
        </div>
        {currentEpisode && (
          <div className="max-w-[180px] sm:max-w-[240px] px-3 py-1 rounded-full bg-[#7B5EFF]/10 border border-[#7B5EFF]/20 text-[#A088FF] text-[10px] font-bold truncate">
            {currentEpisode.title}
          </div>
        )}
      </div>

      {/* API Key Missing Banner */}
      {apiKeyMissing && (
        <div className="mt-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-2 rounded-lg flex items-center justify-between text-[11px] shrink-0">
          <span>
            Add your Anthropic API key in <strong>.env</strong> to enable chat.
          </span>
          <a
            href="https://docs.anthropic.com/api"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white font-bold ml-2 shrink-0 transition-colors"
          >
            docs.anthropic.com/api
          </a>
        </div>
      )}

      {/* Quick Question Chips (horizontal scroll) */}
      <div className="flex gap-2 overflow-x-auto py-3 shrink-0 scrollbar-none">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip)}
            disabled={isTyping}
            className="text-[10px] font-semibold px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-[#7B5EFF]/15 hover:border-[#7B5EFF]/25 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Stream Scroll Box */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 my-2 pr-1 scrollbar-thin scrollbar-thumb-white/10 min-h-0 flex flex-col"
      >
        <AnimatePresence initial={false}>
          {chatHistory.map((msg) => {
            if (msg.role === "status") {
              return (
                <div
                  key={msg.id}
                  className="w-full text-center text-[10px] font-semibold py-2 px-4 rounded-lg bg-white/[0.02] border border-white/5 text-slate-400 shrink-0 select-none animate-fadeIn"
                >
                  {msg.content}
                </div>
              );
            }

            const isUser = msg.role === "user";
            const isError = msg.role === "error";

            if (isError) {
              return (
                <div
                  key={msg.id}
                  className="flex justify-start w-full animate-fadeIn"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm shrink-0 mr-2 select-none">
                    🤖
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-[18px_18px_18px_4px] p-3 text-xs leading-relaxed max-w-[85%] text-red-300">
                    <p>{msg.content}</p>
                    {msg.canRetry && (
                      <button
                        onClick={retryLastMessage}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] transition-all cursor-pointer shadow-md active:scale-95"
                      >
                        <RotateCw className="w-3 h-3" />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm shrink-0 mr-2 select-none">
                    🤖
                  </div>
                )}
                <div
                  className={`p-3 text-xs leading-relaxed font-medium ${
                    isUser
                      ? "bg-gradient-to-r from-[#7B5EFF] to-[#FF5E9C] text-white rounded-[18px_18px_4px_18px] max-w-[75%]"
                      : "bg-white/[0.06] border border-white/10 text-slate-100 rounded-[18px_18px_18px_4px] max-w-[85%]"
                  }`}
                >
                  <div className="space-y-1">{renderMessageContent(msg.content)}</div>
                  <div className="flex justify-end mt-1.5">
                    <span className={`text-[8.5px] font-semibold ${isUser ? "text-white/60" : "text-slate-500"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Animated Bot Typing Loader */}
        {isTyping && (
          <div className="flex justify-start w-full">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm shrink-0 mr-2 select-none">
              🤖
            </div>
            <div className="bg-white/[0.06] border border-white/10 rounded-[18px_18px_18px_4px] px-4 py-3 flex gap-1 items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7B5EFF] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7B5EFF] animate-bounce" style={{ animationDelay: "200ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7B5EFF] animate-bounce" style={{ animationDelay: "400ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Bar Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-3 border-t border-white/5 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isTyping}
          placeholder="Ask anything about this podcast..."
          className="flex-1 text-xs py-3 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#7B5EFF] focus:ring-1 focus:ring-[#7B5EFF]/30 text-white placeholder-slate-400 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={isTyping || !inputText.trim()}
          className="p-3 rounded-full bg-gradient-to-r from-[#7B5EFF] to-[#FF5E9C] hover:opacity-95 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
}
