import React, { useRef, useEffect, useState } from "react";
import { usePodcast } from "../context/PodcastContext";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Download, 
  MoreHorizontal, 
  ListMusic, 
  Pencil,
  Sparkles
} from "lucide-react";

// Pre-generate a static waveform heights list (80 values) to make it look like real speech
const WAVEFORM_HEIGHTS = [
  15, 30, 20, 45, 60, 30, 25, 40, 75, 50, 65, 80, 55, 30, 45, 60, 40, 20, 35, 50, 
  70, 90, 85, 60, 40, 30, 50, 65, 80, 75, 45, 20, 15, 30, 40, 60, 50, 35, 45, 55, 
  65, 80, 75, 95, 85, 70, 50, 40, 60, 75, 65, 45, 30, 20, 35, 50, 60, 45, 30, 40, 
  55, 70, 80, 60, 45, 30, 50, 65, 55, 40, 30, 20, 35, 50, 45, 30, 15, 25, 10, 5
];

export default function PodcastPlayer() {
  const {
    activeEpisode,
    activePodcast,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    playbackSpeed,
    setPlaybackSpeed,
    volume,
    setVolume,
    skipForward,
    skipBackward,
    formatTime
  } = usePodcast();

  const canvasRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.85);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [waveformClickedPercent, setWaveformClickedPercent] = useState(null);

  // Speed selection
  const speeds = [1, 1.25, 1.5, 2];

  // Toggle Mute
  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  // Canvas waveform rendering & animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let frame = 0;

    const resizeCanvas = () => {
      // Get container width
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = 80 * window.devicePixelRatio;
      canvas.style.width = "100%";
      canvas.style.height = "80px";
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width / window.devicePixelRatio;
      const height = 80;
      
      const barCount = WAVEFORM_HEIGHTS.length;
      const barWidth = (width - (barCount - 1) * 3) / barCount;
      const progress = currentTime / activeEpisode.durationSeconds;

      frame++;

      for (let i = 0; i < barCount; i++) {
        // Calculate dynamic height variation if playing
        let modifier = 1;
        if (isPlaying) {
          modifier = 0.7 + Math.sin(frame * 0.15 + i) * 0.3;
        }

        const barHeight = Math.max(4, WAVEFORM_HEIGHTS[i] * modifier * 0.7);
        const x = i * (barWidth + 3);
        const y = (height - barHeight) / 2;

        const isPlayed = (i / barCount) <= progress;

        // Colors
        if (isPlayed) {
          // Played color: Purple to Pink gradient
          const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
          grad.addColorStop(0, "#7B5EFF");
          grad.addColorStop(1, "#FF5E9C");
          ctx.fillStyle = grad;
        } else {
          // Unplayed color: muted slate/white
          ctx.fillStyle = "rgba(136, 136, 170, 0.25)";
        }

        // Draw rounded rectangle/bar
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, 2);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isPlaying, currentTime, activeEpisode]);

  // Click on waveform to seek
  const handleWaveformClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const seekTime = Math.floor(percent * activeEpisode.durationSeconds);
    setCurrentTime(seekTime);
  };

  const handleWaveformMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const percent = Math.min(Math.max(0, hoverX / rect.width), 1);
    setHoverTime(Math.floor(percent * activeEpisode.durationSeconds));
  };

  const handleWaveformMouseLeave = () => {
    setHoverTime(null);
  };

  return (
    <div className="glass-card p-6 border border-white/5 relative overflow-hidden group">
      {/* Player Header Info */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between pb-5 border-b border-white/5">
        <div className="flex gap-5 items-center w-full md:w-auto">
          {/* Episode Art */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden relative group shrink-0 shadow-lg">
            <img 
              src={activeEpisode.thumbnail || activePodcast.thumbnail} 
              alt={activeEpisode.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
            />
            {/* Hover Edit Pencil Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Pencil className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1 md:flex-initial">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Now Playing
              </span>
            </div>
            <h3 className="text-xl font-heading font-bold text-white tracking-tight leading-tight">
              {activeEpisode.title}
            </h3>
            <p className="text-xs text-text-muted font-medium flex items-center gap-2">
              <span>{activePodcast.title}</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span className="text-white/60">Host: {activeEpisode.host || activePodcast.host}</span>
            </p>
          </div>
        </div>

        {/* Download + More Controls */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white transition-all cursor-pointer">
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-text-muted hover:text-white transition-all cursor-pointer">
            <MoreHorizontal className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Waveform Visualizer Display */}
      <div className="my-6 relative">
        <div 
          className="relative cursor-pointer select-none bg-white/[0.01] rounded-xl py-2"
          onClick={handleWaveformClick}
          onMouseMove={handleWaveformMouseMove}
          onMouseLeave={handleWaveformMouseLeave}
        >
          <canvas ref={canvasRef} className="w-full" />
          
          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div 
              className="absolute -top-6 transform -translate-x-1/2 bg-surface text-[10px] font-semibold text-white px-2 py-0.5 rounded border border-white/10 pointer-events-none"
              style={{ left: `${(hoverTime / activeEpisode.durationSeconds) * 100}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Timestamp Track indicator */}
        <div className="flex justify-between items-center text-xs font-semibold text-text-muted mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{activeEpisode.duration}</span>
        </div>
      </div>

      {/* Control Buttons Grid */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mt-2">
        {/* Speed Selector */}
        <div className="relative">
          <button 
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <span>Speed</span>
            <span className="text-primary font-bold">{playbackSpeed}x</span>
          </button>

          {showSpeedMenu && (
            <div className="absolute left-0 bottom-full mb-2 w-28 bg-[#13131A] border border-white/5 rounded-xl p-1 z-35 shadow-2xl">
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setPlaybackSpeed(s);
                    setShowSpeedMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/[0.04] transition-all flex justify-between items-center cursor-pointer ${
                    playbackSpeed === s ? "text-primary bg-primary/5" : "text-text-muted"
                  }`}
                >
                  <span>{s}x</span>
                  {playbackSpeed === s && <div className="w-1 h-1 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Play/Pause/Skip Controls */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => skipBackward(15)}
            className="p-3 rounded-full hover:bg-white/5 text-text-muted hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-neon-purple shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white translate-x-0.5" />
            )}
          </button>

          <button 
            onClick={() => skipForward(15)}
            className="p-3 rounded-full hover:bg-white/5 text-text-muted hover:text-white transition-all cursor-pointer"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        {/* Volume controls & playlist toggle */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMute}
              className="text-text-muted hover:text-white transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                if (val > 0) setIsMuted(false);
              }}
              className="w-20 accent-primary cursor-pointer h-1 rounded-full bg-white/10"
            />
          </div>
          
          <button className="p-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-text-muted hover:text-white transition-all cursor-pointer">
            <ListMusic className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
