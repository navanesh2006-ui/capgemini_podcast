import React, { useState } from "react";
import { usePodcast } from "../context/PodcastContext";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Radio,
  UserSquare2,
  MessageSquare,
  Film,
  Brain,
  TrendingUp,
  BarChart3,
  Globe2,
  Settings,
  Crown,
  Sparkles,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const { activePage, setActivePage } = usePodcast();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('podcastmind_session');
    window.location.href = 'login.html';
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-podcasts", label: "My Podcasts", icon: Radio },
    { id: "ai-host-twin", label: "AI Host Twin", icon: UserSquare2, badge: "New" },
    { id: "chat-with-podcast", label: "Chat with Podcast", icon: MessageSquare },
    { id: "viral-clips", label: "Viral Clips", icon: Film },
    { id: "knowledge-hub", label: "Knowledge Hub", icon: Brain },
    { id: "emotion-timeline", label: "Emotion Timeline", icon: TrendingUp },
    { id: "audience-insights", label: "Audience Insights", icon: BarChart3 },
    { id: "multiverse-view", label: "Multiverse View", icon: Globe2 },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Log Out", icon: LogOut }
  ];

  return (
    <aside className="w-64 bg-[#0D0D12]/90 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[2px] flex items-center justify-center shadow-neon-purple">
            <div className="w-full h-full rounded-[10px] bg-background flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-heading font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
              PodcastMind AI
            </h1>
            <p className="text-[10px] text-text-muted font-medium">
              AI Podcast Intelligence Ecosystem
            </p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "logout") {
                  handleLogout();
                } else {
                  setActivePage(item.id);
                }
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`w-full relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors cursor-pointer group ${
                item.id === "logout" ? "text-red-400/90 hover:text-red-400" : ""
              }`}
            >
              {/* Framer Motion Background Hover Capsule */}
              {hoveredIndex === idx && (
                <motion.div
                  layoutId="sidebar-hover-bg"
                  className={`absolute inset-0 rounded-xl -z-10 ${
                    item.id === "logout" ? "bg-red-500/[0.04]" : "bg-white/[0.03]"
                  }`}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              {/* Active Highlight Capsule */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full bg-gradient-to-b from-primary to-secondary" />
              )}

              {/* Icon */}
              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? "text-primary"
                    : item.id === "logout"
                    ? "text-red-400/70 group-hover:text-red-400"
                    : "text-text-muted group-hover:text-white"
                }`}
              />

              {/* Label */}
              <span
                className={`flex-1 transition-colors ${
                  isActive
                    ? "text-white font-semibold"
                    : item.id === "logout"
                    ? "text-red-400/90 group-hover:text-red-400 font-medium"
                    : "text-text-muted group-hover:text-white"
                }`}
              >
                {item.label}
              </span>

              {/* Badge */}
              {item.badge && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-neon-pink">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade Box & Storage Panel */}
      <div className="p-4 space-y-4 border-t border-white/5">
        {/* Upgrade Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-surface to-background border border-white/5 relative overflow-hidden group">
          {/* Subtle glow filter */}
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-300" />
          
          <div className="flex gap-3 items-start mb-3">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
              <Crown className="w-4 h-4 fill-yellow-500" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Unlock Full Power</h4>
              <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">
                Get advanced AI models, unlimited uploads, and more.
              </p>
            </div>
          </div>
          
          <button className="w-full text-xs font-semibold py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-neon-purple">
            Upgrade Now
          </button>
        </div>

        {/* Storage Bar */}
        <div className="space-y-1.5 px-2">
          <div className="flex items-center justify-between text-[10px] font-medium text-text-muted">
            <span>Storage Used</span>
            <span className="text-white">32.4 GB / 100 GB</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
              style={{ width: "32.4%" }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
