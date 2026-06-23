import { useState, useEffect, useCallback, useRef } from "react";
import { usePodcast } from "../context/PodcastContext";

// Helper to convert timestamp [MM:SS] or [H:MM:SS] to seconds
export const parseTimestampToSeconds = (timestampStr) => {
  // Strip brackets
  const clean = timestampStr.replace(/[\[\]]/g, "").trim();
  const parts = clean.split(":").map(Number);
  
  if (parts.length === 2) {
    const [m, s] = parts;
    if (isNaN(m) || isNaN(s)) return 0;
    return m * 60 + s;
  } else if (parts.length === 3) {
    const [h, m, s] = parts;
    if (isNaN(h) || isNaN(m) || isNaN(s)) return 0;
    return h * 3600 + m * 60 + s;
  }
  return 0;
};

const CHIPS_BY_EPISODE = {
  e1: [
    "Tell me about bricklaying robots",
    "What is the lost generation?",
    "Economic limits of robotics",
    "Key takeaways"
  ],
  e2: [
    "How does inflation affect dating?",
    "Hinge app dating economics",
    "Dating app interface changes",
    "Key takeaways"
  ],
  e3: [
    "What are out-of-body states?",
    "Explain ego-location sensory loop",
    "Dr. Ryan Vance's research",
    "Key takeaways"
  ],
  e4: [
    "How does fiction alter empathy?",
    "Neuroscience of reading",
    "Mental resilience through fiction",
    "Key takeaways"
  ],
  e5: [
    "Discuss boundaries of the self",
    "De-anchoring focus for performance",
    "Out-of-body disruptions",
    "Key takeaways"
  ],
  e6: [
    "Cognitive benefits of immersion",
    "Fighting digital distraction",
    "Long-form reading and attention span",
    "Key takeaways"
  ],
  e7: [
    "Football academies in Ghana",
    "Contract conversion rates",
    "BBC World Service report",
    "Key takeaways"
  ],
  e8: [
    "Beyonce's financial empire",
    "Creative supply chain ownership",
    "Surprise album marketing",
    "Key takeaways"
  ],
  e9: [
    "Show me belly breathing steps",
    "Vagus nerve stimulation benefits",
    "Conscious breath-hold intervals",
    "Key takeaways"
  ],
  e10: [
    "What is interoception Nidra?",
    "Somatic muscle relaxation body scan",
    "Emotional self-regulation links",
    "Key takeaways"
  ]
};

const getChipsForEpisode = (episode) => {
  if (!episode) return [];
  if (CHIPS_BY_EPISODE[episode.id]) {
    return CHIPS_BY_EPISODE[episode.id];
  }
  return [
    "Give me a summary",
    "What is the main topic?",
    "Key takeaways",
    "Explain the current part"
  ];
};

