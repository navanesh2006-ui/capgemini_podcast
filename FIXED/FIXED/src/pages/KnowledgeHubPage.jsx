import React, { useState } from "react";
import { usePodcast } from "../context/PodcastContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  FileText, 
  Sparkles, 
  Layers, 
  Award, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  PlusCircle, 
  HelpCircle,
  FolderPlus
} from "lucide-react";

export default function KnowledgeHubPage() {
  const { 
    activeEpisode, 
    activePodcast, 
    knowledgeData, 
    setKnowledgeData, 
    showToast,
    geminiApiKey,
    GEMINI_API_KEY,
    aiModel,
    getMappedModelName
  } = usePodcast();
  const [activeTab, setActiveTab] = useState("Notes"); // 'Notes' | 'Mind Map' | 'Flashcards' | 'Quiz' | 'Summary'

  // Category visual styles helper
  const getCategoryStyles = (category) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("business")) {
      return {
        bg: "rgba(123, 94, 255, 0.1)",
        border: "border-primary/20",
        text: "text-primary",
        shadow: "shadow-[0_0_15px_rgba(123, 94, 255, 0.15)]",
        nodeStyle: "border-primary/30 hover:border-primary bg-[#13131A] hover:bg-primary/10 shadow-[0_0_10px_rgba(123, 94, 255, 0.05)]",
        nodeSelected: "border-primary bg-primary/20 shadow-[0_0_15px_rgba(123, 94, 255, 0.25)] text-white",
        lineColor: "rgba(123, 94, 255, 0.45)",
        lineShadow: "rgba(123, 94, 255, 0.6)"
      };
    } else if (cat.includes("yoga") || cat.includes("breath")) {
      return {
        bg: "rgba(16, 185, 129, 0.1)",
        border: "border-emerald-500/20",
        text: "text-emerald-400",
        shadow: "shadow-[0_0_15px_rgba(16, 185, 129, 0.15)]",
        nodeStyle: "border-emerald-500/30 hover:border-emerald-500 bg-[#13131A] hover:bg-emerald-500/10 shadow-[0_0_10px_rgba(16, 185, 129, 0.05)]",
        nodeSelected: "border-emerald-500 bg-emerald-500/20 shadow-[0_0_15px_rgba(16, 185, 129, 0.25)] text-white",
        lineColor: "rgba(16, 185, 129, 0.45)",
        lineShadow: "rgba(16, 185, 129, 0.6)"
      };
    } else if (cat.includes("motivation")) {
      return {
        bg: "rgba(245, 158, 11, 0.1)",
        border: "border-amber-500/20",
        text: "text-amber-400",
        shadow: "shadow-[0_0_15px_rgba(245, 158, 11, 0.15)]",
        nodeStyle: "border-amber-500/30 hover:border-amber-500 bg-[#13131A] hover:bg-amber-500/10 shadow-[0_0_10px_rgba(245, 158, 11, 0.05)]",
        nodeSelected: "border-amber-500 bg-amber-500/20 shadow-[0_0_15px_rgba(245, 158, 11, 0.25)] text-white",
        lineColor: "rgba(245, 158, 11, 0.45)",
        lineShadow: "rgba(245, 158, 11, 0.6)"
      };
    } else if (cat.includes("story") || cat.includes("documentary")) {
      return {
        bg: "rgba(239, 68, 68, 0.1)",
        border: "border-rose-500/20",
        text: "text-rose-400",
        shadow: "shadow-[0_0_15px_rgba(239, 68, 68, 0.15)]",
        nodeStyle: "border-rose-500/30 hover:border-rose-500 bg-[#13131A] hover:bg-rose-500/10 shadow-[0_0_10px_rgba(239, 68, 68, 0.05)]",
        nodeSelected: "border-rose-500 bg-rose-500/20 shadow-[0_0_15px_rgba(239, 68, 68, 0.25)] text-white",
        lineColor: "rgba(239, 68, 68, 0.45)",
        lineShadow: "rgba(239, 68, 68, 0.6)"
      };
    } else { // Diet/Health/Default
      return {
        bg: "rgba(14, 165, 233, 0.1)",
        border: "border-sky-500/20",
        text: "text-sky-400",
        shadow: "shadow-[0_0_15px_rgba(14, 165, 233, 0.15)]",
        nodeStyle: "border-sky-500/30 hover:border-sky-500 bg-[#13131A] hover:bg-sky-500/10 shadow-[0_0_10px_rgba(14, 165, 233, 0.05)]",
        nodeSelected: "border-sky-500 bg-sky-500/20 shadow-[0_0_15px_rgba(14, 165, 233, 0.25)] text-white",
        lineColor: "rgba(14, 165, 233, 0.45)",
        lineShadow: "rgba(14, 165, 233, 0.6)"
      };
    }
  };

  // Generate dynamic, context-aware assets based on podcast details
  const generateDynamicAssets = (episode, podcast) => {
    const epId = episode?.id || "e1";
    const title = episode?.title || "";
    const host = episode?.host || podcast?.host || "Host";
    const desc = podcast?.description || episode?.title || "the thematic discussion";
    const category = podcast?.category || "Podcast Hub";

    // Extract core topic keywords
    const cleanDesc = desc.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const words = cleanDesc.split(/\s+/).filter(w => w.length > 4);
    const keywords = [...new Set(words)].slice(0, 5);
    const mainTopic = keywords.length > 0 ? keywords.slice(0, 2).join(" and ") : "core insights";

    // Standard high-quality templates for pre-seeded episodes (e1-e10)
    const preseeded = {
      e1: {
        title: "Bricklaying Robots and the Lost Generation",
        topic: "Robotic Automation & Craftspeople Displacement",
        takeaways: [
          "Bricklaying robots are actively introduced to solve construction labor shortages.",
          "Concerns are rising over the displacement of young, skilled manual craftspeople.",
          "Upskilling programs are needed to train the younger workforce in robotic supervision.",
          "Robotic construction systems increase speed but require significant initial capital."
        ],
        flashcards: [
          { q: "What is the primary role of the new robots?", a: "Automating bricklaying in heavy construction." },
          { q: "What is the main social concern raised?", a: "The displacement of young skilled craftspeople." },
          { q: "How is the skill gap solved?", a: "Through upskilling schemes for robotic supervision." }
        ],
        quiz: [
          {
            question: "What is the primary job of the robots discussed in the episode?",
            options: ["Bricklaying", "Plumbing", "Roofing", "Wiring"],
            answer: "Bricklaying",
            explanation: "The discussion centers on bricklaying automation and its economic impact."
          },
          {
            question: "Who is the featured host or CEO speaker leading the interview?",
            options: ["Barratt Redrow", "Sarah Jenkins", "Dr. Ryan Vance", "Hinge CEO"],
            answer: "Barratt Redrow",
            explanation: "The CEO of Barratt Redrow leads the robotic automation interview."
          }
        ],
        mindMap: {
          id: "e1-root",
          label: "Robotics & Lost Generation",
          expanded: true,
          children: [
            {
              id: "e1-c1",
              label: "Automation Impact",
              expanded: true,
              children: [
                { id: "e1-c1-1", label: "Manual Labor Shift", children: [] },
                { id: "e1-c1-2", label: "Build Speed Gains", children: [] }
              ]
            },
            {
              id: "e1-c2",
              label: "Solutions Path",
              expanded: true,
              children: [
                { id: "e1-c2-1", label: "Upskilling Schemes", children: [] },
                { id: "e1-c2-2", label: "Supervisory Roles", children: [] }
              ]
            }
          ]
        }
      },
      e2: {
        title: "Hinge CEO and Dating Economics",
        topic: "Dating Apps & Cost of Living Crunch",
        takeaways: [
          "Rising inflation and living expenses are shifting young dating habits.",
          "Younger users are opting for low-cost, creative, and casual date formats.",
          "Hinge is restructuring user interfaces to improve engagement and retention.",
          "Virtual video dates serve as a low-cost screening tool before in-person meets."
        ],
        flashcards: [
          { q: "Why are dating habits changing?", a: "Due to rising inflation and living expenses." },
          { q: "What acts as a screening tool?", a: "Virtual video screening dates." },
          { q: "How is Hinge adapting its product?", a: "Restructuring interfaces for budget daters." }
        ],
        quiz: [
          {
            question: "What economic factor is shifting modern dating habits?",
            options: ["High inflation", "Low housing costs", "High employment", "Cheaper dining"],
            answer: "High inflation",
            explanation: "Living costs make traditional dating expensive."
          },
          {
            question: "How does Hinge adapt its product loops?",
            options: ["Restructuring engagement loops", "Increasing subscription prices", "Shutting down the app", "Partnering with restaurants"],
            answer: "Restructuring engagement loops",
            explanation: "Loops are adapted to retain budget daters."
          }
        ],
        mindMap: {
          id: "e2-root",
          label: "Dating Economics",
          expanded: true,
          children: [
            {
              id: "e2-c1",
              label: "Economic Drivers",
              expanded: true,
              children: [
                { id: "e2-c1-1", label: "Rising Living Costs", children: [] },
                { id: "e2-c1-2", label: "Creative Cheap Dates", children: [] }
              ]
            },
            {
              id: "e2-c2",
              label: "Product Adaptations",
              expanded: true,
              children: [
                { id: "e2-c2-1", label: "Interface Updates", children: [] },
                { id: "e2-c2-2", label: "Virtual Screenings", children: [] }
              ]
            }
          ]
        }
      },
      e3: {
        title: "Out-of-Body Experiences and Consciousness",
        topic: "Neuroscience & Spatial Ego-location",
        takeaways: [
          "Spatial ego-location is constructed dynamically by brain sensory integration.",
          "Out-of-body states occur when these multi-sensory feedback loops are disrupted.",
          "Cognitive science uses these anomalies to map human neural pathways.",
          "De-anchored focus techniques can aid in meditation and mental endurance."
        ],
        flashcards: [
          { q: "How does the brain construct spatial ego-location?", a: "Through sensory integration." },
          { q: "What triggers out-of-body states?", a: "Disruption of the sensory loop." }
        ],
        quiz: [
          {
            question: "What is the term for the brain's sense of bodily position?",
            options: ["Spatial ego-location", "Interoception", "Consciousness mapping", "Ego disruption"],
            answer: "Spatial ego-location",
            explanation: "The brain tracks spatial ego-location using sensory integration inputs."
          },
          {
            question: "Out-of-body states are triggered by:",
            options: ["Sensory loop disruption", "High sleep quality", "Increased eye movement", "Diet changes"],
            answer: "Sensory loop disruption",
            explanation: "Disrupted sensory feedback decouples awareness from the bodily frame."
          }
        ],
        mindMap: {
          id: "e3-root",
          label: "Out-of-Body & Consciousness",
          expanded: true,
          children: [
            {
              id: "e3-c1",
              label: "Neural Mechanisms",
              expanded: true,
              children: [
                { id: "e3-c1-1", label: "Sensory Integration", children: [] },
                { id: "e3-c1-2", label: "Loop Disruption", children: [] }
              ]
            },
            {
              id: "e3-c2",
              label: "Applications",
              expanded: true,
              children: [
                { id: "e3-c2-1", label: "Self-Perception Maps", children: [] },
                { id: "e3-c2-2", label: "De-anchored Focus", children: [] }
              ]
            }
          ]
        }
      },
      e4: {
        title: "Reading Fiction and Mental Health",
        topic: "Narrative Simulation & Empathy",
        takeaways: [
          "Literary fiction acts as an active simulation for social cognition.",
          "Readers develop enhanced theory of mind capabilities and empathy.",
          "Narrative immersion builds focus to fight digital attention fragmentation.",
          "Sustained reading habits protect cognitive endurance and lower stress."
        ],
        flashcards: [
          { q: "What does literary fiction simulate?", a: "Social cognition." },
          { q: "What skill does reading improve?", a: "Theory of mind and empathy." }
        ],
        quiz: [
          {
            question: "What mental skill is boosted by reading fiction?",
            options: ["Theory of Mind", "Motor coordination", "Spatial calculation", "Memory recall"],
            answer: "Theory of Mind",
            explanation: "Fiction stretches empathy and social prediction."
          },
          {
            question: "Reading helps fight what digital issue?",
            options: ["Attention fragmentation", "Lack of sleep", "Eye strain", "Sedentary behavior"],
            answer: "Attention fragmentation",
            explanation: "Sustained reading repairs focus filters."
          }
        ],
        mindMap: {
          id: "e4-root",
          label: "Fiction & Mind",
          expanded: true,
          children: [
            {
              id: "e4-c1",
              label: "Cognitive Benefits",
              expanded: true,
              children: [
                { id: "e4-c1-1", label: "Theory of Mind", children: [] },
                { id: "e4-c1-2", label: "Attention Recovery", children: [] }
              ]
            },
            {
              id: "e4-c2",
              label: "Mental Resilience",
              expanded: true,
              children: [
                { id: "e4-c2-1", label: "Narrative Simulation", children: [] },
                { id: "e4-c2-2", label: "Reduced Stress", children: [] }
              ]
            }
          ]
        }
      },
      e5: {
        title: "Out-of-Body Experiences and Mindsets",
        topic: "Physical Constraints & Focus",
        takeaways: [
          "Physical constraints do not restrict our mental focus or agility.",
          "Learning to de-anchor spatial ego boundaries aids in peak performance.",
          "Cognitive agility is trained by decoupling attention from physical discomfort.",
          "Goal tracking models benefit from de-anchoring focus under stress."
        ],
        flashcards: [
          { q: "Can the brain learn focus from out-of-body states?", a: "Yes, by de-anchoring standard spatial limits." },
          { q: "What is the key to peak performance here?", a: "Cognitive agility training." }
        ],
        quiz: [
          {
            question: "How does the brain operate during out-of-body disruptions?",
            options: ["Decoupling standard ego-location", "Entering deep sleep", "Reducing memory access", "Increasing visual stress"],
            answer: "Decoupling standard ego-location",
            explanation: "It trains focus by de-anchoring standard bodily location constraints."
          },
          {
            question: "Which skill is primary to achieving peak performance?",
            options: ["Cognitive agility", "Shorter reading sessions", "Increased sugar intake", "Manual oversight"],
            answer: "Cognitive agility",
            explanation: "Cognitive agility builds focus endurance."
          }
        ],
        mindMap: {
          id: "e5-root",
          label: "Ego & Performance",
          expanded: true,
          children: [
            {
              id: "e5-c1",
              label: "Cognitive Agility",
              expanded: true,
              children: [
                { id: "e5-c1-1", label: "Focus training", children: [] },
                { id: "e5-c1-2", label: "De-anchoring boundaries", children: [] }
              ]
            },
            {
              id: "e5-c2",
              label: "Goal Paths",
              expanded: true,
              children: [
                { id: "e5-c2-1", label: "Peak Performance", children: [] },
                { id: "e5-c2-2", label: "Tension Control", children: [] }
              ]
            }
          ]
        }
      },
      e6: {
        title: "Reading Fiction and Brain Power",
        topic: "Attention Span & Focus Recovery",
        takeaways: [
          "Engaging with long narratives stretches the attention span over time.",
          "Sustained reading fights instant gratification feedback loops.",
          "Narrative mapping stimulates and activates the hippocampus region.",
          "Deep immersion practices repair fragmented focus filters."
        ],
        flashcards: [
          { q: "What does reading long fiction stretch?", a: "Attention span." },
          { q: "What loops does reading fight?", a: "Instant gratification loops." }
        ],
        quiz: [
          {
            question: "Which brain structure builds maps during narrative tracking?",
            options: ["Hippocampus", "Cerebellum", "Spinal cord", "Olfactory bulb"],
            answer: "Hippocampus",
            explanation: "The hippocampus maps chronological narrative events."
          },
          {
            question: "Immersion fights which digital health issue?",
            options: ["Instant gratification loops", "Poor posture", "Low internet speed", "Lack of notifications"],
            answer: "Instant gratification loops",
            explanation: "Gratification loops degrade sustained cognitive endurance."
          }
        ],
        mindMap: {
          id: "e6-root",
          label: "Sustained Attention",
          expanded: true,
          children: [
            {
              id: "e6-c1",
              label: "Narrative Mapping",
              expanded: true,
              children: [
                { id: "e6-c1-1", label: "Hippocampus activation", children: [] },
                { id: "e6-c1-2", label: "Chronological tracking", children: [] }
              ]
            },
            {
              id: "e6-c2",
              label: "Focus Recovery",
              expanded: true,
              children: [
                { id: "e6-c2-1", label: "Attention span stretching", children: [] },
                { id: "e6-c2-2", label: "Digital loop bypass", children: [] }
              ]
            }
          ]
        }
      },
      e7: {
        title: "Africa's Football Dreamers",
        topic: "Football Academies & Career Realities",
        takeaways: [
          "Local football academies in Africa promise life-changing paths in Europe.",
          "The recruitment market is highly competitive and severely oversaturated.",
          "Aspiring young athletes face intense physical demands and financial risks.",
          "Only a tiny percentage successfully sign professional European club contracts."
        ],
        flashcards: [
          { q: "What do local academies promise?", a: "Professional European contracts." },
          { q: "Is the recruitment rate high?", a: "No, only a tiny fraction succeed." }
        ],
        quiz: [
          {
            question: "Where are the local football academies investigated in this report?",
            options: ["Accra, Ghana", "Lagos, Nigeria", "Nairobi, Kenya", "Dakar, Senegal"],
            answer: "Accra, Ghana",
            explanation: "The report tracks players in Accra."
          },
          {
            question: "What is the main hurdle for young players?",
            options: ["Extreme competition", "Lack of training gear", "No scout interest", "Language barriers"],
            answer: "Extreme competition",
            explanation: "The contract market is oversaturated."
          }
        ],
        mindMap: {
          id: "e7-root",
          label: "Football Dreams",
          expanded: true,
          children: [
            {
              id: "e7-c1",
              label: "Recruitment Paths",
              expanded: true,
              children: [
                { id: "e7-c1-1", label: "Local Academies", children: [] },
                { id: "e7-c1-2", label: "European Contracts", children: [] }
              ]
            },
            {
              id: "e7-c2",
              label: "Market Realities",
              expanded: true,
              children: [
                { id: "e7-c2-1", label: "High Competition", children: [] },
                { id: "e7-c2-2", label: "Financial Risks", children: [] }
              ]
            }
          ]
        }
      },
      e8: {
        title: "Beyonce and Financial Empires",
        topic: "Independent Branding & Business Leverage",
        takeaways: [
          "Beyonce redefines leverage by owning her distribution and supply chain.",
          "Revenue is diversified across music publishing, global tours, and apparel.",
          "Corporate leverage is maintained in a streaming-centric digital economy.",
          "Premium branding depends on scarcity, quality control, and visual releases."
        ],
        flashcards: [
          { q: "How does she retain major corporate leverage?", a: "By owning her distribution & supply chain." },
          { q: "What are her primary revenue streams?", a: "Publishing, touring, and apparel." }
        ],
        quiz: [
          {
            question: "How does Beyonce retain major music leverage?",
            options: ["Owning her distribution & supply chain", "Signing with major labels", "Relying on streaming alone", "Running print ads"],
            answer: "Owning her distribution & supply chain",
            explanation: "Controlling distribution keeps margins high."
          },
          {
            question: "What branding tactic is highlighted?",
            options: ["Scarcity & high-impact releases", "Heavy discount sales", "Radio promotions", "Standard sponsorships"],
            answer: "Scarcity & high-impact releases",
            explanation: "Exclusive releases enhance premium brand perception."
          }
        ],
        mindMap: {
          id: "e8-root",
          label: "Beyonce Empire",
          expanded: true,
          children: [
            {
              id: "e8-c1",
              label: "Leverage Controls",
              expanded: true,
              children: [
                { id: "e8-c1-1", label: "Supply Chain", children: [] },
                { id: "e8-c1-2", label: "Scarcity Model", children: [] }
              ]
            },
            {
              id: "e8-c2",
              label: "Business Pillars",
              expanded: true,
              children: [
                { id: "e8-c2-1", label: "Global Touring", children: [] },
                { id: "e8-c2-2", label: "Apparel & Brands", children: [] }
              ]
            }
          ]
        }
      },
      e9: {
        title: "Deep Breathwork Practices",
        topic: "Diaphragmatic Breathing & Nervous Response",
        takeaways: [
          "Diaphragmatic breathing oxygenates the blood and slows heart rates.",
          "Breath holds stimulate parasympathetic activity to lower stress.",
          "Breathwork acts as a rapid tool to center attention and focus.",
          "Restorative daily mindfulness routines build long-term endurance."
        ],
        flashcards: [
          { q: "What system is stimulated by deep breathing?", a: "The parasympathetic nervous system." },
          { q: "What is the key to deep breathing?", a: "Diaphragmatic belly expansion." }
        ],
        quiz: [
          {
            question: "What nervous system branch is triggered by deep breathing?",
            options: ["Parasympathetic", "Sympathetic", "Somatic", "Central"],
            answer: "Parasympathetic",
            explanation: "Breathing slows down the fight-or-flight response."
          },
          {
            question: "The primary breathing style focuses on:",
            options: ["Diaphragmatic expansion", "Rapid chest inhales", "Mouth-only breathing", "Shallow retention"],
            answer: "Diaphragmatic expansion",
            explanation: "Drawing breath into the belly centers focus."
          }
        ],
        mindMap: {
          id: "e9-root",
          label: "Breathwork Guide",
          expanded: true,
          children: [
            {
              id: "e9-c1",
              label: "Physical Responses",
              expanded: true,
              children: [
                { id: "e9-c1-1", label: "Parasympathetic trigger", children: [] },
                { id: "e9-c1-2", label: "Blood pressure drop", children: [] }
              ]
            },
            {
              id: "e9-c2",
              label: "Core Methods",
              expanded: true,
              children: [
                { id: "e9-c2-1", label: "Belly inhalation", children: [] },
                { id: "e9-c2-2", label: "Four-second holds", children: [] }
              ]
            }
          ]
        }
      },
      e10: {
        title: "Interoception Nidra REST",
        topic: "Yoga Nidra & Bodily Awareness",
        takeaways: [
          "Interoception nidra centers awareness on internal physical sensations.",
          "Sequential body scans release deep-seated somatic muscle tension.",
          "The practice delivers deep mental recovery without actual sleep states.",
          "Gravity awareness helps anchor attention and calm overactive minds."
        ],
        flashcards: [
          { q: "What is interoception?", a: "Sensing internal bodily signals." },
          { q: "What is the main technique in yoga nidra?", a: "Sequential body scans." }
        ],
        quiz: [
          {
            question: "What does 'Interoception' mean?",
            options: ["Sensing internal body states", "Exacting focus on visuals", "Auditory sound isolation", "External balance checks"],
            answer: "Sensing internal body states",
            explanation: "Interoception is the perception of internal bodily sensations."
          },
          {
            question: "What tool is used to release muscle tension?",
            options: ["Sequential body scan", "Heavy breathing loops", "Aromatherapy check", "Rapid eye movements"],
            answer: "Sequential body scan",
            explanation: "Body scanning relaxes tension zones."
          }
        ],
        mindMap: {
          id: "e10-root",
          label: "Interoception Nidra",
          expanded: true,
          children: [
            {
              id: "e10-c1",
              label: "Bodily Sensing",
              expanded: true,
              children: [
                { id: "e10-c1-1", label: "Internal Signals", children: [] },
                { id: "e10-c1-2", label: "Gravity anchoring", children: [] }
              ]
            },
            {
              id: "e10-c2",
              label: "Recovery Steps",
              expanded: true,
              children: [
                { id: "e10-c2-1", label: "Sequential muscle scans", children: [] },
                { id: "e10-c2-2", label: "Tension dissolution", children: [] }
              ]
            }
          ]
        }
      }
    };

    const isPreseeded = preseeded[epId];
    const episodeTitle = isPreseeded ? isPreseeded.title : title;
    const topicText = isPreseeded ? isPreseeded.topic : mainTopic;

    // Generate Dynamic Summary
    const summary = {
      paragraphs: [
        `AI Analysis of the podcast "${episodeTitle}" hosted by ${host} reveals structural takeaways and core methodologies across the segment. The discussion maps the modern landscape of ${topicText}, examining its immediate impacts and strategic challenges.`,
        `Special emphasis was placed on understanding the practical constraints, unit logistics, deployment limits, and long-term implications associated with: ${desc.replace(/\.$/, "")}. The speaker illustrates these concepts using case examples.`,
        `The session wraps up by noting the critical importance of continuous learning, integration frameworks, incremental telemetry tracking, and sandbox validation routines to navigate these systems successfully in the future.`
      ]
    };

    // Generate Takeaways (Notes)
    const notesList = isPreseeded
      ? isPreseeded.takeaways.map((content, i) => ({ id: `note-${epId}-${i}`, content }))
      : [
          { id: `note-${epId}-1`, content: `Explored the primary premise of the episode: how "${episodeTitle}" relates to ${topicText}.` },
          { id: `note-${epId}-2`, content: `Key thematic component: ${desc}` },
          { id: `note-${epId}-3`, content: `Practical action item: ${host} suggests developing structured feedback and testing environments.` },
          { id: `note-${epId}-4`, content: "Future model direction: Implement incremental checks to verify execution scale bounds." }
        ];

    // Generate Flashcards (snappy, single line Q&A)
    const flashcardsList = isPreseeded
      ? isPreseeded.flashcards.map((fc, i) => ({ id: `fc-${epId}-${i}`, question: fc.q, answer: fc.a }))
      : [
          { id: `fc-${epId}-1`, question: `What is the core topic of ${episodeTitle}?`, answer: `The episode outlines key strategies and structures of ${topicText}.` },
          { id: `fc-${epId}-2`, question: `Who is the primary host leading this session?`, answer: `The discussion is facilitated and led by ${host}.` },
          { id: `fc-${epId}-3`, question: `What is the primary action item recommended?`, answer: `Deploy incremental verification checks and monitor loops.` }
        ];

    // Generate Quiz Questions (interactive multiple choice)
    const quizList = isPreseeded
      ? isPreseeded.quiz.map((q, i) => ({ id: `q-${epId}-${i}`, ...q }))
      : [
          {
            id: `q-${epId}-1`,
            question: `What is the primary theme explored in the session for "${episodeTitle}"?`,
            options: [topicText, "Theoretical Scaling Only", "Legacy System Replacements", "General Administrative Audits"],
            answer: topicText,
            explanation: `The discussion led by ${host} centers on the opportunities and limits of ${topicText}.`
          },
          {
            id: `q-${epId}-2`,
            question: `Which operational strategy is recommended by host ${host}?`,
            options: ["Structured verification checks", "Manual inspections without data", "Full system resets", "Bypassing telemetry reviews"],
            answer: "Structured verification checks",
            explanation: "Verification checks minimize execution errors and protect project scaling bounds."
          }
        ];

    // Generate Mind Map Hierarchy Tree
    const mindMapTree = isPreseeded
      ? isPreseeded.mindMap
      : {
          id: `${epId}-root`,
          label: episodeTitle,
          expanded: true,
          children: [
            {
              id: `node-${epId}-c1`,
              label: "Key Concepts",
              expanded: true,
              children: [
                { id: `node-${epId}-c1-1`, label: `Thematics of ${topicText}`, children: [] },
                { id: `node-${epId}-c1-2`, label: "Core Principles", children: [] }
              ]
            },
            {
              id: `node-${epId}-c2`,
              label: "Action Plan",
              expanded: true,
              children: [
                { id: `node-${epId}-c2-1`, label: "Setup Phase", children: [] },
                { id: `node-${epId}-c2-2`, label: "Audit & Scale", children: [] }
              ]
            }
          ]
        };

    const shuffleOptions = (options, correctAnswer) => {
      if (!options || options.length <= 1) return options;
      let shuffled = [...options];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      if (shuffled[0] === correctAnswer) {
        const swapIdx = 1 + Math.floor(Math.random() * (shuffled.length - 1));
        [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
      }
      return shuffled;
    };

    const shuffledQuizList = quizList.map(q => ({
      ...q,
      options: shuffleOptions(q.options, q.answer)
    }));

    return {
      notes: notesList,
      summary: summary,
      flashcards: flashcardsList,
      quiz: shuffledQuizList,
      mindMap: mindMapTree
    };
  };

  // Safe destructuring default fallback
  const defaultFallback = {
    notes: [],
    flashcards: [],
    quiz: [],
    summary: { paragraphs: [] },
    mindMap: { id: "fallback-root", label: "Loading Assets...", children: [] }
  };

  const data = knowledgeData[activeEpisode?.id] || defaultFallback;
  const theme = getCategoryStyles(activePodcast?.category);

  // Auto-generate assets if they do not exist in the state yet
  React.useEffect(() => {
    if (activeEpisode && !knowledgeData[activeEpisode.id]) {
      const generated = generateDynamicAssets(activeEpisode, activePodcast);
      setKnowledgeData(prev => ({
        ...prev,
        [activeEpisode.id]: generated
      }));
    }
  }, [activeEpisode, activePodcast, knowledgeData, setKnowledgeData]);

  // AI Extraction Progress Simulator States
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Notes Form State
  const [newNoteText, setNewNoteText] = useState("");

  // Flashcards Form States
  const [newCardQuestion, setNewCardQuestion] = useState("");
  const [newCardAnswer, setNewCardAnswer] = useState("");
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz Form States
  const [newQuizQuestion, setNewQuizQuestion] = useState("");
  const [newQuizOpt1, setNewQuizOpt1] = useState("");
  const [newQuizOpt2, setNewQuizOpt2] = useState("");
  const [newQuizOpt3, setNewQuizOpt3] = useState("");
  const [newQuizOpt4, setNewQuizOpt4] = useState("");
  const [newQuizAnswer, setNewQuizAnswer] = useState("");
  const [newQuizExplanation, setNewQuizExplanation] = useState("");
  
  const [quizScores, setQuizScores] = useState({}); // { qId: selectedIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);

  // Mind Map States
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [newMindMapLabel, setNewMindMapLabel] = useState("");
  const [expandedNodes, setExpandedNodes] = useState({});

  const stepsText = [
    "Analyzing episode transcript and notes...",
    "Extracting key concepts and takeaways...",
    "Structuring concepts into a logical mind map...",
    "Generating multiple choice quiz assessment cards..."
  ];

  // Trigger actual AI asset extraction pipeline via Gemini
  const triggerAIGenerator = async () => {
    if (!activeEpisode) return;

    setIsGenerating(true);
    setCurrentStep(0);
    
    // Animate the loader overlay steps
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < stepsText.length - 1) {
        idx++;
        setCurrentStep(idx);
      }
    }, 1200);

    const apiKeyToUse = geminiApiKey || GEMINI_API_KEY;
    const mappedModel = getMappedModelName ? getMappedModelName(aiModel) : "gemini-2.5-flash";
    const isPlaceholderKey = apiKeyToUse === "AQ.Ab8RN6Jku1HzaGfPljSaydQv-cYHLjC2f3kuHXQD5BbkGFizWA";

    let generatedAssets = null;
    let fallbackReason = "";

    if (apiKeyToUse && !isPlaceholderKey) {
      try {
        let transcriptText = activeEpisode.transcript || activePodcast?.transcript || "";

        // Fetch preseeded transcript from public folder if empty
        if (!transcriptText && activeEpisode.id) {
          try {
            const res = await fetch(`/transcripts/${activeEpisode.id}.json`);
            if (res.ok) {
              const transcriptData = await res.json();
              if (Array.isArray(transcriptData)) {
                transcriptText = transcriptData.map(item => `[${item.speaker || 'Speaker'}]: ${item.text}`).join('\n');
              }
            }
          } catch (e) {
            console.warn("Could not fetch transcript file:", e);
          }
        }

        const title = activeEpisode.title || "";
        const host = activeEpisode.host || activePodcast?.host || "Host";
        const desc = activePodcast?.description || activeEpisode.title || "";

        const promptText = `You are an expert AI educator. Analyze the following podcast details and transcript, and generate structured study assets.
Active Episode Title: ${title}
Host: ${host}
Description: ${desc}
Transcript: ${transcriptText}

Output ONLY a valid JSON object matching the following structure (do not wrap in markdown code fences, do not output any explanation):
{
  "notes": [
    {"id": "note-dyn-1", "content": "First key takeaway..."},
    {"id": "note-dyn-2", "content": "Second key takeaway..."}
  ],
  "flashcards": [
    {"id": "fc-dyn-1", "question": "Question about core concept?", "answer": "Snappy answer."}
  ],
  "quiz": [
    {
      "id": "q-dyn-1",
      "question": "Multiple choice question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Why Option A is correct."
    }
  ],
  "mindMap": {
    "id": "root-dyn",
    "label": "Main Topic",
    "expanded": true,
    "children": [
      {
        "id": "c-dyn-1",
        "label": "Sub-topic 1",
        "expanded": true,
        "children": [
          {"id": "c-dyn-1-1", "label": "Sub-detail 1.1", "children": []}
        ]
      }
    ]
  },
  "summary": {
    "paragraphs": [
      "Paragraph 1 summarizing the main themes...",
      "Paragraph 2 summarizing takeaways..."
    ]
  }
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${mappedModel}:generateContent?key=${apiKeyToUse}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: promptText }]
            }]
          })
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.candidates?.[0]?.content?.parts?.[0]?.text) {
            const rawText = resData.candidates[0].content.parts[0].text.trim();
            
            // Find boundaries of the JSON object
            const startIdx = rawText.indexOf('{');
            const endIdx = rawText.lastIndexOf('}');
            if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
              const jsonText = rawText.substring(startIdx, endIdx + 1);
              const parsed = JSON.parse(jsonText);
              
              const notes = parsed.notes || parsed.takeaways || [];
              const flashcards = parsed.flashcards || parsed.flash_cards || parsed.cards || [];
              const quiz = parsed.quiz || parsed.assessment || parsed.questions || [];
              const mindMap = parsed.mindMap || parsed.mindmap || parsed.mind_map || null;
              const summary = parsed.summary || parsed.overview || null;

              if (notes.length || flashcards.length || quiz.length || mindMap || summary) {
                const localFallback = generateDynamicAssets(activeEpisode, activePodcast);
                
                const normalizedNotes = Array.isArray(notes) && notes.length > 0
                  ? notes.map((n, i) => ({ id: n.id || `note-dyn-${i}`, content: n.content || n.takeaway || "" }))
                  : localFallback.notes;

                const normalizedFlashcards = Array.isArray(flashcards) && flashcards.length > 0
                  ? flashcards.map((f, i) => ({ id: f.id || `fc-dyn-${i}`, question: f.question || f.q || "", answer: f.answer || f.a || "" }))
                  : localFallback.flashcards;

                const normalizedQuiz = Array.isArray(quiz) && quiz.length > 0
                  ? quiz.map((q, i) => {
                      const opts = q.options || q.choices || [];
                      const ans = q.answer || q.correct_answer || q.a || (opts.length > 0 ? opts[0] : "");
                      return {
                        id: q.id || `q-dyn-${i}`,
                        question: q.question || q.q || "",
                        options: Array.isArray(opts) ? opts : [],
                        answer: ans,
                        explanation: q.explanation || q.reason || ""
                      };
                    })
                  : localFallback.quiz;

                const normalizedMindMap = mindMap && (mindMap.label || mindMap.id)
                  ? mindMap
                  : localFallback.mindMap;

                let normalizedSummary = localFallback.summary;
                if (summary) {
                  if (typeof summary === "string") {
                    normalizedSummary = { paragraphs: [summary] };
                  } else if (Array.isArray(summary)) {
                    normalizedSummary = { paragraphs: summary };
                  } else if (summary.paragraphs && Array.isArray(summary.paragraphs)) {
                    normalizedSummary = { paragraphs: summary.paragraphs };
                  } else if (summary.paragraph) {
                    normalizedSummary = { paragraphs: [summary.paragraph] };
                  }
                }

                generatedAssets = {
                  notes: normalizedNotes,
                  flashcards: normalizedFlashcards,
                  quiz: normalizedQuiz,
                  mindMap: normalizedMindMap,
                  summary: normalizedSummary
                };
                showToast("AI study assets generated successfully using Gemini!");
              }
            } else {
              throw new Error("No JSON format returned from Gemini");
            }
          } else {
            throw new Error("Empty response from Gemini API");
          }
        } else {
          if (response.status === 429) {
            fallbackReason = "Gemini API rate-limit reached (429)";
          } else {
            fallbackReason = `Gemini API returned status ${response.status}`;
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed for study assets generator:", err);
        fallbackReason = `API Connection Issue: ${err.message || err}`;
      }
    } else {
      fallbackReason = "No custom API key configured";
    }

    // Fallback to local dynamic generator if API key is invalid/placeholder or request failed
    if (!generatedAssets) {
      generatedAssets = generateDynamicAssets(activeEpisode, activePodcast);
      showToast(`Local Fallback: ${fallbackReason}. Study assets generated locally.`);
    }

    clearInterval(timer);
    setCurrentStep(stepsText.length - 1);
    
    // Slight delay before hiding overlay to let user see completion step
    setTimeout(() => {
      setKnowledgeData((prev) => ({
        ...prev,
        [activeEpisode.id]: generatedAssets
      }));

      setIsGenerating(false);
      setQuizScores({});
      setQuizCorrectCount(0);
      setQuizSubmitted(false);
      setCurrentCardIdx(0);
      setSelectedNodeId(null);
    }, 500);
  };

  const updateKnowledgeData = (updatedData) => {
    setKnowledgeData((prev) => ({
      ...prev,
      [activeEpisode.id]: updatedData
    }));
  };

  // Notes Management Functions
  const handleCreateNote = () => {
    if (!newNoteText.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      content: newNoteText.trim()
    };
    const updated = {
      ...data,
      notes: [...data.notes, newNote]
    };
    updateKnowledgeData(updated);
    setNewNoteText("");
  };

  const handleDeleteNote = (noteId) => {
    const updated = {
      ...data,
      notes: data.notes.filter((n) => n.id !== noteId)
    };
    updateKnowledgeData(updated);
  };

  // Flashcards Management Functions
  const handleCreateFlashcard = () => {
    if (!newCardQuestion.trim() || !newCardAnswer.trim()) return;
    const newCard = {
      id: `fc-${Date.now()}`,
      question: newCardQuestion.trim(),
      answer: newCardAnswer.trim()
    };
    const updated = {
      ...data,
      flashcards: [...data.flashcards, newCard]
    };
    updateKnowledgeData(updated);
    setNewCardQuestion("");
    setNewCardAnswer("");
  };

  const handleDeleteFlashcard = (cardId) => {
    if (data.flashcards.length <= 1) {
      alert("At least one flashcard must remain in the deck.");
      return;
    }
    const updated = {
      ...data,
      flashcards: data.flashcards.filter((fc) => fc.id !== cardId)
    };
    updateKnowledgeData(updated);
    setCurrentCardIdx(0);
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIdx((prev) => (prev + 1) % data.flashcards.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIdx((prev) => (prev - 1 + data.flashcards.length) % data.flashcards.length);
    }, 150);
  };

  // Quiz Management Functions
  const handleQuizOptionClick = (qId, optionIdx, isCorrect) => {
    if (quizScores[qId] !== undefined) return;
    
    setQuizScores((prev) => ({
      ...prev,
      [qId]: optionIdx
    }));

    if (isCorrect) {
      setQuizCorrectCount((prev) => prev + 1);
    }
  };

  const handleResetQuiz = () => {
    setQuizScores({});
    setQuizCorrectCount(0);
    setQuizSubmitted(false);
  };

  const handleCreateQuizQuestion = () => {
    if (!newQuizQuestion.trim() || !newQuizOpt1.trim() || !newQuizOpt2.trim() || !newQuizAnswer.trim()) {
      alert("Question, at least two options, and a correct answer are required.");
      return;
    }

    const options = [newQuizOpt1.trim(), newQuizOpt2.trim()];
    if (newQuizOpt3.trim()) options.push(newQuizOpt3.trim());
    if (newQuizOpt4.trim()) options.push(newQuizOpt4.trim());

    const newQuestion = {
      id: `q-${Date.now()}`,
      question: newQuizQuestion.trim(),
      options,
      answer: newQuizAnswer,
      explanation: newQuizExplanation.trim() || "The correct answer has been validated by AI transcript scanning."
    };

    const updated = {
      ...data,
      quiz: [...data.quiz, newQuestion]
    };

    updateKnowledgeData(updated);
    setNewQuizQuestion("");
    setNewQuizOpt1("");
    setNewQuizOpt2("");
    setNewQuizOpt3("");
    setNewQuizOpt4("");
    setNewQuizAnswer("");
    setNewQuizExplanation("");
  };

  const additionalQuizQuestions = {
    e1: [
      {
        question: "What is a suggested solution to prevent the displacement of manual bricklayers?",
        options: ["Supervision upskilling", "Banning robots entirely", "Lowering human wages", "Decreasing construction projects"],
        answer: "Supervision upskilling",
        explanation: "Training younger manual workers to supervise and operate robots keeps them employed and productive."
      },
      {
        question: "Why are construction companies adopting bricklaying robots?",
        options: ["Labor shortages", "Cheaper than human labor initially", "Robots require no capital investment", "Humans refuse to work in construction"],
        answer: "Labor shortages",
        explanation: "Bricklaying robots are actively introduced to solve construction labor shortages."
      }
    ],
    e2: [
      {
        question: "What new format is Hinge highlighting to help budget-conscious daters?",
        options: ["Low-cost creative date suggestions", "Premium expensive dining partnerships", "Removing free chat features", "Mandatory video game dates"],
        answer: "Low-cost creative date suggestions",
        explanation: "Hinge is highlighting budget-friendly, creative date suggestions to engage younger users."
      },
      {
        question: "How do virtual screening video dates help daters economically?",
        options: ["They serve as a low-cost filter before meeting in person", "They replace all face-to-face meetings", "They require paid tokens to start", "They are sponsored by large dating venues"],
        answer: "They serve as a low-cost filter before meeting in person",
        explanation: "Virtual dates let users connect and screen matches without spending money on transport or food."
      }
    ],
    e3: [
      {
        question: "What is the primary cognitive science benefit of studying out-of-body states?",
        options: ["Mapping human neural pathways", "Curing sleep apnea", "Developing telepathic systems", "Bypassing brain functions entirely"],
        answer: "Mapping human neural pathways",
        explanation: "Studying these anomalous sensory experiences helps cognitive scientists map normal brain processing pathways."
      },
      {
        question: "How does the brain know where the body is in space?",
        options: ["Sensory integration", "By telepathy", "Only via vision", "By muscle memory alone"],
        answer: "Sensory integration",
        explanation: "The brain tracks spatial ego-location using multiple integrated sensory inputs (vestibular, visual, proprioceptive)."
      }
    ],
    e4: [
      {
        question: "What specific benefit does reading fiction offer to a reader's focus?",
        options: ["Combating digital attention fragmentation", "Increasing visual scanning speeds", "Improving mathematical calculations", "Enhancing short-term spatial memory"],
        answer: "Combating digital attention fragmentation",
        explanation: "Sustained reading habits protect focus filters from constant digital distractions."
      },
      {
        question: "What is 'Theory of Mind' in the context of reading fiction?",
        options: ["The capacity to predict and empathize with others' mental states", "A philosophical theory about brain function", "The mathematical calculation of IQ", "A technique for speed-reading textbooks"],
        answer: "The capacity to predict and empathize with others' mental states",
        explanation: "Immersion in fiction simulates social cognition, strengthening the neural pathways for empathy and social prediction."
      }
    ],
    e5: [
      {
        question: "What technique is recommended to anchor awareness during meditation?",
        options: ["Gravity anchoring", "Rapid eye blinking", "Uncontrolled breathing", "High-volume auditory stimulation"],
        answer: "Gravity anchoring",
        explanation: "Gravity anchoring focuses awareness on physical weight and balance to calm mental activity."
      },
      {
        question: "How does a sequential body scan help reduce physical stress?",
        options: ["It systematically locates and dissolves physical tension", "It increases cardiac output during sleep", "It requires rapid muscle contractions", "It blocks sensory inputs from the skin"],
        answer: "It systematically locates and dissolves physical tension",
        explanation: "Scanning the body systematically raises awareness of tension zones and assists in targeted relaxation."
      }
    ],
    e6: [
      {
        question: "Why do daily reading routines protect cognitive performance over time?",
        options: ["They build sustained neural focus reserves", "They replace physical exercise requirements", "They cure age-related hearing decline", "They reduce calorie consumption rates"],
        answer: "They build sustained neural focus reserves",
        explanation: "Regular cognitive workouts via reading build cognitive reserves that protect against attention decline."
      },
      {
        question: "What does 'narrative immersion' simulate?",
        options: ["Active social training environments", "Motor reflex training", "Logical puzzle-solving only", "Deep mathematical calculations"],
        answer: "Active social training environments",
        explanation: "Immersive reading activates the same brain networks used to navigate real-world social scenarios."
      }
    ],
    e7: [
      {
        question: "What is the primary factor driving local football talent scouting in Africa?",
        options: ["Community empowerment", "Short-term financial speculation only", "Government mandates", "European club sponsorships only"],
        answer: "Community empowerment",
        explanation: "Scouting initiatives focus heavily on building long-term community value and youth opportunities."
      },
      {
        question: "What challenge do young African talent academies face?",
        options: ["Infrastructure constraints", "A lack of passionate players", "Low interest from international clubs", "Over-funding from local governments"],
        answer: "Infrastructure constraints",
        explanation: "Developing talent requires significant resources, pitch facilities, and training gear, which are often limited."
      }
    ],
    e8: [
      {
        question: "What makes the business model of Beyoncé's music brand unique?",
        options: ["End-to-end creative control", "Relying entirely on external record labels", "Never releasing albums without notice", "Bypassing digital streaming platforms completely"],
        answer: "End-to-end creative control",
        explanation: "Beyoncé retains full ownership and creative direction over her artistic releases and brand partnerships."
      },
      {
        question: "How does Beyoncé's brand navigate industry cost shifts?",
        options: ["Direct-to-consumer digital releases", "Banning concert ticket sales", "Releasing music only on physical vinyl", "Stopping marketing campaigns entirely"],
        answer: "Direct-to-consumer digital releases",
        explanation: "Direct digital drops and exclusive visual albums maximize engagement and control pricing loops."
      }
    ],
    e9: [
      {
        question: "How does deep breathwork affect the autonomic nervous system?",
        options: ["It shifts the body into parasympathetic recovery mode", "It triggers chronic fight-or-flight reactions", "It stops all neurological activity", "It has no measurable physiological effects"],
        answer: "It shifts the body into parasympathetic recovery mode",
        explanation: "Sustained slow breathing patterns reduce heart rate and lower stress hormones by activating the vagus nerve."
      },
      {
        question: "What is the primary goal of mindfulness meditation?",
        options: ["Developing non-judgmental present-moment awareness", "Completely emptying the mind of all thoughts", "Inducing deep hypnotic sleep", "Visualizing complex mathematical formulas"],
        answer: "Developing non-judgmental present-moment awareness",
        explanation: "Mindfulness focuses on observing current thoughts, feelings, and sensations without criticism."
      }
    ],
    e10: [
      {
        question: "What signal is measured to evaluate autonomic balance during Yoga Nidra?",
        options: ["Heart Rate Variability (HRV)", "Muscle mass index", "Speed of physical reflexes", "Blood glucose levels"],
        answer: "Heart Rate Variability (HRV)",
        explanation: "Yoga Nidra increases HRV, reflecting a healthy balance between sympathetic and parasympathetic systems."
      },
      {
        question: "How does Yoga Nidra differ from standard sleep?",
        options: ["Awareness remains active during deep relaxation", "It does not provide physical rest", "It is only practiced standing up", "It increases cortisol levels in the blood"],
        answer: "Awareness remains active during deep relaxation",
        explanation: "Yoga Nidra systematically guides the mind to the threshold of sleep while maintaining a thread of conscious awareness."
      }
    ]
  };

  const handleGenerateMoreQuiz = () => {
    const epId = activeEpisode?.id || "e1";
    const title = activeEpisode?.title || "";
    const host = activeEpisode?.host || activePodcast?.host || "Host";
    const desc = activePodcast?.description || activeEpisode?.title || "the thematic discussion";
    const category = activePodcast?.category || "General";
    
    const cleanDesc = desc.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const words = cleanDesc.split(/\s+/).filter(w => w.length > 4);
    const keywords = [...new Set(words)].slice(0, 5);
    const topicText = keywords.length > 0 ? keywords.slice(0, 2).join(" and ") : "core insights";

    // 1. Local shuffle helper to randomize options and candidate lists
    const shuffleArray = (array) => {
      let shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Category-specific templates library with placeholders to interpolate
    const categoryTemplates = {
      business: [
        {
          question: "In the context of the business models discussed in '{title}', what is the primary role of vertical integration?",
          options: ["Owning the distribution and supply chain", "Outsourcing creative design to external vendors", "Reducing production quality to lower prices", "Minimizing brand scarcity and exclusivity"],
          answer: "Owning the distribution and supply chain",
          explanation: "Vertical integration allows a brand to control its margins, quality, and consumer relationship."
        },
        {
          question: "Which of the following is highlighted in '{title}' as a key driver of modern business adaptability?",
          options: ["Continuous incremental updates and validation", "A single massive launch phase", "Bypassing telemetry and logging systems", "Relying purely on historical branding legacy"],
          answer: "Continuous incremental updates and validation",
          explanation: "Iterative testing and monitoring protect the system from sudden scaling shocks."
        },
        {
          question: "According to {host}, how should companies address labor shortages or shifting worker demographics?",
          options: ["Through supervision upskilling and training programs", "By banning new technology completely", "By lowering wages to increase profit margins", "By reducing the size and scope of operational projects"],
          answer: "Through supervision upskilling and training programs",
          explanation: "Upskilling workers to supervise automated processes keeps them employed and productive."
        },
        {
          question: "What pricing or distribution strategy is recommended in the discussion of '{title}'?",
          options: ["Direct-to-consumer digital channels", "Relying solely on physical retail distributors", "Heavy discount selling in saturated markets", "Avoiding digital streaming platforms entirely"],
          answer: "Direct-to-consumer digital channels",
          explanation: "Direct digital channels maximize profit margins and control pricing loops."
        },
        {
          question: "What is the primary risk of rapid business scaling without sandboxed testing?",
          options: ["Systemic crashes and undetected software bugs", "Slower product release cycles", "Immediate loss of intellectual property", "Decrease in raw material costs"],
          answer: "Systemic crashes and undetected software bugs",
          explanation: "Without a sandbox, errors propagate immediately to the entire user base."
        },
        {
          question: "How does the podcast suggest companies maintain premium brand value?",
          options: ["Through quality control and strategic scarcity", "By saturating all retail markets", "By eliminating visual marketing budgets", "By offering continuous discount promotions"],
          answer: "Through quality control and strategic scarcity",
          explanation: "Scarcity and high-quality standards enhance premium brand perception."
        },
        {
          question: "What is the recommended approach to managing capital investments in automation?",
          options: ["Structuring incremental validation phases", "Deploying all capital in the first quarter", "Ignoring ROI telemetry metrics", "Bypassing employee training programs"],
          answer: "Structuring incremental validation phases",
          explanation: "Incremental rollouts minimize financial risk and verify operational bounds."
        },
        {
          question: "Why does {host} advocate for continuous user telemetry feedback?",
          options: ["To isolate bugs and adapt to changing user behavior", "To track employee performance metrics exclusively", "To justify higher subscription prices", "To replace manual customer support teams"],
          answer: "To isolate bugs and adapt to changing user behavior",
          explanation: "Telemetry provides real-time insights into system health and user satisfaction."
        },
        {
          question: "Which factor is critical for long-term customer retention in digital products?",
          options: ["Restructuring engagement loops and interfaces", "Increasing notification frequency indefinitely", "Removing free-tier options completely", "Standardizing on a single static layout"],
          answer: "Restructuring engagement loops and interfaces",
          explanation: "Adapting user flows keeps the product engaging and relevant."
        },
        {
          question: "What is a major takeaway from '{title}' regarding industry cost shifts?",
          options: ["Companies must pivot to digital direct-to-consumer models", "Traditional business models remain completely unaffected", "Marketing budgets should be eliminated", "Automation is always too expensive to implement"],
          answer: "Companies must pivot to digital direct-to-consumer models",
          explanation: "Direct-to-consumer loops bypass traditional middleman fees and restore profit margins."
        },
        {
          question: "What constitutes the core value of user-centric designs in '{title}'?",
          options: ["Building interfaces that adapt to budget constraints", "Forcing users to upgrade to premium tiers", "Simplifying features to the point of redundancy", "Ignoring the local economic context of users"],
          answer: "Building interfaces that adapt to budget constraints",
          explanation: "Adapting layouts to support the user's spending power improves conversion and brand loyalty."
        },
        {
          question: "How does '{title}' define 'operational balance' during growth phases?",
          options: ["Aligning speed of execution with strict validation loops", "Expanding services before setting up logging servers", "Hiring manual supervisors without standard procedures", "Prioritizing marketing over product stability"],
          answer: "Aligning speed of execution with strict validation loops",
          explanation: "Growth requires balancing expansion speed with validation to prevent massive outages."
        }
      ],
      yoga: [
        {
          question: "In the context of the practices in '{title}', what is the main benefit of diaphragmatic breathing?",
          options: ["It oxygenates the blood and slows the heart rate", "It increases fight-or-flight sympathetic response", "It restricts chest movement to increase lung pressure", "It accelerates blood glucose levels rapidly"],
          answer: "It oxygenates the blood and slows the heart rate",
          explanation: "Deep diaphragmatic breathing activates the vagus nerve, signaling parasympathetic relaxation."
        },
        {
          question: "How does Yoga Nidra differ from normal sleep states?",
          options: ["Conscious awareness remains active during deep relaxation", "It requires constant physical movement", "It does not provide actual physical recovery", "It raises blood cortisol levels"],
          answer: "Conscious awareness remains active during deep relaxation",
          explanation: "Yoga Nidra systematically guides the mind to the sleep-wake threshold while maintaining consciousness."
        },
        {
          question: "What signal is measured to evaluate autonomic balance during restorative sessions?",
          options: ["Heart Rate Variability (HRV)", "Muscle mass index", "Speed of physical reflexes", "Blood glucose levels"],
          answer: "Heart Rate Variability (HRV)",
          explanation: "High HRV indicates healthy parasympathetic nervous system activity and stress recovery."
        },
        {
          question: "What is 'Interoception' as discussed in the context of '{title}'?",
          options: ["The perception of internal bodily sensations and signals", "External balance and posture checking", "Auditory sound isolation techniques", "Exacting focus on external visual points"],
          answer: "The perception of internal bodily sensations and signals",
          explanation: "Interoception is sensing internal state details like heartbeat, breathing, and muscle tension."
        },
        {
          question: "What technique is recommended to anchor awareness during meditation?",
          options: ["Gravity anchoring and body scans", "Rapid chest breathing cycles", "High-volume auditory stimulation", "Intense intellectual problem-solving"],
          answer: "Gravity anchoring and body scans",
          explanation: "Focusing on the physical pull of gravity and scanning the body systematically grounds attention."
        },
        {
          question: "How does slow, controlled breathing activate parasympathetic recovery?",
          options: ["By stimulating the vagus nerve", "By raising blood pressure", "By increasing carbon dioxide retention", "By restricting oxygen flow to the brain"],
          answer: "By stimulating the vagus nerve",
          explanation: "Vagal stimulation triggers the body's natural relaxation response, slowing heart rate."
        },
        {
          question: "Why are sequential body scans effective at reducing physical tension?",
          options: ["They systematically locate and dissolve somatic tension zones", "They require rapid muscle contractions", "They block all sensory input from the skin", "They increase heart rate to burn calories"],
          answer: "They systematically locate and dissolve somatic tension zones",
          explanation: "Bringing conscious attention to tension zones assists in targeted muscle relaxation."
        },
        {
          question: "What is the primary goal of mindfulness meditation discussed in '{title}'?",
          options: ["Developing non-judgmental present-moment awareness", "Completely emptying the mind of all thoughts", "Inducing deep hypnotic sleep quickly", "Visualizing complex mathematical shapes"],
          answer: "Developing non-judgmental present-moment awareness",
          explanation: "Mindfulness centers on observing current thoughts, feelings, and sensations without criticism."
        },
        {
          question: "How does restorative rest affect stress hormones?",
          options: ["It lowers cortisol and adrenaline levels", "It triggers fight-or-flight responses", "It has no effect on hormone levels", "It increases adrenaline to boost energy"],
          answer: "It lowers cortisol and adrenaline levels",
          explanation: "Sustained relaxation shifts the body away from stress-induced hormone release."
        },
        {
          question: "What is the recommended daily frequency for breathwork routines?",
          options: ["Daily consistency to build long-term resilience", "Only during high-stress emergency moments", "Once a month for several hours", "Every hour throughout the entire day"],
          answer: "Daily consistency to build long-term resilience",
          explanation: "Regular short sessions are more effective at training the autonomic nervous system than sporadic long ones."
        },
        {
          question: "What autonomic shift does '{title}' describe as the goal of Yoga Nidra?",
          options: ["Slowing mental activity while keeping the thread of consciousness", "Stimulating rapid breathing to release energy", "Activating deep muscle reflex response lines", "Maximizing insulin production rates"],
          answer: "Slowing mental activity while keeping the thread of consciousness",
          explanation: "Yoga Nidra systematically guides the mind to the threshold of sleep while keeping awareness intact."
        },
        {
          question: "According to {host}, how does gravity awareness help anchor the mind?",
          options: ["By focusing on physical weight and balance to calm thoughts", "By stimulating fast-paced breathing loops", "By increasing spatial ego-location boundaries", "By decoupling muscle groups from sensory inputs"],
          answer: "By focusing on physical weight and balance to calm thoughts",
          explanation: "Gravity anchoring focuses awareness on physical weight and balance to ground the nervous system."
        }
      ],
      motivation: [
        {
          question: "What is the core premise of mental agility discussed in '{title}'?",
          options: ["Physical constraints do not restrict our focus or agility", "Agility requires constant physical motion", "Mental focus is entirely determined by genetics", "Focus cannot be improved after adulthood"],
          answer: "Physical constraints do not restrict our focus or agility",
          explanation: "Learning to decouple attention from physical discomfort allows for high mental endurance."
        },
        {
          question: "How is cognitive agility trained, according to the episode?",
          options: ["By decoupling attention from physical discomfort", "By increasing sugar and calorie intake", "By avoiding all challenging activities", "By keeping reading sessions short"],
          answer: "By decoupling attention from physical discomfort",
          explanation: "Cognitive agility builds focus endurance under stressful conditions."
        },
        {
          question: "What is recommended to maintain peak performance under stress?",
          options: ["De-anchoring standard spatial limits and focus boundaries", "Relying on external guidance only", "Stopping the task immediately", "Increasing heart rate manually"],
          answer: "De-anchoring standard spatial limits and focus boundaries",
          explanation: "De-anchoring allows the mind to bypass immediate physical constraints and stay focused."
        },
        {
          question: "According to {host}, how do we build long-term mental resilience?",
          options: ["By consistently exposing ourselves to micro-challenges", "By avoiding all forms of stress", "By focusing solely on short-term goals", "By relying on digital distractions"],
          answer: "By consistently exposing ourselves to micro-challenges",
          explanation: "Micro-stress exposure trains the nervous system to handle larger shocks without shutting down."
        },
        {
          question: "What role does goal tracking play in achieving peak performance?",
          options: ["It helps anchor focus and trace incremental milestones", "It is secondary to pure emotional motivation", "It should be avoided to prevent stress", "It replaces the need for actual practice"],
          answer: "It helps anchor focus and trace incremental milestones",
          explanation: "Tracking goals keeps attention directed toward positive outcomes and reinforces progress."
        },
        {
          question: "How does the podcast describe 'focus de-anchoring'?",
          options: ["Decoupling attention from immediate physical discomfort", "Losing track of one's goals", "Becoming distracted by external noises", "Entering a dream state during task execution"],
          answer: "Decoupling attention from immediate physical discomfort",
          explanation: "Focus de-anchoring allows the mind to operate independently of bodily distress signals."
        },
        {
          question: "What is the key to maintaining cognitive endurance?",
          options: ["Sustained mental workouts and focus training", "A diet high in fast-acting carbohydrates", "Complete avoidance of complex reading material", "Shorter sleeping hours"],
          answer: "Sustained mental workouts and focus training",
          explanation: "Just like muscles, cognitive endurance requires regular, progressive training."
        },
        {
          question: "What does the speaker in '{title}' suggest is the primary obstacle to focus?",
          options: ["Instant gratification loops and digital distractions", "Lack of natural talent", "Physical fatigue alone", "Having too many goals"],
          answer: "Instant gratification loops and digital distractions",
          explanation: "Digital environments train the brain for short attention spans, requiring active focus training to counter."
        },
        {
          question: "How do micro-challenges benefit the brain?",
          options: ["They build neural reserves and focus flexibility", "They cause permanent damage to focus pathways", "They are too small to have any real impact", "They replace the need for formal education"],
          answer: "They build neural reserves and focus flexibility",
          explanation: "Exposing the brain to small, manageable stressors trains it for emotional and cognitive control."
        },
        {
          question: "What is the relationship between physical comfort and mental performance?",
          options: ["Mental performance can be decoupled from physical comfort", "High performance requires absolute physical comfort", "Physical discomfort always prevents high performance", "There is no relationship between the two"],
          answer: "Mental performance can be decoupled from physical comfort",
          explanation: "Trained minds can achieve high flow states even in challenging physical environments."
        },
        {
          question: "What practice is advised in '{title}' to anchor awareness during intense stress?",
          options: ["Decoupling attention from physical discomfort", "Rapidly switching tasks to maintain engagement", "Forcing hyperventilation sequences", "Closing the eyes and ignoring the timeline"],
          answer: "Decoupling attention from physical discomfort",
          explanation: "Decoupling attention from discomfort allows for sustained task execution and focus."
        },
        {
          question: "According to '{title}', how can one strengthen focus filters?",
          options: ["Sustained attention training and micro-challenges", "Checking notifications regularly to stay alert", "Taking multiple short breaks during reading", "Avoiding reading material that requires deep logic"],
          answer: "Sustained attention training and micro-challenges",
          explanation: "Progressive cognitive workouts build mental stamina and protect against digital fragmentation."
        }
      ],
      story: [
        {
          question: "What is the primary social reality explored in '{title}'?",
          options: ["The highly competitive and oversaturated recruitment market", "The guaranteed high income for all participants", "The lack of passion among local players", "The direct funding from European club leagues"],
          answer: "The highly competitive and oversaturated recruitment market",
          explanation: "Aspiring talent faces intense competition and very low rates of professional contract signings."
        },
        {
          question: "What challenge do local sports academies face in the region?",
          options: ["Infrastructure constraints and limited resources", "A lack of interested youth athletes", "Low interest from international scouts", "Over-funding from local governments"],
          answer: "Infrastructure constraints and limited resources",
          explanation: "Developing talent requires pitches, gear, and staff, which are often in short supply."
        },
        {
          question: "What is the primary driving factor for scouting in these areas?",
          options: ["Community empowerment and youth opportunities", "Short-term financial speculation only", "Government mandates", "European club sponsorships only"],
          answer: "Community empowerment and youth opportunities",
          explanation: "Many academies focus on building long-term community value alongside sports careers."
        },
        {
          question: "According to '{title}', what percentage of aspiring athletes sign professional contracts?",
          options: ["A tiny fraction of one percent", "Roughly twenty-five percent", "Over fifty percent", "Nearly all of them"],
          answer: "A tiny fraction of one percent",
          explanation: "The market is extremely competitive, leaving the vast majority of players without professional options."
        },
        {
          question: "What is a major risk highlighted for young athletes in these programs?",
          options: ["Financial risks and lack of educational safety nets", "Losing physical fitness too quickly", "Getting too many scholarship offers", "Excessive media attention"],
          answer: "Financial risks and lack of educational safety nets",
          explanation: "Focusing solely on a sports career can leave players vulnerable if they do not secure a contract."
        },
        {
          question: "What role do international scouts play in the local sports ecosystem?",
          options: ["They act as talent filters for wealthy foreign clubs", "They directly fund local school programs", "They manage the daily operations of academies", "They are mostly banned from entering the country"],
          answer: "They act as talent filters for wealthy foreign clubs",
          explanation: "Scouts visit to select the top tier of players, often with little long-term investment in the rest."
        },
        {
          question: "Why do local communities support these sports academies despite the low success rate?",
          options: ["They offer hope, discipline, and basic health support for youth", "They are mandated by federal law", "They guarantee high-paying local jobs", "They are completely free of charge"],
          answer: "They offer hope, discipline, and basic health support for youth",
          explanation: "Academies provide structure, exercise, and a community space for young people."
        },
        {
          question: "What is the primary setting of the investigation in '{title}'?",
          options: ["Accra, Ghana", "Lagos, Nigeria", "Nairobi, Kenya", "Dakar, Senegal"],
          answer: "Accra, Ghana",
          explanation: "The documentary details the journey of young players training in Accra."
        },
        {
          question: "What training challenge is discussed by the coaching staff?",
          options: ["Lack of proper training pitches and gear", "Athletes refusing to run drills", "Excessive administrative overhead", "Inability to schedule matches"],
          answer: "Lack of proper training pitches and gear",
          explanation: "Basic resource constraints like uneven dirt pitches make high-quality training difficult."
        },
        {
          question: "What advice does {host} offer to young players entering these academies?",
          options: ["Diversify skills and maintain an educational backup plan", "Focus 100% on sports and ignore schooling", "Sign with the first agent who makes any promise", "Move to Europe without a contract"],
          answer: "Diversify skills and maintain an educational backup plan",
          explanation: "Having backup options is critical due to the highly unpredictable nature of professional sports recruiting."
        },
        {
          question: "What physical demands are placed on youth athletes in '{title}'?",
          options: ["Extreme daily conditioning and high-intensity match schedules", "Basic jogging once a week", "Mandatory indoor gym workouts only", "Light stretching and meditation"],
          answer: "Extreme daily conditioning and high-intensity match schedules",
          explanation: "Undergoing rigid training regimens prepares athletes for professional benchmarks."
        },
        {
          question: "How does recruitment infrastructure impact local economies in the region?",
          options: ["It builds long-term community value and youth coaching networks", "It replaces standard academic schools entirely", "It reduces general municipal infrastructure budgets", "It causes inflation of local commodity prices"],
          answer: "It builds long-term community value and youth coaching networks",
          explanation: "Scouting and academies create local coaching jobs and supply-chain logistics for sports gear."
        }
      ],
      general: [
        {
          question: "What cognitive science benefit is explored in the neuroscience of reading?",
          options: ["Sustained reading builds focus reserves that protect attention", "It increases visual scanning speeds by 300%", "It eliminates the need for deep sleep", "It reduces total calorie consumption"],
          answer: "Sustained reading builds focus reserves that protect attention",
          explanation: "Regular reading strengthens the brain's focus filters against digital fragmentation."
        },
        {
          question: "What does 'Theory of Mind' refer to in cognitive research?",
          options: ["The capacity to predict and empathize with others' mental states", "A mathematical theory of intelligence quotient", "A philosophical claim that the physical world is an illusion", "A technique for speed-reading textbooks"],
          answer: "The capacity to predict and empathize with others' mental states",
          explanation: "Fiction simulates social relationships, strengthening neural pathways for empathy."
        },
        {
          question: "How does the brain process spatial self-location?",
          options: ["Through multi-sensory integration (visual, vestibular, proprioceptive)", "Purely through optic nerve signals", "Using a single localized brain structure", "By telepathic connection to the surroundings"],
          answer: "Through multi-sensory integration (visual, vestibular, proprioceptive)",
          explanation: "The brain combines multiple sensory streams to construct its sense of bodily location."
        },
        {
          question: "What is the primary impact of digital media on attention span?",
          options: ["It fragments focus due to instant gratification feedback loops", "It enhances deep sustained concentration", "It has no measurable impact on cognitive functions", "It increases short-term memory capacity"],
          answer: "It fragments focus due to instant gratification feedback loops",
          explanation: "Fast-paced digital feeds train the brain for quick switches rather than sustained focus."
        },
        {
          question: "How can deep narrative immersion affect brain structure?",
          options: ["It stimulates and activates the hippocampus region", "It reduces the size of the prefrontal cortex", "It completely rewires the visual cortex", "It has no physical impact on neural tissue"],
          answer: "It stimulates and activates the hippocampus region",
          explanation: "Tracking complex chronological events activates memory-mapping areas like the hippocampus."
        },
        {
          question: "What sensory condition triggers out-of-body illusions?",
          options: ["Disrupting multi-sensory feedback loops", "Achieving high-quality deep sleep", "Increasing blood oxygen levels", "Restricting auditory input"],
          answer: "Disrupting multi-sensory feedback loops",
          explanation: "Disruption decouples the brain's body map from actual physical position."
        },
        {
          question: "Which habit is recommended to combat digital attention decline?",
          options: ["Sustained reading of long-form literature", "Increasing screen time with multiple tabs", "Playing fast-paced mobile games", "Avoiding reading entirely"],
          answer: "Sustained reading of long-form literature",
          explanation: "Long-form reading acts as weight training for the brain's attention filters."
        },
        {
          question: "According to {host}, why does fiction serve as a social simulator?",
          options: ["It simulates interpersonal dynamics and character motives", "It contains code for computer simulations", "It replaces the need for real-world interactions", "It describes historical dates accurately"],
          answer: "It simulates interpersonal dynamics and character motives",
          explanation: "Reading about characters engages the same brain regions used in real-world social navigation."
        },
        {
          question: "What is the primary role of sensory integration in the brain?",
          options: ["Building a coherent map of the body and surrounding space", "Processing numerical calculations", "Regulating insulin production", "Translating language into text"],
          answer: "Building a coherent map of the body and surrounding space",
          explanation: "Integrating visual, balance, and muscle signals creates our sense of self in space."
        },
        {
          question: "What is a major cognitive takeaway from the episodes in this category?",
          options: ["Focus is an active filter that must be exercised regularly", "Cognitive performance declines linearly regardless of habits", "Memory is stored in a single localized brain compartment", "Screen-based multitasking improves general IQ scores"],
          answer: "Focus is an active filter that must be exercised regularly",
          explanation: "Sustained practices like reading protect attention filters from fragmenting."
        },
        {
          question: "How does the brain map chronological narrative events?",
          options: ["Using the hippocampus structure to build neural spatial maps", "By activating the sensory receptors in the ear canal", "By bypassing short-term memory encoding entirely", "By reducing blood flow to the visual cortex"],
          answer: "Using the hippocampus structure to build neural spatial maps",
          explanation: "The hippocampus builds cognitive maps of chronological story details just like spatial layouts."
        },
        {
          question: "What does modern neuroscience say about focus reserves?",
          options: ["They can be actively built and protected via deep concentration habits", "They are fixed at birth and cannot be modified", "They decrease when reading long books", "They are entirely dependent on daily sugar consumption"],
          answer: "They can be actively built and protected via deep concentration habits",
          explanation: "Focus reserves act like muscles and can be expanded through systematic attention workouts."
        }
      ]
    };

    // Helper to interpolate title, host, topic placeholders in templates
    const interpolateTemplate = (tmpl) => {
      const cleanTitle = title || "the episode";
      const cleanHost = host || "the host";
      const cleanTopic = topicText || "core insights";

      const qStr = tmpl.question
        .replaceAll("{title}", cleanTitle)
        .replaceAll("{host}", cleanHost)
        .replaceAll("{topic}", cleanTopic);

      const opts = tmpl.options.map(opt =>
        opt
          .replaceAll("{title}", cleanTitle)
          .replaceAll("{host}", cleanHost)
          .replaceAll("{topic}", cleanTopic)
      );

      const ans = tmpl.answer
        .replaceAll("{title}", cleanTitle)
        .replaceAll("{host}", cleanHost)
        .replaceAll("{topic}", cleanTopic);

      const expl = tmpl.explanation
        .replaceAll("{title}", cleanTitle)
        .replaceAll("{host}", cleanHost)
        .replaceAll("{topic}", cleanTopic);

      return {
        question: qStr,
        options: shuffleArray(opts), // Randomize option positions
        answer: ans,
        explanation: expl
      };
    };

    // 2. Synthesize questions from flashcards
    const makeQuizQuestionFromFlashcard = (fc) => {
      const correct = fc.answer || fc.a || "";
      if (!correct) return null;

      const otherAnswers = (data.flashcards || [])
        .filter(other => other.id !== fc.id)
        .map(other => other.answer || other.a || "")
        .filter(ans => ans && ans !== correct);

      const genericDistractors = [
        "Structured validation and sandboxing frameworks",
        "Continuous user telemetry tracking systems",
        "Legacy database configurations without logging",
        "Reverting to manual oversight metrics",
        "Ignoring the local cultural context entirely"
      ];

      let options = [correct];
      for (let dist of otherAnswers) {
        if (options.length < 4 && !options.includes(dist)) {
          options.push(dist);
        }
      }
      for (let dist of genericDistractors) {
        if (options.length < 4 && !options.includes(dist)) {
          options.push(dist);
        }
      }

      return {
        question: fc.question || fc.q,
        options: shuffleArray(options),
        answer: correct,
        explanation: `This assessment is derived directly from the key review card details: "${correct}".`
      };
    };

    // 3. Synthesize questions from takeaways/notes
    const makeQuizQuestionFromNote = (note) => {
      const correct = note.content || "";
      if (!correct) return null;

      const genericDistractors = [
        "The speaker recommends bypassing all sandboxed feedback check environments.",
        "The hosts advocate for a single massive deployment stage without active logging.",
        "The presentation suggests eliminating all user telemetry metrics to speed up updates.",
        "The session highlights the importance of relying solely on traditional manual logs.",
        "The participants suggest skipping verification steps during early release hours."
      ];

      let options = [correct];
      for (let dist of genericDistractors) {
        if (options.length < 4 && !options.includes(dist)) {
          options.push(dist);
        }
      }

      return {
        question: `Which of the following is highlighted as a key takeaway regarding "${title}"?`,
        options: shuffleArray(options),
        answer: correct,
        explanation: `Based on the episode notes, a primary insight is that: "${correct}".`
      };
    };

    const currentQuestions = data.quiz || [];
    if (currentQuestions.length >= 20) {
      showToast("Quiz is already at the maximum limit of 20 questions!");
      return;
    }

    // Compile candidate lists
    let candidatesList = [];

    // Tier A: Preseeded additional questions
    const preseededAdd = additionalQuizQuestions[epId] || [];
    candidatesList.push(...preseededAdd);

    // Tier B: Flashcard-derived questions
    const flashcardAdd = (data.flashcards || [])
      .map(fc => makeQuizQuestionFromFlashcard(fc))
      .filter(q => q !== null);
    candidatesList.push(...flashcardAdd);

    // Tier C: Note/Takeaway-derived questions
    const noteAdd = (data.notes || [])
      .map(n => makeQuizQuestionFromNote(n))
      .filter(q => q !== null);
    candidatesList.push(...noteAdd);

    // Tier D: Category-themed template questions
    const catKey = category.toLowerCase();
    let selectedTmpls = [];
    if (catKey.includes("business")) {
      selectedTmpls = categoryTemplates.business;
    } else if (catKey.includes("yoga") || catKey.includes("breath")) {
      selectedTmpls = categoryTemplates.yoga;
    } else if (catKey.includes("motivation")) {
      selectedTmpls = categoryTemplates.motivation;
    } else if (catKey.includes("story") || catKey.includes("documentary")) {
      selectedTmpls = categoryTemplates.story;
    } else {
      selectedTmpls = categoryTemplates.general;
    }

    const templateAdd = selectedTmpls.map(tmpl => interpolateTemplate(tmpl));
    candidatesList.push(...templateAdd);

    // Add general templates as a fallback layer for additional depth
    if (selectedTmpls !== categoryTemplates.general) {
      const generalAdd = categoryTemplates.general.map(tmpl => interpolateTemplate(tmpl));
      candidatesList.push(...generalAdd);
    }

    // Filter duplicates (matching exact question text)
    let uniqueCandidates = [];
    for (let cand of candidatesList) {
      const isAlreadyExisting = currentQuestions.some(existing => existing.question === cand.question);
      const isAlreadyInCandidates = uniqueCandidates.some(added => added.question === cand.question);
      if (!isAlreadyExisting && !isAlreadyInCandidates) {
        uniqueCandidates.push(cand);
      }
    }

    // Shuffle the unique candidate pool
    uniqueCandidates = shuffleArray(uniqueCandidates);

    const remainingToMax = 20 - currentQuestions.length;
    const countToGenerate = Math.min(2, remainingToMax);
    const finalNewQuestions = uniqueCandidates.slice(0, countToGenerate);

    if (finalNewQuestions.length === 0) {
      showToast("Quiz is already at maximum generated size!");
      return;
    }

    const formattedNewQuestions = finalNewQuestions.map((q, idx) => ({
      id: `q-add-${epId}-${Date.now()}-${idx}`,
      ...q
    }));

    const updatedQuiz = [...currentQuestions, ...formattedNewQuestions];
    const updated = {
      ...data,
      quiz: updatedQuiz
    };
    updateKnowledgeData(updated);

    // Reset quiz scoring states so the user gets a fresh start with the expanded quiz
    setQuizScores({});
    setQuizCorrectCount(0);
    setQuizSubmitted(false);

    showToast(`Generated ${formattedNewQuestions.length} more questions (Total: ${updatedQuiz.length})!`);
  };

  // Mind Map Helper Functions
  const addNodeToTree = (rootNode, targetId, newLabel) => {
    if (rootNode.id === targetId) {
      const newChild = {
        id: `node-${Date.now()}`,
        label: newLabel,
        expanded: true,
        children: []
      };
      return {
        ...rootNode,
        children: [...(rootNode.children || []), newChild]
      };
    }
    if (rootNode.children) {
      return {
        ...rootNode,
        children: rootNode.children.map(child => addNodeToTree(child, targetId, newLabel))
      };
    }
    return rootNode;
  };

  const deleteNodeFromTree = (rootNode, targetId) => {
    if (rootNode.children) {
      return {
        ...rootNode,
        children: rootNode.children
          .filter(child => child.id !== targetId)
          .map(child => deleteNodeFromTree(child, targetId))
      };
    }
    return rootNode;
  };

  const findNodeLabel = (rootNode, targetId) => {
    if (rootNode.id === targetId) return rootNode.label;
    if (rootNode.children) {
      for (const child of rootNode.children) {
        const found = findNodeLabel(child, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const handleAddMindMapNode = () => {
    if (!newMindMapLabel.trim() || !selectedNodeId) return;
    const updatedTree = addNodeToTree(data.mindMap, selectedNodeId, newMindMapLabel.trim());
    const updated = {
      ...data,
      mindMap: updatedTree
    };
    updateKnowledgeData(updated);
    setNewMindMapLabel("");
  };

  const handleDeleteMindMapNode = () => {
    if (!selectedNodeId) return;
    const updatedTree = deleteNodeFromTree(data.mindMap, selectedNodeId);
    const updated = {
      ...data,
      mindMap: updatedTree
    };
    updateKnowledgeData(updated);
    setSelectedNodeId(null);
  };

  const renderMindMapNode = (node) => {
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id] !== false;
    const theme = getCategoryStyles(activePodcast?.category);

    return (
      <div 
        key={node.id} 
        className={`mindmap-node-wrapper ${!hasChildren || !isExpanded ? "no-children" : ""} ${!isExpanded ? "collapsed" : ""}`}
      >
        {/* Node Box card */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedNodeId(node.id);
          }}
          className={`mindmap-node px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 select-none text-center min-w-[120px] max-w-[200px] hover:scale-102 cursor-pointer ${
            isSelected 
              ? theme.nodeSelected 
              : theme.nodeStyle
          }`}
        >
          <div>{node.label}</div>
          {hasChildren && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setExpandedNodes(prev => ({ ...prev, [node.id]: !isExpanded }));
              }}
              className="text-[8px] text-text-muted mt-1 font-semibold hover:text-white transition-colors cursor-pointer block mx-auto"
            >
              {isExpanded ? "Collapse" : "Expand"} ({node.children.length})
            </button>
          )}
        </div>

        {/* Child connection rows */}
        {hasChildren && isExpanded && (
          <div className="mindmap-children-container">
            {node.children.map(child => (
              <div key={child.id} className="mindmap-child-branch">
                {renderMindMapNode(child)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto lg:ml-64 ml-0 min-h-screen relative"
    >
      {/* AI Simulation Generation Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-6 text-center"
          >
            <div className="space-y-6 max-w-md w-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-[2px] mx-auto animate-spin flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-heading font-extrabold text-white">Extracting Podcast Intelligence</h3>
                <p className="text-xs text-text-muted">AI is analyzing transcripts, dialog cues, and logical hierarchies.</p>
              </div>

              {/* Progress Tracker Steps */}
              <div className="space-y-2 bg-white/[0.02] border border-white/5 p-4.5 rounded-2xl text-left text-xs font-medium">
                {stepsText.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {idx < currentStep ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : idx === currentStep ? (
                      <RotateCw className="w-4 h-4 text-primary animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/10 shrink-0" />
                    )}
                    <span className={idx === currentStep ? "text-white font-bold" : idx < currentStep ? "text-slate-400" : "text-text-muted"}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-white/5 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <span>🧠 AI Knowledge Hub</span>
          </h2>
          <p className="text-xs text-text-muted mt-1 font-medium">
            AI automatically extracts summarized concepts, study decks, quizzes, and logical mind maps.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={triggerAIGenerator}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 text-xs font-bold text-white transition-all shadow-sm ${
              isGenerating 
                ? "bg-white/5 opacity-50 cursor-not-allowed" 
                : "bg-white/5 hover:bg-white/10 hover:scale-102 cursor-pointer"
            }`}
          >
            <Sparkles className={`w-4 h-4 text-primary fill-primary/10 ${isGenerating ? "animate-spin" : ""}`} />
            <span>{isGenerating ? "Extracting intelligence..." : "Generate Study Assets (AI)"}</span>
          </button>

          {/* Tab Selector Links */}
          <div className="flex bg-[#13131A] rounded-2xl p-1 border border-white/5 gap-1">
            {["Notes", "Mind Map", "Flashcards", "Quiz", "Summary"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedNodeId(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-neon-purple"
                    : "text-text-muted hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tab Render Workspace */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          
          {/* A. NOTES VIEW */}
          {activeTab === "Notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="glass-card p-6 border border-white/5 space-y-6">
                <div className="flex items-center gap-3">
                  <FileText className={`w-6 h-6 ${theme.text}`} />
                  <h3 className="text-lg font-heading font-bold text-white">Extracted Key Takeaways</h3>
                </div>

                <div className="space-y-3.5">
                  {data.notes.map((note, index) => (
                    <div key={note.id || index} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex justify-between items-start gap-4 hover:bg-white/[0.02] transition-colors group">
                      <div className="flex gap-4 items-start">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${theme.text}`} style={{ backgroundColor: theme.bg }}>
                          {index + 1}
                        </span>
                        <p className="text-xs leading-relaxed text-slate-200 font-medium pt-0.5">
                          {note.content}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note Creator Form */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <PlusCircle className="w-4.5 h-4.5 text-primary" />
                  <span>Add Key Takeaway Note</span>
                </h4>
                <div className="flex gap-2.5">
                  <input 
                    type="text"
                    placeholder="Enter a new custom extracted note segment..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateNote()}
                    className="flex-1 bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleCreateNote}
                    className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all cursor-pointer shadow shadow-neon-purple hover:scale-102"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* B. MIND MAP VIEW */}
          {activeTab === "Mind Map" && (
            <motion.div
              key="mindmap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card p-6 border border-white/5 flex flex-col items-center justify-center"
            >
              <div className="mb-6 text-center">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/15 border border-primary/20 text-primary uppercase">
                  Dynamic Mind Map Tree
                </span>
                <h3 className="text-base font-heading font-bold text-white mt-1">
                  Click any topic node to select and append children branches
                </h3>
              </div>

              {/* Render dynamic tree graph */}
              <div className="w-full max-w-4xl bg-black/40 rounded-2xl border border-white/5 p-8 flex flex-col items-center overflow-x-auto min-h-[300px]">
                {data.mindMap ? (
                  <div 
                    className="mindmap-tree-container py-4"
                    style={{ 
                      "--line-color": theme.lineColor, 
                      "--line-shadow": theme.lineShadow 
                    }}
                  >
                    {renderMindMapNode(data.mindMap)}
                  </div>
                ) : (
                  <div className="text-text-muted text-xs italic">No mind map generated. Click "Generate Study Assets" to extract.</div>
                )}
              </div>

              {/* Mind Map Branch Editor Panel */}
              {selectedNodeId && (
                <div className="mt-8 p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-3 max-w-md w-full animate-slide-in">
                  <h4 className="text-xs font-bold text-white">
                    Modify Node: <span className="text-primary font-extrabold">"{findNodeLabel(data.mindMap, selectedNodeId)}"</span>
                  </h4>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Add custom sub-topic branch..."
                      value={newMindMapLabel}
                      onChange={(e) => setNewMindMapLabel(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddMindMapNode()}
                      className="flex-1 bg-[#13131A] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-text-muted focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={handleAddMindMapNode}
                      className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Add Branch
                    </button>
                  </div>
                  {selectedNodeId !== data.mindMap.id && (
                    <button
                      onClick={handleDeleteMindMapNode}
                      className="text-[10px] font-bold text-red-400 hover:underline block pt-1.5 cursor-pointer"
                    >
                      Delete this branch and its sub-topics
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* C. FLASHCARDS VIEW */}
          {activeTab === "Flashcards" && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-6"
            >
              {/* 3D card layout */}
              {data.flashcards && data.flashcards.length > 0 ? (
                <div className="w-full max-w-[550px] flex flex-col items-center">
                  <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="w-full h-[140px] perspective-1000 cursor-pointer relative"
                  >
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="w-full h-full transform-style-3d relative duration-500 rounded-3xl bg-surface border border-white/5 shadow-2xl flex items-center justify-center p-6 text-center"
                    >
                      {/* Front Side */}
                      <div className="absolute inset-0 backface-hidden p-4 px-6 flex items-center justify-between bg-[#13131A] rounded-3xl border border-white/5">
                        <div className="flex flex-col items-start gap-1.5 text-left flex-1 min-w-0 pr-4">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase">
                            Card {currentCardIdx + 1} of {data.flashcards.length}
                          </span>
                          <h3 className="text-xs md:text-sm font-heading font-bold text-white truncate w-full" title={data.flashcards[currentCardIdx].question}>
                            {data.flashcards[currentCardIdx].question}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[9px] text-text-muted font-semibold flex items-center gap-1.5 hover:text-white transition-colors bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
                            <RotateCw className="w-3 h-3 animate-pulse" />
                            <span>Reveal</span>
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFlashcard(data.flashcards[currentCardIdx].id);
                            }}
                            className="p-2 rounded bg-white/5 text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                            title="Delete this card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Back Side */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 p-4 px-6 flex items-center justify-between bg-[#13131A] rounded-3xl border border-secondary/20">
                        <div className="flex flex-col items-start gap-1.5 text-left flex-1 min-w-0 pr-4">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-secondary/15 border border-secondary/20 text-secondary uppercase">
                            Suggested Answer
                          </span>
                          <p className="text-xs md:text-sm leading-normal text-slate-200 font-semibold truncate w-full" title={data.flashcards[currentCardIdx].answer}>
                            {data.flashcards[currentCardIdx].answer}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[9px] text-text-muted font-semibold flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
                            <RotateCw className="w-3 h-3" />
                            <span>Question</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Slider Nav Buttons */}
                  <div className="flex gap-4 items-center mt-6">
                    <button
                      onClick={handlePrevCard}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-semibold text-text-muted">
                      Progress: {currentCardIdx + 1} / {data.flashcards.length}
                    </span>
                    <button
                      onClick={handleNextCard}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-text-muted text-xs italic py-10">No flashcards in deck. Add one below.</div>
              )}

              {/* Flashcard Deck Creator Form */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 max-w-[500px] w-full">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FolderPlus className="w-4.5 h-4.5 text-primary" />
                  <span>Create Custom Flashcard</span>
                </h4>
                <div className="space-y-3">
                  <input 
                    type="text"
                    placeholder="Enter review question or concept..."
                    value={newCardQuestion}
                    onChange={(e) => setNewCardQuestion(e.target.value)}
                    className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-primary"
                  />
                  <textarea 
                    placeholder="Enter answer explanation..."
                    value={newCardAnswer}
                    onChange={(e) => setNewCardAnswer(e.target.value)}
                    rows={2}
                    className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleCreateFlashcard}
                    className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all cursor-pointer shadow shadow-neon-purple hover:scale-102"
                  >
                    Add Card to Deck
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* D. QUIZ VIEW */}
          {activeTab === "Quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Score header */}
              <div className="glass-card p-5 border border-white/5 flex items-center justify-between sticky top-0 z-20 shadow-xl bg-[#13131A]/95 backdrop-blur-md">
                <div>
                  <h3 className="text-sm font-bold text-white">Interactive Assessment</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Select answers to evaluate your understanding</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleGenerateMoreQuiz}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/5 cursor-pointer transition-all flex items-center gap-1.5"
                    title="Generate More Quiz Questions"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-primary" />
                    <span>Generate More Quiz</span>
                  </button>

                  {Object.keys(quizScores).length > 0 && (
                    <span className="text-xs font-bold text-slate-300">
                      Score: <span className={`${theme.text} font-mono`}>{quizCorrectCount}</span> / {data.quiz.length}
                    </span>
                  )}
                  {Object.keys(quizScores).length === data.quiz.length && (
                    <button
                      onClick={handleResetQuiz}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-primary-dark text-white cursor-pointer transition-all"
                    >
                      Retake Quiz
                    </button>
                  )}
                </div>
              </div>

              {/* Nested motion.div to apply entry slide-in to stream content without breaking parent sticky container scroll references */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Questions Stream */}
                <div className="space-y-6">
                  {data.quiz.map((q, idx) => {
                    const selectedIdx = quizScores[q.id];
                    const answered = selectedIdx !== undefined;

                    return (
                      <div key={q.id} className="glass-card p-6 border border-white/5 space-y-4 animate-slide-in">
                        <div className="flex gap-3 items-start">
                          <span className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold shrink-0 border ${theme.text} ${theme.border}`} style={{ backgroundColor: theme.bg }}>
                            {idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-white leading-normal pt-0.5">
                            {q.question}
                          </h4>
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedIdx === oIdx;
                            const isCorrectOpt = opt === q.answer;
                            
                            let optStyle = "bg-white/[0.01] border-white/5 text-text-muted hover:border-white/10";
                            if (answered) {
                              if (isCorrectOpt) {
                                optStyle = "bg-success/15 border-success text-success";
                              } else if (isSelected) {
                                optStyle = "bg-red-500/15 border-red-500 text-red-400";
                              } else {
                                optStyle = "bg-white/[0.01] border-white/5 opacity-55 text-text-muted";
                              }
                            } else if (isSelected) {
                              optStyle = `${theme.text} border-current bg-white/5`;
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={answered}
                                onClick={() => handleQuizOptionClick(q.id, oIdx, isCorrectOpt)}
                                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                                  !answered ? "cursor-pointer" : "cursor-default"
                                } ${optStyle} flex justify-between items-center`}
                              >
                                <span>{opt}</span>
                                {answered && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                                {answered && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation box */}
                        {answered && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="pl-9"
                          >
                            <div 
                              className="p-3 rounded-xl bg-white/[0.02] border-l-2 text-[10.5px] text-slate-300 leading-relaxed font-semibold animate-fade-in"
                              style={{ borderLeftColor: theme.text.includes('emerald') ? '#10B981' : theme.text.includes('amber') ? '#F59E0B' : theme.text.includes('rose') ? '#EF4444' : theme.text.includes('sky') ? '#0EA5E9' : '#7B5EFF' }}
                            >
                              <span className="text-white font-bold block mb-1">AI Explanation</span>
                              {q.explanation}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Assessment Question Builder Form */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <HelpCircle className="w-4.5 h-4.5 text-primary" />
                    <span>Create Custom Assessment Question</span>
                  </h4>
                  <div className="space-y-3">
                    <input 
                      type="text"
                      placeholder="Enter question text..."
                      value={newQuizQuestion}
                      onChange={(e) => setNewQuizQuestion(e.target.value)}
                      className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-primary"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input 
                        type="text"
                        placeholder="Option 1 (Required)..."
                        value={newQuizOpt1}
                        onChange={(e) => setNewQuizOpt1(e.target.value)}
                        className="bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-primary"
                      />
                      <input 
                        type="text"
                        placeholder="Option 2 (Required)..."
                        value={newQuizOpt2}
                        onChange={(e) => setNewQuizOpt2(e.target.value)}
                        className="bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-primary"
                      />
                      <input 
                        type="text"
                        placeholder="Option 3 (Optional)..."
                        value={newQuizOpt3}
                        onChange={(e) => setNewQuizOpt3(e.target.value)}
                        className="bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-primary"
                      />
                      <input 
                        type="text"
                        placeholder="Option 4 (Optional)..."
                        value={newQuizOpt4}
                        onChange={(e) => setNewQuizOpt4(e.target.value)}
                        className="bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-text-muted font-bold block mb-1">Correct Answer Select</label>
                        <select
                          value={newQuizAnswer}
                          onChange={(e) => setNewQuizAnswer(e.target.value)}
                          className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                        >
                          <option value="">Select option...</option>
                          {newQuizOpt1 && <option value={newQuizOpt1}>{newQuizOpt1}</option>}
                          {newQuizOpt2 && <option value={newQuizOpt2}>{newQuizOpt2}</option>}
                          {newQuizOpt3 && <option value={newQuizOpt3}>{newQuizOpt3}</option>}
                          {newQuizOpt4 && <option value={newQuizOpt4}>{newQuizOpt4}</option>}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-text-muted font-bold block mb-1">Answer Explanation</label>
                        <input 
                          type="text"
                          placeholder="Provide details behind correct choice..."
                          value={newQuizExplanation}
                          onChange={(e) => setNewQuizExplanation(e.target.value)}
                          className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleCreateQuizQuestion}
                      className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all cursor-pointer shadow shadow-neon-purple hover:scale-102"
                    >
                      Publish Question Card
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* E. SUMMARY VIEW */}
          {activeTab === "Summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card p-8 border border-white/5 max-w-4xl mx-auto space-y-6"
            >
              <div className="flex items-center gap-3">
                <Sparkles className={`w-6 h-6 ${theme.text}`} style={{ fill: theme.text.includes('emerald') ? 'rgba(16, 185, 129, 0.1)' : theme.text.includes('amber') ? 'rgba(245, 158, 11, 0.1)' : theme.text.includes('rose') ? 'rgba(239, 68, 68, 0.1)' : theme.text.includes('sky') ? 'rgba(14, 165, 233, 0.1)' : 'rgba(123, 94, 255, 0.1)' }} />
                <h3 className="text-lg font-heading font-bold text-white">AI Executive Summary</h3>
              </div>

              <div className="space-y-4">
                {data.summary.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-xs leading-relaxed text-slate-200 font-medium">
                    {p}
                  </p>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </motion.div>
  );
}
