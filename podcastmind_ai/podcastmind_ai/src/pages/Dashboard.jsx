import React from "react";
import { motion } from "framer-motion";
import PodcastPlayer from "../components/PodcastPlayer";
import ChatPanel from "../components/ChatPanel";
import ViralClipsMini from "../components/ViralClipsMini";
import KnowledgeMini from "../components/KnowledgeMini";
import AudienceInsightsMini from "../components/AudienceInsightsMini";
import EmotionTimelineMini from "../components/EmotionTimelineMini";
import MultiverseMini from "../components/MultiverseMini";
import RecentUploads from "../components/RecentUploads";
import HostTwinWidget from "../components/HostTwinWidget";

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto ml-64"
    >
      {/* Top dashboard layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main center controls - 2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Podcast Audio Player */}
          <PodcastPlayer />

          {/* AI Conversation Chat Panel */}
          <ChatPanel />

          {/* Bottom center split widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ViralClipsMini />
            <KnowledgeMini />
          </div>
        </div>

        {/* Right Column (Side analytics panel - 1/3 width) */}
        <div className="space-y-6">
          {/* Audience Insights Circle Donut */}
          <AudienceInsightsMini />

          {/* Emotion Tracker lines */}
          <EmotionTimelineMini />

          {/* Perspective quicklinks */}
          <MultiverseMini />
        </div>

      </div>

      {/* Bottom Layout Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2 items-center">
        {/* Recent Uploads grid (3/4 width) */}
        <div className="lg:col-span-3">
          <RecentUploads />
        </div>

        {/* AI Host Twin widget (1/4 width) */}
        <div className="lg:col-span-1">
          <HostTwinWidget />
        </div>
      </div>
    </motion.div>
  );
}