export function usePodcastChat() {
  const { currentEpisode, currentTranscript, currentTime, setCurrentTime } = usePodcast();
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [quickChips, setQuickChips] = useState([]);
  
  const lastSentMessageRef = useRef("");

  // Sync quick chips and reset history on episode switch
  useEffect(() => {
    if (!currentEpisode) {
      setChatHistory([]);
      setQuickChips([]);
      return;
    }

    setQuickChips(getChipsForEpisode(currentEpisode));
    setApiKeyMissing(!import.meta.env.VITE_ANTHROPIC_API_KEY);

    // Set switch confirmation message and reset history immediately
    setChatHistory([
      {
        id: `switch-${Date.now()}`,
        role: "status",
        content: `Switched to: ${currentEpisode.title} — Ask me anything!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [currentEpisode?.id]);

  // Execute direct message request (routes to Anthropic or Gemini based on key format)
  const executeApiCall = async (newMessageText, currentHistoryList, retryAttempt = 0) => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      setApiKeyMissing(true);
      setIsTyping(false);
      return;
    }

    if (!currentTranscript) {
      const errorMsg = {
        id: `err-notrans-${Date.now()}`,
        role: "error",
        content: "Transcript not yet available for this episode.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => [...prev, errorMsg]);
      setIsTyping(false);
      return;
    }

    const isAnthropicKey = apiKey.startsWith("sk-");
    const systemInstruction = `You are an intelligent podcast assistant. You ONLY answer questions based on the following podcast transcript. Do not use any external knowledge. Always cite the timestamp when answering.
If the question is not answered in the transcript, say so clearly and suggest 2 relevant topics from the podcast the user could ask about.

CURRENT PODCAST: ${currentEpisode.title}
HOST: ${currentEpisode.host}

TRANSCRIPT WITH TIMESTAMPS:
${currentTranscript}`;

    try {
      let reply = "";

      if (isAnthropicKey) {
        // Prepare message history: filter out status/error and keep max last 10 pairs (20 messages)
        const apiMessages = currentHistoryList
          .filter((msg) => msg.role === "user" || msg.role === "assistant")
          .map((msg) => ({
            role: msg.role,
            content: msg.content
          }))
          .slice(-20);

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1024,
            system: systemInstruction,
            messages: apiMessages
          })
        });

        if (response.status === 429) {
          if (retryAttempt < 2) {
            const rateLimitMsg = {
              id: `rate-limit-${Date.now()}`,
              role: "status",
              content: `Rate limit hit. Retrying in 8 seconds (attempt ${retryAttempt + 1}/2)...`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatHistory((prev) => [...prev, rateLimitMsg]);

            setTimeout(() => {
              setChatHistory((prev) => prev.filter((m) => m.id !== rateLimitMsg.id));
              executeApiCall(newMessageText, currentHistoryList, retryAttempt + 1);
            }, 8000);
            return;
          } else {
            throw new Error("API Rate limit exceeded. Please wait a moment before trying again.");
          }
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || response.statusText;
          throw new Error(`API Error: ${errMsg} (${response.status})`);
        }

        const data = await response.json();
        reply = data.content[0]?.text || "Sorry, I couldn't formulate a response.";
      } else {
        // Filter message history: keep only user/assistant messages
        const filtered = currentHistoryList.filter(
          (msg) => msg.role === "user" || msg.role === "assistant"
        );

        // Prepare message history for Gemini (uses 'model' role instead of 'assistant')
        const rawGeminiMessages = filtered.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        }));

        // Filter/merge consecutive messages with the same role and ensure it starts with user
        const alternating = [];
        for (const msg of rawGeminiMessages) {
          if (alternating.length === 0) {
            if (msg.role === "user") {
              alternating.push(msg);
            }
          } else {
            const last = alternating[alternating.length - 1];
            if (last.role !== msg.role) {
              alternating.push(msg);
            } else {
              // Merge content of consecutive same-role messages
              last.parts[0].text += "\n" + msg.parts[0].text;
            }
          }
        }

        let geminiMessages = alternating;
        if (geminiMessages.length > 19) {
          geminiMessages = geminiMessages.slice(-19);
          if (geminiMessages.length > 0 && geminiMessages[0].role === "model") {
            geminiMessages = geminiMessages.slice(1);
          }
        }

        if (geminiMessages.length === 0 && rawGeminiMessages.length > 0) {
          const lastUser = rawGeminiMessages.filter(m => m.role === 'user').pop();
          if (lastUser) {
            geminiMessages = [lastUser];
          }
        }

        const modelName = "gemini-flash-latest";
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: systemInstruction }]
              },
              contents: geminiMessages
            })
          }
        );

        if (response.status === 429) {
          if (retryAttempt < 2) {
            const rateLimitMsg = {
              id: `rate-limit-${Date.now()}`,
              role: "status",
              content: `Rate limit hit. Retrying in 8 seconds (attempt ${retryAttempt + 1}/2)...`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatHistory((prev) => [...prev, rateLimitMsg]);

            setTimeout(() => {
              setChatHistory((prev) => prev.filter((m) => m.id !== rateLimitMsg.id));
              executeApiCall(newMessageText, currentHistoryList, retryAttempt + 1);
            }, 8000);
            return;
          } else {
            throw new Error("API Rate limit exceeded. Please wait a moment before trying again.");
          }
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || response.statusText;
          throw new Error(`API Error: ${errMsg} (${response.status})`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
          reply = data.candidates[0].content.parts[0].text.trim();
        } else {
          throw new Error("Invalid Gemini API response format");
        }
      }

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    } catch (err) {
      console.error("Direct API fetch failed:", err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: "error",
        content: err.message || "Couldn't reach AI. Please check your API key or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        canRetry: true
      };
      setChatHistory((prev) => [...prev, errorMsg]);
      setIsTyping(false);
    }
  };

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Set API check
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      setApiKeyMissing(true);
      return;
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let clean = chatHistory.filter((m) => m.role !== "error");
    if (clean.length > 0 && clean[clean.length - 1].role === "user") {
      clean = clean.slice(0, -1);
    }
    const nextHistory = [...clean, userMsg];

    setChatHistory(nextHistory);
    setIsTyping(true);
    lastSentMessageRef.current = text;

    // Run API call with the updated history
    await executeApiCall(text, nextHistory);
  }, [chatHistory, currentEpisode, currentTranscript]);

  const retryLastMessage = useCallback(async () => {
    const lastText = lastSentMessageRef.current;
    if (!lastText) return;

    const cleanHistory = chatHistory.filter((msg) => msg.role !== "error");
    setChatHistory(cleanHistory);
    setIsTyping(true);

    await executeApiCall(lastText, cleanHistory);
  }, [chatHistory, currentEpisode, currentTranscript]);

  const seekToTimestamp = useCallback((timestampStr) => {
    const seconds = parseTimestampToSeconds(timestampStr);
    setCurrentTime(seconds);
  }, [setCurrentTime]);

  return {
    chatHistory,
    isTyping,
    apiKeyMissing,
    quickChips,
    sendMessage,
    retryLastMessage,
    seekToTimestamp
  };
}
