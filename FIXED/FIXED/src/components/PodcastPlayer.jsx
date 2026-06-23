import React, { useRef, useEffect, useState } from "react";
import { usePodcast } from "../context/PodcastContext";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  Languages,
  X
} from "lucide-react";

// Pre-generate a static waveform heights list (80 values) to make it look like real speech
const WAVEFORM_HEIGHTS = [
  15, 30, 20, 45, 60, 30, 25, 40, 75, 50, 65, 80, 55, 30, 45, 60, 40, 20, 35, 50, 
  70, 90, 85, 60, 40, 30, 50, 65, 80, 75, 45, 20, 15, 30, 40, 60, 50, 35, 45, 55, 
  65, 80, 75, 95, 85, 70, 50, 40, 60, 75, 65, 45, 30, 20, 35, 50, 60, 45, 30, 40, 
  55, 70, 80, 60, 45, 30, 50, 65, 55, 40, 30, 20, 35, 50, 45, 30, 15, 25, 10, 5
];

// Web Audio API singletons to persist across component mounts and hot reloads
let globalAudioCtx = null;
let globalAnalyser = null;
let globalSourceNode = null;

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
    formatTime,
    episodes,
    selectEpisode,
    setActivePage,
    showToast,
    GEMINI_API_KEY,
    geminiApiKey,
    aiModel,
    getMappedModelName,
    audio,
    transcriptionLanguage,
    setTranscriptionLanguage
  } = usePodcast();

  const canvasRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.85);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [waveformClickedPercent, setWaveformClickedPercent] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  // Whisper AI Live Subtitles & Translation states bound to global context settings
  const selectedAudioLang = transcriptionLanguage;
  const setSelectedAudioLang = setTranscriptionLanguage;
  const [translatedBlocks, setTranslatedBlocks] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [showCaptionsLog, setShowCaptionsLog] = useState(false);
  const [frequencyData, setFrequencyData] = useState([]);
  const [realTranscript, setRealTranscript] = useState(null);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);

  // Load actual spoken transcript if it has been pre-generated/cached
  useEffect(() => {
    setRealTranscript(null);
    setIsLoadingTranscript(true);
    const fetchTranscript = async () => {
      try {
        const response = await fetch(`/transcripts/${activeEpisode.id}.json`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setRealTranscript(data);
          }
        }
      } catch (err) {
        console.warn("No real transcript found for episode:", activeEpisode.id);
      } finally {
        setIsLoadingTranscript(false);
      }
    };
    fetchTranscript();
  }, [activeEpisode.id]);

  const transcriptText = activeEpisode.transcript || activePodcast.transcript || "";
  const topics = usePodcast().getEpisodeTopics(activeEpisode, usePodcast().knowledgeData[activeEpisode.id]);

  const baseDialogueBlocks = React.useMemo(() => {
    const speakerA = activeEpisode.host || activePodcast.host || "Host";
    const speakerB = "Guest";
    
    const splitIntoClauses = (text) => {
      if (!text) return [];
      return text
        .split(/(?<=[,.;])\s+/)
        .map(c => c.trim())
        .filter(c => c.length > 0);
    };

    const blocks = [];
    blocks.push({ speaker: speakerA, text: `Welcome to this episode of ${activeEpisode.title}.` });
    blocks.push({ speaker: speakerA, text: `Today we are diving into some really fascinating concepts.` });
    blocks.push({ speaker: speakerA, text: `I am joined by our guest expert, ${speakerB}.` });
    blocks.push({ speaker: speakerB, text: `Thanks for having me. Excited to discuss the research.` });

    if (topics && topics.length > 0) {
      topics.forEach((topic) => {
        blocks.push({ speaker: speakerA, text: `Let's discuss our next focus: ${topic.concept}.` });
        blocks.push({ speaker: speakerA, text: `Can you walk us through what this means?` });
        
        const expClauses = splitIntoClauses(topic.explanation);
        expClauses.forEach(clause => {
          blocks.push({ speaker: speakerB, text: clause });
        });

        blocks.push({ speaker: speakerA, text: `That makes a lot of sense. What else did you note?` });
        
        const noteClauses = splitIntoClauses(topic.notes);
        noteClauses.forEach(clause => {
          blocks.push({ speaker: speakerB, text: clause });
        });

        blocks.push({ speaker: speakerA, text: `And what are the long-term implications of this structure?` });
        
        const impClauses = splitIntoClauses(topic.implication);
        impClauses.forEach(clause => {
          blocks.push({ speaker: speakerB, text: clause });
        });
      });
    } else {
      const clauses = splitIntoClauses(transcriptText);
      clauses.forEach(clause => {
        blocks.push({ speaker: speakerB, text: clause });
      });
    }

    blocks.push({ speaker: speakerA, text: `That wraps up our core analysis for this segment.` });
    blocks.push({ speaker: speakerB, text: `Thank you. It was a pleasure sharing these insights.` });
    blocks.push({ speaker: speakerA, text: `Thanks for listening to PodcastMind AI. See you next time!` });

    return blocks;
  }, [activeEpisode, activePodcast, topics, transcriptText]);

  const duration = activeEpisode.durationSeconds || 1800;

  const OFFLINE_TRANSLATIONS = {
    es: {
      "Welcome to this episode of": "Bienvenidos a este episodio de",
      "Today we are diving into some really fascinating concepts.": "Hoy nos sumergimos en algunos conceptos realmente fascinantes.",
      "I am joined by our guest expert.": "Me acompaña nuestro experto invitado.",
      "Thanks for having me. Excited to discuss the research.": "Gracias por invitarme. Emocionado por discutir la investigación.",
      "Let's discuss our next focus:": "Discutamos nuestro próximo enfoque:",
      "Can you walk us through what this means?": "¿Puedes explicarnos qué significa esto?",
      "That makes a lot of sense. What else did you note?": "Eso tiene mucho sentido. ¿Qué más notaste?",
      "And what are the long-term implications of this structure?": "¿Y cuáles son las implicaciones a largo plazo de esta estructura?",
      "That wraps up our core analysis for this segment.": "Eso concluye nuestro análisis principal de este segmento.",
      "Thank you. It was a pleasure sharing these insights.": "Gracias. Fue un placer compartir estas ideas.",
      "Thanks for listening to PodcastMind AI. See you next time!": "Gracias por escuchar PodcastMind AI. ¡Hasta la próxima!"
    },
    fr: {
      "Welcome to this episode of": "Bienvenue dans cet épisode de",
      "Today we are diving into some really fascinating concepts.": "Aujourd'hui, nous plongeons dans des concepts vraiment fascinants.",
      "I am joined by our guest expert.": "Je suis rejoint par notre expert invité.",
      "Thanks for having me. Excited to discuss the research.": "Merci de m'accueillir. Ravi de discuter de la recherche.",
      "Let's discuss our next focus:": "Discutons de notre prochain sujet :",
      "Can you walk us through what this means?": "Pouvez-vous nous expliquer ce que cela signifie ?",
      "That makes a lot of sense. What else did you note?": "C'est très logique. Qu'avez-vous noté d'autre ?",
      "And what are the long-term implications of this structure?": "Et quelles sont les implications à long terme de cette structure ?",
      "That wraps up our core analysis for this segment.": "Cela conclut notre analyse principale pour ce segment.",
      "Thank you. It was a pleasure sharing these insights.": "Merci. Ce fut un plaisir de partager ces idées.",
      "Thanks for listening to PodcastMind AI. See you next time!": "Merci d'écouter PodcastMind AI. À la prochaine !"
    },
    de: {
      "Welcome to this episode of": "Willkommen zu dieser Folge von",
      "Today we are diving into some really fascinating concepts.": "Heute tauchen wir in einige wirklich faszinierende Konzepte ein.",
      "I am joined by our guest expert.": "Ich werde von unserem Gastexperten begleitet.",
      "Thanks for having me. Excited to discuss the research.": "Danke für die Einladung. Freue mich darauf, die Forschung zu diskutieren.",
      "Let's discuss our next focus:": "Lassen Sie uns unseren nächsten Fokus besprechen:",
      "Can you walk us through what this means?": "Können Sie uns erklären, was das bedeutet?",
      "That makes a lot of sense. What else did you note?": "Das macht sehr viel Sinn. Was haben Sie noch bemerkt?",
      "And what are the long-term implications of this structure?": "Und was sind die langfristigen Auswirkungen dieser Struktur?",
      "That wraps up our core analysis for this segment.": "Damit ist unsere Kernanalyse für diesen Abschnitt abgeschlossen.",
      "Thank you. It was a pleasure sharing these insights.": "Danke. Es war mir ein Vergnügen, diese Erkenntnisse zu teilen.",
      "Thanks for listening to PodcastMind AI. See you next time!": "Vielen Dank fürs Zuhören bei PodcastMind AI. Bis zum nächsten Mal!"
    }
  };

  const translateTranscript = async (episodeId, targetLang) => {
    if (targetLang === "en") return;
    if (translatedBlocks[episodeId] && translatedBlocks[episodeId][targetLang]) return;

    setIsTranslating(true);
    const langNames = { es: "Spanish", fr: "French", de: "German", hi: "Hindi" };
    const targetLangName = langNames[targetLang] || "Spanish";

    const blocksToTranslate = realTranscript 
      ? realTranscript.map(item => ({ speaker: item.speaker || "Speaker", text: item.text }))
      : baseDialogueBlocks;
    const textsToTranslate = blocksToTranslate.map(b => b.text);

    // Helper for translating a batch of texts on the client side
    const translateBatch = async (texts) => {
      const combinedText = texts.join(" || ");
      
      // Try Google Translate first (client-side single api)
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(combinedText)}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const translatedText = data[0].map(part => part[0]).join("");
          const split = translatedText.split(/\s*\|\|\s*/).map(s => s.trim());
          if (split.length === texts.length) {
            return split;
          }
        }
      } catch (err) {
        console.warn("Google Translate client API failed (possibly CORS):", err);
      }

      // Try MyMemory translation API
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(combinedText)}&langpair=en|${targetLang}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data && data.responseData && data.responseData.translatedText) {
            const translatedText = data.responseData.translatedText;
            const split = translatedText.split(/\s*\|\|\s*/).map(s => s.trim());
            if (split.length === texts.length) {
              return split;
            }
          }
        }
      } catch (err) {
        console.warn("MyMemory client API failed:", err);
      }

      return null;
    };

    const translatedList = new Array(textsToTranslate.length).fill(null);
    const CHUNK_SIZE = 10;

    for (let i = 0; i < textsToTranslate.length; i += CHUNK_SIZE) {
      const chunk = textsToTranslate.slice(i, i + CHUNK_SIZE);
      const translatedChunk = await translateBatch(chunk);

      if (translatedChunk && translatedChunk.length === chunk.length) {
        for (let j = 0; j < chunk.length; j++) {
          translatedList[i + j] = translatedChunk[j];
        }
      } else {
        // Fallback sentence-by-sentence with retry/offline check
        for (let j = 0; j < chunk.length; j++) {
          const sentence = chunk[j];
          const foundKey = Object.keys(OFFLINE_TRANSLATIONS[targetLang] || {}).find(k => sentence.includes(k));
          if (foundKey) {
            translatedList[i + j] = sentence.replace(foundKey, OFFLINE_TRANSLATIONS[targetLang][foundKey]);
            continue;
          }

          // Try Google individual translation
          try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(sentence)}`;
            const response = await fetch(url);
            if (response.ok) {
              const data = await response.json();
              translatedList[i + j] = data[0].map(part => part[0]).join("").trim();
              continue;
            }
          } catch (e) {}

          // Try MyMemory individual translation
          try {
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sentence)}&langpair=en|${targetLang}`;
            const response = await fetch(url);
            if (response.ok) {
              const data = await response.json();
              if (data && data.responseData && data.responseData.translatedText) {
                translatedList[i + j] = data.responseData.translatedText;
                continue;
              }
            }
          } catch (e) {}

          const prefixes = { es: "¿ ", fr: "« ", de: "» ", hi: "ॐ " };
          const suffixes = { es: " ?", fr: " »", de: " «", hi: " ।" };
          translatedList[i + j] = `${prefixes[targetLang] || ""}${sentence} (${targetLangName})${suffixes[targetLang] || ""}`;
        }
      }

      // Add a small delay between chunk translations to avoid hitting rate limits
      if (i + CHUNK_SIZE < textsToTranslate.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const translatedBlocksArray = blocksToTranslate.map((b, idx) => ({
      speaker: b.speaker,
      text: translatedList[idx] || b.text
    }));

    setTranslatedBlocks((prev) => ({
      ...prev,
      [episodeId]: {
        ...(prev[episodeId] || {}),
        [targetLang]: translatedBlocksArray
      }
    }));
    setIsTranslating(false);
  };

  useEffect(() => {
    if (selectedAudioLang === "en" || isLoadingTranscript) return;
    if (translatedBlocks[activeEpisode.id]?.[selectedAudioLang]) return;

    const loadTranscriptTranslation = async () => {
      setIsTranslating(true);
      try {
        const langFile = `/transcripts/${activeEpisode.id}_${selectedAudioLang}.json`;
        const response = await fetch(langFile);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const mapped = data.map(item => ({
              speaker: item.speaker || "UNKNOWN",
              text: item.text
            }));
            setTranslatedBlocks(prev => ({
              ...prev,
              [activeEpisode.id]: {
                ...(prev[activeEpisode.id] || {}),
                [selectedAudioLang]: mapped
              }
            }));
            setIsTranslating(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Failed to load pre-translated transcript file:", err);
      }

      // Fall back to dynamic client-side translation
      await translateTranscript(activeEpisode.id, selectedAudioLang);
    };

    loadTranscriptTranslation();
  }, [activeEpisode.id, selectedAudioLang, isLoadingTranscript, realTranscript]);

  const subtitlesList = React.useMemo(() => {
    const interval = 12; // Spaced every 12 seconds for high activity!
    const count = Math.ceil(duration / interval);
    const list = [];
    
    const hasTranslation = selectedAudioLang !== "en" && translatedBlocks[activeEpisode.id]?.[selectedAudioLang];
    const blocks = hasTranslation 
      ? translatedBlocks[activeEpisode.id][selectedAudioLang] 
      : baseDialogueBlocks;

    if (blocks.length === 0) return [];

    for (let i = 0; i < count; i++) {
      const time = i * interval;
      const block = blocks[i % blocks.length];
      const englishBlock = baseDialogueBlocks[i % baseDialogueBlocks.length];
      list.push({
        time,
        text: `[${block.speaker}]: ${block.text}`,
        englishText: `[${englishBlock.speaker}]: ${englishBlock.text}`
      });
    }
    return list;
  }, [activeEpisode, baseDialogueBlocks, translatedBlocks, selectedAudioLang, duration]);

  const activeSubtitleIdx = React.useMemo(() => {
    if (subtitlesList.length === 0) return -1;
    // Adjust offset to compensate for Math.floor lag and keep subtitles aligned with the audio playhead
    const idx = Math.floor((currentTime + 0.5) / 12);
    return Math.min(subtitlesList.length - 1, Math.max(0, idx));
  }, [currentTime, subtitlesList]);

  const sentences = React.useMemo(() => {
    if (realTranscript) {
      return realTranscript.map(item => item.text);
    }
    const interval = 12;
    const count = Math.ceil(duration / interval);
    const list = [];
    for (let i = 0; i < count; i++) {
      const block = baseDialogueBlocks[i % baseDialogueBlocks.length];
      list.push(block ? block.text : "");
    }
    return list;
  }, [realTranscript, baseDialogueBlocks, duration]);

  const activeSentenceIdx = React.useMemo(() => {
    if (realTranscript) {
      // Adjust offset to compensate for Math.floor lag and keep subtitles aligned with the audio playhead
      const searchTime = currentTime + 0.5;
      const idx = realTranscript.findIndex(item => searchTime >= item.start && searchTime <= item.end);
      if (idx !== -1) return idx;
      
      let closestIdx = -1;
      for (let i = 0; i < realTranscript.length; i++) {
        if (searchTime >= realTranscript[i].start) {
          closestIdx = i;
        } else {
          break;
        }
      }
      
      if (closestIdx !== -1) {
        const prevSegment = realTranscript[closestIdx];
        // If the gap is longer than 1.5 seconds, hide the subtitle
        if (searchTime - prevSegment.end > 1.5) {
          return -1;
        }
        return closestIdx;
      }
      return -1;
    }
    return activeSubtitleIdx;
  }, [realTranscript, currentTime, activeSubtitleIdx]);

  const captionsContainerRef = useRef(null);
  useEffect(() => {
    if (showCaptionsLog && captionsContainerRef.current) {
      const activeEl = captionsContainerRef.current.querySelector(".active-caption-item");
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    }
  }, [activeSentenceIdx, showCaptionsLog]);


  const translatedCaptions = React.useMemo(() => {
    const map = {};
    const hasTranslation = selectedAudioLang !== "en" && translatedBlocks[activeEpisode.id]?.[selectedAudioLang];
    if (hasTranslation) {
      const blocks = translatedBlocks[activeEpisode.id][selectedAudioLang];
      let list = blocks.map(block => block.text);
      if (!realTranscript) {
        // Repeat the translated blocks just like sentences repeats baseDialogueBlocks
        const interval = 12;
        const count = Math.ceil(duration / interval);
        const repeatedList = [];
        for (let i = 0; i < count; i++) {
          repeatedList.push(list[i % list.length] || "");
        }
        list = repeatedList;
      }
      map[selectedAudioLang] = list;
    }
    return {
      [activeEpisode.id]: map
    };
  }, [translatedBlocks, activeEpisode.id, selectedAudioLang, realTranscript, duration]);

  const liveDisplaySubtitles = React.useMemo(() => {
    if (activeSentenceIdx === -1) {
      return { english: "...", foreign: "..." };
    }

    const rawEnglish = sentences[activeSentenceIdx] || "";
    const rawForeign = selectedAudioLang !== "en"
      ? (translatedCaptions[activeEpisode.id]?.[selectedAudioLang]?.[activeSentenceIdx] || "")
      : "";

    const cleanSubtitleText = (text) => {
      if (!text) return "";
      let cleaned = text.replace(/[\[\(](music|laughter|applause|silence|instrumental|coughing|chuckle|gasp|sigh|groan|screaming|noise|static|music playing|music plays)[\]\)]/gi, "");
      cleaned = cleaned.trim();
      if (cleaned.startsWith("-") || cleaned.startsWith(":")) {
        cleaned = cleaned.substring(1).trim();
      }
      return cleaned;
    };

    const cleanedEnglish = cleanSubtitleText(rawEnglish);
    const cleanedForeign = cleanSubtitleText(rawForeign);

    if (!cleanedEnglish) {
      return { english: "...", foreign: "..." };
    }

    if (!realTranscript) {
      // For mock transcripts, show the full sentence immediately
      return {
        english: cleanedEnglish || "...",
        foreign: cleanedForeign || "..."
      };
    }

    const segment = realTranscript[activeSentenceIdx];
    if (!segment) {
      return { english: "...", foreign: "..." };
    }

    const getLiveText = (sentence, start, end, time) => {
      if (!sentence) return "";
      const words = sentence.trim().split(/\s+/);
      if (words.length <= 1) return sentence;
      
      const duration = end - start;
      if (duration <= 0) return sentence;
      
      const elapsed = time - start;
      if (elapsed <= 0) return words[0];
      
      // Calculate word count to show based on natural conversational speed (3.6 words per second)
      // but bound it by the segment duration to guarantee all words are shown by the end.
      const linearCount = (elapsed / duration) * words.length;
      const naturalCount = elapsed * 3.6;
      const countToShow = Math.max(linearCount, naturalCount);
      const wordCountToShow = Math.max(1, Math.min(words.length, Math.floor(countToShow) + 1));
      
      return words.slice(0, wordCountToShow).join(" ");
    };

    // Adjust offset to compensate for Math.floor lag and keep the live word-by-word reveal aligned with the audio playhead
    const searchTime = currentTime + 0.5;
    const englishLive = getLiveText(cleanedEnglish, segment.start, segment.end, searchTime);
    const foreignLive = selectedAudioLang !== "en"
      ? getLiveText(cleanedForeign, segment.start, segment.end, searchTime)
      : "";

    return {
      english: englishLive || "...",
      foreign: foreignLive || "..."
    };
  }, [activeSentenceIdx, realTranscript, sentences, translatedCaptions, activeEpisode.id, selectedAudioLang, currentTime]);


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

  // Download Active Podcast MP3 file
  const handleDownload = () => {
    if (activeEpisode && activeEpisode.audioUrl) {
      const link = document.createElement("a");
      link.href = activeEpisode.audioUrl;
      const filename = activeEpisode.audioUrl.substring(activeEpisode.audioUrl.lastIndexOf("/") + 1) || "podcast-episode.mp3";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No audio file available for download.");
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

  // Web Audio API analyzer connection
  useEffect(() => {
    if (!audio) return;

    const initAudioAnalyzer = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        if (!globalAudioCtx) {
          globalAudioCtx = new AudioContext();
        }

        if (globalAudioCtx.state === "suspended") {
          const resume = () => {
            if (globalAudioCtx && globalAudioCtx.state === "suspended") {
              globalAudioCtx.resume();
            }
            window.removeEventListener("click", resume);
          };
          window.addEventListener("click", resume);
        }

        if (!globalAnalyser) {
          globalAnalyser = globalAudioCtx.createAnalyser();
          globalAnalyser.fftSize = 64;
        }

        if (!globalSourceNode) {
          audio.crossOrigin = "anonymous";
          globalSourceNode = globalAudioCtx.createMediaElementSource(audio);
          globalSourceNode.connect(globalAnalyser);
          globalAnalyser.connect(globalAudioCtx.destination);
        }
      } catch (e) {
        console.warn("Failed to initialize Web Audio API analyzer:", e);
      }
    };

    if (isPlaying) {
      initAudioAnalyzer();
    }
  }, [audio, isPlaying]);

  // Poll real-time frequency data
  useEffect(() => {
    if (!isPlaying) {
      setFrequencyData([]);
      return;
    }

    let animationId;
    const updateFrequencies = () => {
      if (globalAnalyser) {
        const bufferLength = globalAnalyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        globalAnalyser.getByteFrequencyData(dataArray);
        const bars = Array.from(dataArray).slice(0, 12);
        setFrequencyData(bars);
      } else {
        const simulated = [];
        const now = Date.now();
        for (let i = 0; i < 12; i++) {
          const val = Math.max(10, Math.floor((Math.sin(now * 0.007 + i * 0.5) * 0.5 + 0.5) * 200));
          simulated.push(val);
        }
        setFrequencyData(simulated);
      }
      animationId = requestAnimationFrame(updateFrequencies);
    };

    updateFrequencies();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

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
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMoreDropdown(!showMoreDropdown)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-text-muted hover:text-white transition-all cursor-pointer"
            >
              <MoreHorizontal className="w-4.5 h-4.5" />
            </button>
            
            <AnimatePresence>
              {showMoreDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-44 rounded-xl bg-[#13131A] border border-white/10 p-1.5 shadow-2xl z-30"
                >
                  <button
                    onClick={() => {
                      setShowMoreDropdown(false);
                      navigator.clipboard.writeText(`https://podcastmind.ai/share/${activeEpisode.id}`);
                      showToast("Share link copied to clipboard!");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-text-muted hover:text-white hover:bg-white/[0.04] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Share Episode</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreDropdown(false);
                      setActivePage("chat-with-podcast");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-text-muted hover:text-white hover:bg-white/[0.04] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>View Transcript</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreDropdown(false);
                      showToast("Simulated issue report submitted successfully.");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-text-muted hover:text-white hover:bg-white/[0.04] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Report Issue</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white transition-all cursor-pointer"
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
          
          <button 
            onClick={() => setShowPlaylist(true)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-text-muted hover:text-white transition-all cursor-pointer"
          >
            <ListMusic className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Whisper AI Live Subtitles & Translation Panel */}
      <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Whisper AI Live Subtitles & Translation</span>
            </h4>
          </div>
          
          <div className="flex items-center gap-3.5 select-none">
            {/* Source Language Select */}
            <div className="flex items-center gap-1.5 bg-[#13131A] border border-white/5 px-2.5 py-1.5 rounded-xl">
              <Languages className="w-3.5 h-3.5 text-primary" />
              <select
                value={selectedAudioLang}
                onChange={(e) => setSelectedAudioLang(e.target.value)}
                className="bg-transparent text-[10px] font-semibold text-white outline-none cursor-pointer border-none p-0"
              >
                <option value="en" className="bg-[#13131A] text-white">Audio: English (US)</option>
                <option value="es" className="bg-[#13131A] text-white">Audio: Spanish (ES)</option>
                <option value="fr" className="bg-[#13131A] text-white">Audio: French (FR)</option>
                <option value="de" className="bg-[#13131A] text-white">Audio: German (DE)</option>
                <option value="hi" className="bg-[#13131A] text-white">Audio: Hindi (HI)</option>
              </select>
            </div>

            {/* Toggle History Log */}
            <button
              onClick={() => setShowCaptionsLog(!showCaptionsLog)}
              className="text-[10px] font-semibold px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-text-muted hover:text-white transition-all cursor-pointer"
            >
              {showCaptionsLog ? "Hide Log" : "View History"}
            </button>
          </div>
        </div>

        {/* Real-time Whisper AI Audio Analyzer Visualizer */}
        <div className="flex items-center justify-between bg-black/10 rounded-xl p-3 border border-white/[0.02] select-none animate-fade-in">
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-text-muted">
                {isPlaying ? "Whisper Status: Decoding Audio Stream" : "Whisper Status: Idle (Ready)"}
              </span>
            </div>
            {/* Sampling rate */}
            <span className="text-[8.5px] font-mono text-white/30 border border-white/10 px-1.5 py-0.5 rounded">
              16 kHz / Mono
            </span>
          </div>

          {/* Dancing frequency bars */}
          <div className="flex items-end gap-0.5 h-5">
            {(frequencyData.length > 0 ? frequencyData : Array(12).fill(0)).map((val, i) => {
              const heightPercent = isPlaying 
                ? (frequencyData.length > 0 ? (val / 255) * 100 : Math.sin(Date.now() * 0.005 + i) * 30 + 50)
                : 15;
              return (
                <div
                  key={i}
                  className="w-0.75 bg-gradient-to-t from-primary to-secondary rounded-t transition-all duration-75"
                  style={{
                    height: `${Math.max(3, Math.min(20, (heightPercent / 100) * 20))}px`,
                    opacity: isPlaying ? 0.3 + (heightPercent / 100) * 0.7 : 0.2
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Live Subtitle Screen */}
        <div className="py-3 px-4 rounded-xl bg-black/20 min-h-[70px] flex flex-col justify-center relative overflow-hidden group">
          {isTranslating ? (
            <div className="flex items-center justify-center gap-2 text-[10.5px] text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              <span>Whisper translating transcript into {selectedAudioLang === "es" ? "Spanish" : selectedAudioLang === "fr" ? "French" : selectedAudioLang === "de" ? "German" : "Hindi"}...</span>
            </div>
          ) : sentences.length === 0 ? (
            <div className="text-center text-[10.5px] text-text-muted">No subtitles available for this episode.</div>
          ) : (
            <div className="space-y-1.5 text-center">
              {/* Spoken Text (Foreign Language) */}
              {selectedAudioLang !== "en" && (
                <p className="text-[11px] font-bold text-primary italic tracking-wide">
                  "{liveDisplaySubtitles.foreign}"
                </p>
              )}
              {/* English Subtitles / Translation */}
              <p className="text-xs font-semibold text-white tracking-wide leading-relaxed">
                "{liveDisplaySubtitles.english}"
              </p>
            </div>
          )}
        </div>

        {/* Caption History Log */}
        {showCaptionsLog && sentences.length > 0 && (
          <div ref={captionsContainerRef} className="max-h-[160px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin border-t border-white/5 pt-3">
            {sentences.map((sentence, idx) => {
              const isActive = idx === activeSentenceIdx;
              const sentenceTime = realTranscript && realTranscript[idx]
                ? Math.floor(realTranscript[idx].start)
                : Math.floor((idx / sentences.length) * duration);
              const isLangEn = selectedAudioLang === "en";
              const foreignText = !isLangEn ? (translatedCaptions[activeEpisode.id]?.[selectedAudioLang]?.[idx] || "...") : "";

              return (
                <div
                  key={idx}
                  onClick={() => setCurrentTime(sentenceTime)}
                  className={`p-2 rounded-xl text-left border flex items-start gap-3 cursor-pointer transition-all hover:bg-white/[0.02] ${
                    isActive
                      ? "active-caption-item bg-primary/10 border-primary shadow-sm"
                      : "bg-transparent border-transparent"
                  }`}
                >
                  <span className="text-[9.5px] font-mono font-bold text-secondary shrink-0 pt-0.5">
                    {formatTime(sentenceTime)}
                  </span>
                  
                  <div className="min-w-0 flex-1 space-y-0.5">
                    {!isLangEn && (
                      <p className="text-[10px] font-bold text-primary italic truncate">
                        {foreignText}
                      </p>
                    )}
                    <p className="text-[10.5px] font-medium text-slate-300 truncate">
                      {sentence}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Playlist Panel Overlay */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-[#0D0D12]/95 backdrop-blur-xl z-20 flex flex-col p-6"
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <ListMusic className="w-4.5 h-4.5 text-primary" />
                <h4 className="text-sm font-bold text-white">Show Playlist: {activePodcast.title}</h4>
              </div>
              <button
                onClick={() => setShowPlaylist(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all cursor-pointer animate-hover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {episodes
                .filter((ep) => ep.podcastId === activePodcast.id)
                .map((ep) => {
                  const isActive = ep.id === activeEpisode.id;
                  return (
                    <div
                      key={ep.id}
                      onClick={() => {
                        selectEpisode(ep);
                        setIsPlaying(true);
                        setShowPlaylist(false);
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isActive
                          ? "bg-primary/10 border-primary text-white"
                          : "bg-white/[0.01] border-white/5 hover:border-white/10 text-slate-300 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={ep.thumbnail || activePodcast.thumbnail}
                            alt={ep.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate leading-snug">{ep.title}</p>
                          <p className="text-[10px] text-text-muted mt-0.5">Plays: {ep.plays || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] text-text-muted font-semibold">{ep.duration}</span>
                        {isActive && isPlaying ? (
                          <div className="flex gap-0.5 items-end h-3">
                            <span className="w-0.5 h-2 bg-primary animate-pulse" />
                            <span className="w-0.5 h-3 bg-primary animate-pulse [animation-delay:0.2s]" />
                            <span className="w-0.5 h-1 bg-primary animate-pulse [animation-delay:0.4s]" />
                          </div>
                        ) : (
                          <Play className="w-3.5 h-3.5 text-text-muted" />
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
