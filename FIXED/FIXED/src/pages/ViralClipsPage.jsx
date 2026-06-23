import React, { useState, useEffect, useRef } from "react";
import { usePodcast } from "../context/PodcastContext";
import { motion } from "framer-motion";
import { Film, Play, Sparkles, AlertCircle, Share2, HelpCircle } from "lucide-react";

export default function ViralClipsPage() {
  const { activeEpisode, viralClips, showToast, episodes, selectEpisode, setCurrentTime, setIsPlaying, setSelectedReelClip, generateMoreViralClips } = usePodcast();
  const [activeShareMenuClipId, setActiveShareMenuClipId] = useState(null);
  const shareMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setActiveShareMenuClipId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const parseTimeToSeconds = (timeStr) => {
    if (typeof timeStr === "number") return timeStr;
    if (!timeStr) return 0;
    const parts = timeStr.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    if (parts.length === 3) {
      return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
    }
    return parseFloat(timeStr) || 0;
  };

  const handlePlayClip = (clip) => {
    const episode = episodes.find((e) => e.id === clip.episodeId);
    if (!episode) return;
    selectEpisode(episode);
    const startSec = clip.startTimeSeconds !== undefined ? clip.startTimeSeconds : parseTimeToSeconds(clip.startTime);
    setTimeout(() => {
      setCurrentTime(startSec);
      setIsPlaying(true);
      showToast(`Playing highlight from ${episode.title}`);
    }, 150);
  };

  const clips = viralClips[activeEpisode.id] || [];

  const getScoreColorClass = (score) => {
    if (score >= 90) return "bg-success/10 border-success/30 text-success shadow-neon-green";
    if (score >= 70) return "bg-warning/10 border-warning/30 text-warning";
    return "bg-red-500/10 border-red-500/30 text-red-400";
  };

  const handleShareClip = (clip) => {
    const shareUrl = `https://podcastmind.ai/clip/${clip.id}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            showToast("Viral clip share link copied to clipboard!");
          })
          .catch((err) => {
            console.warn("Clipboard API failed, using fallback:", err);
            fallbackCopyText(shareUrl);
          });
      } else {
        fallbackCopyText(shareUrl);
      }
    } catch (e) {
      console.warn("Clipboard exception, using fallback:", e);
      fallbackCopyText(shareUrl);
    }
  };

  const fallbackCopyText = (text) => {
    let copySuccess = false;
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Style to be off-screen and invisible but technically visible to browser focus/selection
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      textArea.style.width = "2px";
      textArea.style.height = "2px";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      copySuccess = document.execCommand("copy");
      document.body.removeChild(textArea);
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }

    if (copySuccess) {
      showToast("Viral clip share link copied to clipboard!");
    } else {
      // Ultimate fallback: prompt browser input dialog for manual copying
      window.prompt("Failed to copy link automatically. Please copy it manually from the box below:", text);
    }
  };

  const toggleShareMenu = (clipId) => {
    setActiveShareMenuClipId(activeShareMenuClipId === clipId ? null : clipId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto lg:ml-64 ml-0 min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <span>🔥 AI Viral Clips Detector</span>
          </h2>
          <p className="text-xs text-text-muted mt-1 font-medium">
            AI automatically slices and identifies high-retention clips optimized for TikTok, Reels, and YouTube Shorts
          </p>
        </div>
        <button
          onClick={() => generateMoreViralClips(activeEpisode.id)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-neon-purple shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate More Clips</span>
        </button>
      </div>

      {/* Grid container */}
      {clips.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-text-muted max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-primary mx-auto mb-2" />
          <h4 className="text-xs font-bold text-white">No Clips Found</h4>
          <p className="text-[10px] text-text-muted mt-1">Upload a show or switch the active podcast to generate clips.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map((clip) => (
            <div
              key={clip.id}
              className="glass-card overflow-hidden border border-white/5 flex flex-col justify-between group hover:border-primary/20 transition-all duration-300"
            >
              {/* Image Preview pane */}
              <div className="relative h-44 overflow-hidden shrink-0">
                <img
                  src={clip.thumbnail}
                  alt="Clip Art"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button 
                    onClick={() => handlePlayClip(clip)}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:scale-110 active:scale-95 transition-all border border-white/10"
                    title="Play Highlight"
                  >
                    <Play className="w-5 h-5 fill-white translate-x-0.5" />
                  </button>
                </div>

                {/* Left indicators */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-black/75 text-white">
                    Start: {clip.startTime}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary text-white">
                    {clip.emotion}
                  </span>
                </div>

                {/* Score badge top right */}
                <span className={`absolute top-4 right-4 text-[9px] font-bold px-2.5 py-1 rounded-full border ${getScoreColorClass(clip.viralScore)}`}>
                  Viral Score: {clip.viralScore}%
                </span>
              </div>

              {/* Text Description and quote */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Key Highlight Quote</span>
                  <p className="text-xs leading-relaxed text-slate-200 font-medium italic">
                    "{clip.quote}"
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedReelClip(clip)}
                    className="flex-1 font-heading font-bold text-[11px] py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-neon-purple"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Generate Reel</span>
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => toggleShareMenu(clip.id)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-text-muted hover:text-white transition-all cursor-pointer"
                      title="Share Clip"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {activeShareMenuClipId === clip.id && (
                      <div 
                        ref={shareMenuRef}
                        className="absolute bottom-full right-0 mb-3 w-48 rounded-2xl bg-[#13131A] border border-white/10 p-2 shadow-2xl z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200"
                      >
                        <div className="px-2.5 py-1.5 border-b border-white/5 mb-1 select-none text-left">
                          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Share Clip</span>
                        </div>
                        
                        {/* WhatsApp */}
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this viral podcast clip: https://podcastmind.ai/clip/${clip.id}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setActiveShareMenuClipId(null)}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all flex items-center gap-2.5 cursor-pointer"
                        >
                          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Telegram */}
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(`https://podcastmind.ai/clip/${clip.id}`)}&text=${encodeURIComponent("Check out this viral podcast clip!")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setActiveShareMenuClipId(null)}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all flex items-center gap-2.5 cursor-pointer"
                        >
                          <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                          <span>Telegram</span>
                        </a>

                        {/* Instagram */}
                        <button
                          onClick={() => {
                            handleShareClip(clip);
                            setActiveShareMenuClipId(null);
                            setTimeout(() => {
                              window.open("https://instagram.com", "_blank");
                            }, 1000);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all flex items-center gap-2.5 cursor-pointer"
                        >
                          <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                          <span>Instagram</span>
                        </button>

                        {/* Mail */}
                        <a
                          href={`mailto:?subject=${encodeURIComponent("Viral Podcast Clip Recommendation")}&body=${encodeURIComponent(`Hey,\n\nCheck out this viral podcast clip: https://podcastmind.ai/clip/${clip.id}`)}`}
                          onClick={() => setActiveShareMenuClipId(null)}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all flex items-center gap-2.5 cursor-pointer"
                        >
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span>Email</span>
                        </a>

                        <div className="h-[1px] bg-white/5 my-1" />

                        {/* Copy Link */}
                        <button
                          onClick={() => {
                            handleShareClip(clip);
                            setActiveShareMenuClipId(null);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-primary hover:text-white hover:bg-white/[0.04] transition-all flex items-center gap-2.5 cursor-pointer"
                        >
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          <span>Copy Link</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
