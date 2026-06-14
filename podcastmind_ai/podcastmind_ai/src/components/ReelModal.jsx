import React, { useState } from "react";
import { X, Play, Video, Music, Check, Sparkles, Film, ArrowRight } from "lucide-react";

export default function ReelModal({ clip, onClose }) {
  const [aspectRatio, setAspectRatio] = useState("9:16"); // '9:16' | '16:9' | '1:1'
  const [addCaptions, setAddCaptions] = useState(true);
  const [bgMusic, setBgMusic] = useState("none"); // 'none' | 'lofi' | 'ambient' | 'synthwave'
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = () => {
    setExporting(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setExporting(false);
          alert("Reel exported successfully! Download ready.");
          onClose();
        }, 500);
      }
    }, 300);
  };

  if (!clip) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Modal Box */}
      <div className="w-full max-w-3xl bg-[#13131A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-[500px]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Preview Pane */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-radial-gradient from-primary to-transparent" />
          
          {/* Simulated Mobile Device Preview frame */}
          <div 
            className={`bg-surface border border-white/10 rounded-2xl relative shadow-2xl overflow-hidden flex flex-col items-center justify-center transition-all duration-300 ${
              aspectRatio === "9:16" ? "w-[180px] h-[320px]" : 
              aspectRatio === "16:9" ? "w-[280px] h-[157px]" : 
              "w-[220px] h-[220px]"
            }`}
          >
            {/* Reel thumbnail */}
            <img 
              src={clip.thumbnail} 
              alt="Reel Preview" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            
            {/* Visualizer and Quote Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 p-3.5 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-primary/80 text-white uppercase tracking-wider flex items-center gap-0.5">
                  <Film className="w-2 h-2" />
                  REEL
                </span>
                <span className="text-[8px] font-semibold text-white/80">{clip.startTime}</span>
              </div>

              {/* Dynamic Capitions Simulator */}
              {addCaptions && (
                <div className="text-center bg-black/60 backdrop-blur-xs p-2 rounded-lg border border-white/5 my-auto">
                  <p className="text-[10px] font-bold text-yellow-400 leading-snug">
                    "{clip.quote.length > 60 ? clip.quote.substring(0, 50) + "..." : clip.quote}"
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[8px] font-bold">
                  AI
                </div>
                <div className="flex-1">
                  <div className="w-12 h-1 bg-white/30 rounded">
                    <div className="w-8 h-full bg-primary rounded" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Centered Play Button icon */}
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform z-10 border border-white/20">
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            </div>
          </div>
        </div>

        {/* Right Side: Options and Export */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5">
          <div>
            <div className="mb-4">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/10 border border-secondary/20 text-secondary uppercase">
                Reel Creator
              </span>
              <h3 className="text-lg font-heading font-bold text-white mt-1.5 flex items-center gap-1.5">
                <span>Configure Export Parameters</span>
              </h3>
            </div>

            {/* Quote review */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 mb-5 text-xs text-text-muted italic">
              "{clip.quote}"
            </div>

            {/* Config options */}
            <div className="space-y-4">
              {/* Aspect Ratio choice */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Vertical (9:16)", value: "9:16" },
                    { label: "Horizontal (16:9)", value: "16:9" },
                    { label: "Square (1:1)", value: "1:1" }
                  ].map((aspect) => (
                    <button
                      key={aspect.value}
                      onClick={() => setAspectRatio(aspect.value)}
                      className={`py-2 rounded-xl border text-[10px] font-semibold transition-all cursor-pointer ${
                        aspectRatio === aspect.value
                          ? "bg-primary/10 border-primary text-white"
                          : "bg-white/[0.02] border-white/5 text-text-muted hover:border-white/10"
                      }`}
                    >
                      {aspect.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Captions Toggle */}
              <div className="flex items-center justify-between py-1">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">Burn-in Captions</span>
                  <span className="text-[10px] text-text-muted">Dynamic kinetic subtitle overlays</span>
                </div>
                <input
                  type="checkbox"
                  checked={addCaptions}
                  onChange={(e) => setAddCaptions(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded bg-white/5 border-white/10"
                />
              </div>

              {/* Background music choice */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Background Music</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "No music", value: "none" },
                    { label: "Chill Lofi Beat", value: "lofi" },
                    { label: "Ambient Synth", value: "ambient" },
                    { label: "Retro Synthwave", value: "synthwave" }
                  ].map((track) => (
                    <button
                      key={track.value}
                      onClick={() => setBgMusic(track.value)}
                      className="py-2 px-3 rounded-xl border bg-white/[0.02] text-[10px] font-medium text-left flex items-center justify-between transition-all border-white/5 cursor-pointer hover:border-white/10 group"
                    >
                      <span className={bgMusic === track.value ? "text-white font-semibold" : "text-text-muted group-hover:text-white"}>
                        {track.label}
                      </span>
                      {bgMusic === track.value && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Export button section */}
          <div className="mt-6 pt-4 border-t border-white/5">
            {exporting ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-text-muted">
                  <span>Compiling video packet...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <button
                onClick={handleExport}
                className="w-full font-heading font-bold text-sm py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-neon-purple"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate & Export Reel</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
