import React, { createContext, useContext, useState, useEffect } from "react";
import {
  mockPodcasts,
  mockEpisodes,
  mockViralClips,
  mockEmotionTimeline,
  mockKnowledge,
  mockAudienceInsights,
  mockPerspectives
} from "../utils/mockData";

const PodcastContext = createContext();

export const PodcastProvider = ({ children }) => {
  // DB States
  const [podcasts, setPodcasts] = useState(mockPodcasts);
  const [episodes, setEpisodes] = useState(mockEpisodes);
  const [viralClips, setViralClips] = useState(mockViralClips);
  const [emotionTimelines, setEmotionTimelines] = useState(mockEmotionTimeline);
  const [knowledgeData, setKnowledgeData] = useState(mockKnowledge);
  const [audienceInsights, setAudienceInsights] = useState(mockAudienceInsights);
  const [perspectives, setPerspectives] = useState(mockPerspectives);

  // Active items
  const [activePodcast, setActivePodcast] = useState(mockPodcasts[0]);
  const [activeEpisode, setActiveEpisode] = useState(mockEpisodes[0]);
  const [activePage, setActivePage] = useState("dashboard");

  // Playback Control States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(1122); // Preload at 18:42 as in mockup image (18 * 60 + 42 = 1122)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.25);
  const [volume, setVolume] = useState(0.85);

  // Search & Global inputs
  const [searchQuery, setSearchQuery] = useState("");

  // Chat Histories
  const [chatHistory, setChatHistory] = useState({
    e1: [
      {
        id: "msg-1",
        role: "user",
        content: "What did the host mean by 'Agentic AI will redefine software'?",
        timestamp: "18:42"
      },
      {
        id: "msg-2",
        role: "assistant",
        content: "The host means that Agentic AI systems can autonomously plan, decide, and execute tasks with minimal human intervention. These systems will change how software is built, deployed, and scaled — moving from traditional automation to intelligent autonomy.",
        timestamp: "18:43"
      }
    ]
  });

  const [aiHostTwinHistory, setAiHostTwinHistory] = useState([
    {
      id: "ath-1",
      role: "assistant",
      content: "I am the AI Digital Twin of Alex Carter. I have been trained on all episodes of The AI Revolution Podcast. Ask me anything about the future of intelligence, startups, or cognitive designs!",
      timestamp: "14:30"
    }
  ]);

  // Multiverse comparison
  const [compareModes, setCompareModes] = useState(["beginner", "expert"]);

  // AI Host settings
  const [twinPersonality, setTwinPersonality] = useState("Professional"); // Casual | Professional | Debate
  const [twinVoiceMode, setTwinVoiceMode] = useState(false);

  // Audio Playback Simulation Timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + 1;
          if (nextTime >= activeEpisode.durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return nextTime;
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playbackSpeed, activeEpisode]);

  // Sync active episode if active podcast changes
  const selectPodcast = (podcast) => {
    setActivePodcast(podcast);
    const firstEp = episodes.find((ep) => ep.podcastId === podcast.id);
    if (firstEp) {
      setActiveEpisode(firstEp);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const selectEpisode = (episode) => {
    setActiveEpisode(episode);
    // Find matching podcast
    const pod = podcasts.find((p) => p.id === episode.podcastId);
    if (pod) setActivePodcast(pod);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Skip functions
  const skipForward = (sec = 15) => {
    setCurrentTime((prev) => {
      const next = prev + sec;
      return next >= activeEpisode.durationSeconds ? activeEpisode.durationSeconds : next;
    });
  };

  const skipBackward = (sec = 15) => {
    setCurrentTime((prev) => {
      const next = prev - sec;
      return next <= 0 ? 0 : next;
    });
  };

  // Helper functions
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Add Podcast action (Upload)
  const uploadPodcast = (title, host, category, description, durationStr, thumbnail) => {
    const newId = `p${podcasts.length + 1}`;
    const newPod = {
      id: newId,
      title,
      host,
      description,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80",
      uploadDate: new Date().toISOString().split("T")[0],
      category,
      duration: durationStr || "45:00",
      episodesCount: 1,
      plays: "0",
      likes: "0",
      shares: "0",
      transcript: "AI Host: This is a newly uploaded podcast transcript. Ready to extract intelligence."
    };

    const newEpId = `e${episodes.length + 1}`;
    const newEp = {
      id: newEpId,
      podcastId: newId,
      title: `${title} - Episode 1`,
      duration: durationStr || "45:00",
      durationSeconds: 2700,
      plays: "0",
      likes: "0",
      uploadDate: new Date().toISOString().split("T")[0],
      thumbnail: newPod.thumbnail,
      host,
      audioUrl: ""
    };

    setPodcasts((prev) => [...prev, newPod]);
    setEpisodes((prev) => [...prev, newEp]);
    
    // Seed templates for the uploaded podcast
    setViralClips((prev) => ({
      ...prev,
      [newEpId]: [
        {
          id: `clip-new-1`,
          episodeId: newEpId,
          startTime: "00:30",
          startTimeSeconds: 30,
          endTime: "01:15",
          quote: "This represents a breakthrough moment in local data uploads and processing structures.",
          viralScore: 89,
          emotion: "💡 Inspiration",
          thumbnail: newPod.thumbnail
        }
      ]
    }));

    setEmotionTimelines((prev) => ({
      ...prev,
      [newEpId]: [
        { timestamp: "00:00", timestampSeconds: 0, excitement: 50, curiosity: 60, surprise: 40, deepThinking: 50, joy: 50, quote: "Initializing discussion.", dominant: "Curiosity" },
        { timestamp: "10:00", timestampSeconds: 600, excitement: 70, curiosity: 75, surprise: 45, deepThinking: 60, joy: 55, quote: "Analyzing custom uploaded metrics.", dominant: "Curiosity" },
        { timestamp: "20:00", timestampSeconds: 1200, excitement: 85, curiosity: 70, surprise: 80, deepThinking: 50, joy: 75, quote: "A groundbreaking conclusion!", dominant: "Excitement" }
      ]
    }));

    setKnowledgeData((prev) => ({
      ...prev,
      [newEpId]: {
        notes: [
          { id: "new-n1", content: "Successfully parsed custom uploaded audio nodes." },
          { id: "new-n2", content: "AI host identified primary theme: Automated integration pipelines." }
        ],
        flashcards: [
          { id: "new-fc-1", question: "What is the primary topic of this upload?", answer: "The uploaded file covers user-defined structures, categories, and duration details." }
        ],
        quiz: [
          { id: "new-q-1", question: "Is this podcast parsed by AI Host Twin?", options: ["Yes", "No", "Partially", "Requires Upgrade"], answer: "Yes", explanation: "All uploads are automatically parsed and catalogued by PodcastMind AI Host Twin." }
        ],
        summary: {
          paragraphs: [
            "This newly uploaded podcast introduces the concept of customizable data structures and local runtime updates.",
            "It features discussion on the mechanics of drag-and-drop systems, dynamic UI states, and responsive design styling.",
            "The episode wraps up by noting how client-side simulation matches server-side endpoints for quick developer iteration."
          ]
        },
        mindMap: {
          id: "new-root",
          label: "Uploaded Podcast Analysis",
          expanded: true,
          children: [
            { id: "new-c1", label: "Main Topic: Integration", expanded: false },
            { id: "new-c2", label: "Secondary Topic: Visualizers", expanded: false }
          ]
        }
      }
    }));

    setAudienceInsights((prev) => ({
      ...prev,
      [newEpId]: {
        engagementScore: 65,
        audienceRetention: 65,
        audienceRetentionChange: 0,
        avgWatchTime: durationStr || "45:00",
        avgWatchTimeSeconds: 2700,
        avgWatchTimeChange: 0,
        dropoffPoint: "05:00",
        dropoffPointSeconds: 300,
        dropoffPointChange: 0,
        totalListens: "15",
        completionRate: 40,
        retentionCurve: [
          { timestamp: "00:00", rate: 100 },
          { timestamp: "10:00", rate: 70 },
          { timestamp: "20:00", rate: 50 },
          { timestamp: "30:00", rate: 42 }
        ],
        devices: [
          { name: "Mobile", value: 80, color: "#7B5EFF" },
          { name: "Desktop", value: 20, color: "#FF5E9C" }
        ],
        geography: [
          { country: "Local System", listens: "15", share: 100 }
        ]
      }
    }));

    setPerspectives((prev) => ({
      ...prev,
      [newEpId]: {
        beginner: {
          emoji: "😊",
          title: "Beginner Mode",
          tagline: "Simple explanations",
          summary: "This file is a fresh upload. Here we explain the user's custom podcast in basic everyday terms.",
          bullets: ["Uploaded file is successfully indexed.", "Contains customizable categories and title headers."],
          insight: "Takeaway: Drag-and-drop file uploads make expanding the podcast library quick."
        },
        founder: {
          emoji: "🚀",
          title: "Founder Mode",
          tagline: "Startup analysis",
          summary: "Startup perspective on this custom podcast focuses on speed of deployment and user engagement metrics.",
          bullets: ["Rapid local cataloguing boosts creator retention.", "Seamless workflow speeds up content delivery cycles."],
          insight: "Moat: Lowering client friction on audio analysis creates strong product lock-in."
        },
        expert: {
          emoji: "🧠",
          title: "Expert Mode",
          tagline: "Technical breakdown",
          summary: "Deep technical analysis of the file data packet structure and simulated API responses.",
          bullets: ["Vite middleware processes binary streams.", "Dynamic schema handles nested database keys without index rebuils."],
          insight: "Bottleneck: Simulating heavy audio codecs in client browsers."
        },
        critical: {
          emoji: "⚖️",
          title: "Critical Mode",
          tagline: "Alternative angles",
          summary: "Skeptical view of custom local processing speed compared to heavy server clusters.",
          bullets: ["Without true cloud servers, local analysis is limited to metadata extrapolation.", "Database records reset on tab refreshes."],
          insight: "Warning: Save state parameters locally or integrate a persistent state repository."
        }
      }
    }));

    // Switch focus to the newly uploaded podcast and select it
    setActivePodcast(newPod);
    setActiveEpisode(newEp);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const deletePodcast = (id) => {
    setPodcasts((prev) => prev.filter((p) => p.id !== id));
    // Find all episodes matching this podcast and delete them too
    const epsToDelete = episodes.filter((e) => e.podcastId === id).map((e) => e.id);
    setEpisodes((prev) => prev.filter((e) => e.podcastId !== id));

    // Clear matching caches
    setViralClips((prev) => {
      const copy = { ...prev };
      epsToDelete.forEach((epId) => delete copy[epId]);
      return copy;
    });
    setEmotionTimelines((prev) => {
      const copy = { ...prev };
      epsToDelete.forEach((epId) => delete copy[epId]);
      return copy;
    });
    setKnowledgeData((prev) => {
      const copy = { ...prev };
      epsToDelete.forEach((epId) => delete copy[epId]);
      return copy;
    });
    setAudienceInsights((prev) => {
      const copy = { ...prev };
      epsToDelete.forEach((epId) => delete copy[epId]);
      return copy;
    });
    setPerspectives((prev) => {
      const copy = { ...prev };
      epsToDelete.forEach((epId) => delete copy[epId]);
      return copy;
    });

    // Reset active podcast and episode
    if (activePodcast.id === id) {
      const remainingPod = podcasts.find((p) => p.id !== id);
      if (remainingPod) {
        selectPodcast(remainingPod);
      }
    }
  };

  // Add chat message
  const sendChatMessage = (episodeId, content) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: formatTime(currentTime)
    };

    setChatHistory((prev) => {
      const history = prev[episodeId] || [];
      return {
        ...prev,
        [episodeId]: [...history, newMsg]
      };
    });

    // Simulate AI response
    setTimeout(() => {
      let botContent = "I'm analyzing the podcast context for your query. The hosts discussed multi-agent workflows and how their autonomous capabilities allow for iterative validation checks, leading to higher accuracy and lower developer oversight.";
      
      if (content.toLowerCase().includes("agentic")) {
        botContent = "As the host Alex Carter outlines, Agentic AI goes beyond passive conversational models. It describes systems designed with planning layers, memory retrieval engines, and tool-access configurations to execute multi-step workflows without constant human prompting.";
      } else if (content.toLowerCase().includes("multi-agent") || content.toLowerCase().includes("collaboration")) {
        botContent = "In the podcast segment around 26:40, the speakers highlights that multi-agent systems divide complex tasks among specialized personas (e.g. researchers, scriptwriters, and code checkers) that collaborate in a structured loop to produce highly verified outputs.";
      } else if (content.toLowerCase().includes("ethics") || content.toLowerCase().includes("safety")) {
        botContent = "Alex Carter emphasizes the 'alignment bottleneck' around 40:00. Because agentic loops execute recursively, they are highly prone to cost cascades or security breaches unless structured with sandboxed runtimes and strict constitutional guardrails.";
      } else if (content.toLowerCase().includes("takeaway") || content.toLowerCase().includes("summary")) {
        botContent = "The three main takeaways from this discussion are: 1) Software is shifting from standard triggers to active teammates, 2) specialized multi-agent structures solve reasoning limits, and 3) real-world B2B value will belong to those building secure, auditable execution guardrails.";
      }

      const botMsg = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: botContent,
        timestamp: formatTime(currentTime)
      };

      setChatHistory((prev) => {
        const history = prev[episodeId] || [];
        return {
          ...prev,
          [episodeId]: [...history, botMsg]
        };
      });
    }, 1500);
  };

  // AI Host Twin message sender
  const sendHostTwinMessage = (content) => {
    const newMsg = {
      id: `ath-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiHostTwinHistory((prev) => [...prev, newMsg]);

    setTimeout(() => {
      let botContent = `[Host Twin - ${twinPersonality} Mode] That is a fascinating question. Based on my voice and core ideas from the episodes, I always assert that true technology leverage comes from building systems that adapt rather than follow rigid configurations.`;

      if (twinPersonality === "Debate Mode") {
        botContent = `[Host Twin - Debate Mode] While that view is popular, I strongly disagree. Standard wrapper apps will lose all margins within two years. Startups must build custom evaluation sets and own their proprietary execution telemetry, or they will be crushed by standard foundational updates. What's your counter-argument?`;
      } else if (twinPersonality === "Casual") {
        botContent = `[Host Twin - Casual Mode] Honestly? It's all about keeping it simple. People overcomplicate agents. At the end of the day, an agent is just a script with a loop and a brain. If you give it a clear goal and decent tools, it gets the job done. No need to over-engineer it!`;
      } else if (content.toLowerCase().includes("who are you") || content.toLowerCase().includes("identity")) {
        botContent = `I am the AI Digital Twin of Alex Carter, cloned using embedding vectors from my podcast transcripts, show notes, and technical articles. I can explain any thesis I've proposed on the show or debate agentic architecture with you.`;
      }

      const botMsg = {
        id: `ath-${Date.now() + 1}`,
        role: "assistant",
        content: botContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setAiHostTwinHistory((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <PodcastContext.Provider
      value={{
        // DB
        podcasts,
        episodes,
        viralClips,
        emotionTimelines,
        knowledgeData,
        audienceInsights,
        perspectives,

        // Actives
        activePodcast,
        activeEpisode,
        activePage,
        setActivePage,
        selectPodcast,
        selectEpisode,

        // Audio state
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
        formatTime,

        // Actions
        uploadPodcast,
        deletePodcast,
        searchQuery,
        setSearchQuery,

        // Chat
        chatHistory,
        sendChatMessage,
        aiHostTwinHistory,
        sendHostTwinMessage,
        compareModes,
        setCompareModes,

        // Host settings
        twinPersonality,
        setTwinPersonality,
        twinVoiceMode,
        setTwinVoiceMode
      }}
    >
      {children}
    </PodcastContext.Provider>
  );
};

export const usePodcast = () => useContext(PodcastContext);
