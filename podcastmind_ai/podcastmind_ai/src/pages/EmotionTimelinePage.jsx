import React from "react";
import { usePodcast } from "../context/PodcastContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertCircle, PlayCircle } from "lucide-react";

export default function EmotionTimelinePage() {
  const { activeEpisode, emotionTimelines, setCurrentTime, setIsPlaying, formatTime } = usePodcast();
  const data = emotionTimelines[activeEpisode.id] || emotionTimelines["e1"];

  // Click on chart coordinates to scrubber seek
  const handleChartClick = (state) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const clicked = state.activePayload[0].payload;
      if (clicked.timestampSeconds !== undefined) {
        setCurrentTime(clicked.timestampSeconds);
        setIsPlaying(true); // Play on seek
      }
    }
  };

  // Pie chart calculation
  // Let's summarize the averages for the pie chart
  const averageEmotions = data.reduce((acc, point) => {
    acc.excitement += point.excitement;
    acc.curiosity += point.curiosity;
    acc.surprise += point.surprise;
    acc.deepThinking += point.deepThinking;
    acc.joy += point.joy;
    return acc;
  }, { excitement: 0, curiosity: 0, surprise: 0, deepThinking: 0, joy: 0 });

  const totalPoints = data.length;
  const pieData = [
    { name: "Excitement", value: Math.round(averageEmotions.excitement / totalPoints), color: "#FF8C42" },
    { name: "Curiosity", value: Math.round(averageEmotions.curiosity / totalPoints), color: "#3B82F6" },
    { name: "Surprise", value: Math.round(averageEmotions.surprise / totalPoints), color: "#7B5EFF" },
    { name: "Deep Thinking", value: Math.round(averageEmotions.deepThinking / totalPoints), color: "#00F5D4" },
    { name: "Joy", value: Math.round(averageEmotions.joy / totalPoints), color: "#00E5A0" }
  ];

  // Top 3 emotional moments
  // Sort data points by absolute highest excitement or surprise or joy
  const sortedMoments = [...data].sort((a, b) => {
    const maxA = Math.max(a.excitement, a.surprise, a.joy);
    const maxB = Math.max(b.excitement, b.surprise, b.joy);
    return maxB - maxA;
  });
  const topMoments = sortedMoments.slice(0, 3);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#13131A] border border-white/10 p-3.5 rounded-xl shadow-2xl text-xs space-y-1">
          <p className="font-bold text-white">Seek position: {payload[0].payload.timestamp}</p>
          <p className="text-[10px] text-text-muted italic max-w-[200px]">"{payload[0].payload.quote}"</p>
          <div className="space-y-1 mt-2 border-t border-white/5 pt-2">
            <div className="flex justify-between gap-6">
              <span className="text-orange-400 font-semibold">🔥 Excitement:</span>
              <span className="text-white font-bold">{payload[0].payload.excitement}%</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-blue-400 font-semibold">⚡ Curiosity:</span>
              <span className="text-white font-bold">{payload[0].payload.curiosity}%</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-purple-400 font-semibold">😮 Surprise:</span>
              <span className="text-white font-bold">{payload[0].payload.surprise}%</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-teal-400 font-semibold">🧠 Deep Thinking:</span>
              <span className="text-white font-bold">{payload[0].payload.deepThinking}%</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-green-400 font-semibold">😊 Joy:</span>
              <span className="text-white font-bold">{payload[0].payload.joy}%</span>
            </div>
          </div>
          <span className="text-[9px] text-primary font-bold block pt-1.5 animate-pulse text-center">
            Click node to jump player here
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto ml-64 min-h-screen"
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <span>📈 Emotion Timeline Analysis</span>
          </h2>
          <p className="text-xs text-text-muted mt-1 font-medium">
            Biometric and tone sentiment mapping. Click coordinates on the chart to sync the audio player to that quote segment.
          </p>
        </div>
      </div>

      {/* Large Line Chart */}
      <div className="glass-card p-6 border border-white/5">
        <h3 className="text-sm font-heading font-bold text-slate-200 mb-5 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Interactive Audio-Sync Timelines</span>
        </h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              onClick={handleChartClick}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#8888AA" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#8888AA" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line type="monotone" dataKey="excitement" stroke="#FF8C42" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="curiosity" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="surprise" stroke="#7B5EFF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="deepThinking" stroke="#00F5D4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="joy" stroke="#00E5A0" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend list indicators */}
        <div className="flex justify-center flex-wrap gap-5 mt-4 text-[10px] font-bold text-text-muted">
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#FF8C42]" /><span>EXCITEMENT (ORANGE)</span></div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /><span>CURIOSITY (BLUE)</span></div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#7B5EFF]" /><span>SURPRISE (PURPLE)</span></div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#00F5D4]" /><span>DEEP THINKING (TEAL)</span></div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#00E5A0]" /><span>JOY (GREEN)</span></div>
        </div>
      </div>

      {/* Split Row: Top Highlights & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Breakdown Table */}
        <div className="lg:col-span-2 glass-card p-6 border border-white/5 space-y-4">
          <h3 className="text-sm font-heading font-bold text-white">Sentiment Segment Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-text-muted font-bold text-[10px] uppercase">
                  <th className="py-3 px-2">Timestamp</th>
                  <th className="py-3 px-2">Dominant Emotion</th>
                  <th className="py-3 px-2 text-center">Intensity</th>
                  <th className="py-3 px-2">Key Quote segment</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((point, index) => (
                  <tr key={index} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-all group">
                    <td className="py-3.5 px-2 font-mono text-primary font-semibold">{point.timestamp}</td>
                    <td className="py-3.5 px-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 ${
                        point.dominant === "Excitement" ? "text-orange-400 border border-orange-500/20" :
                        point.dominant === "Curiosity" ? "text-blue-400 border border-blue-500/20" :
                        point.dominant === "Surprise" ? "text-purple-400 border border-purple-500/20" :
                        point.dominant === "Deep Thinking" ? "text-teal-400 border border-teal-500/20" :
                        "text-green-400 border border-green-500/20"
                      }`}>
                        {point.dominant}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-white">
                      {Math.max(point.excitement, point.curiosity, point.surprise, point.deepThinking, point.joy)}%
                    </td>
                    <td className="py-3.5 px-2 text-slate-300 max-w-[240px] truncate">
                      "{point.quote}"
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <button
                        onClick={() => {
                          setCurrentTime(point.timestampSeconds);
                          setIsPlaying(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-primary/20 text-text-muted hover:text-primary transition-all cursor-pointer group-hover:scale-105"
                      >
                        <PlayCircle className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Distribution Pie & Top Highlights */}
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="glass-card p-6 border border-white/5 flex flex-col items-center">
            <h3 className="text-sm font-heading font-bold text-white self-start mb-4">Overall Distribution</h3>
            <div className="w-full h-44 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Metrics</span>
                <span className="text-base font-extrabold text-white">Bio-tone</span>
              </div>
            </div>
            
            {/* Pie Legends values */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10px] font-bold text-slate-300 mt-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.name}: {d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 3 Moments */}
          <div className="glass-card p-6 border border-white/5 space-y-4">
            <h3 className="text-sm font-heading font-bold text-white">Peak Highlights</h3>
            <div className="space-y-3">
              {topMoments.map((moment, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setCurrentTime(moment.timestampSeconds);
                    setIsPlaying(true);
                  }}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all cursor-pointer flex gap-3 items-center group"
                >
                  <span className="w-6 h-6 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 group-hover:scale-105">
                    {moment.timestamp}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-semibold text-white truncate">
                      Dominant: {moment.dominant}
                    </p>
                    <p className="text-[9.5px] text-text-muted truncate mt-0.5">
                      "{moment.quote}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
