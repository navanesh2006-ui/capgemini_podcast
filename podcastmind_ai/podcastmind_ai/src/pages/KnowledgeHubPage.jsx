import React, { useState } from "react";
import { usePodcast } from "../context/PodcastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, FileText, Sparkles, Layers, Award, ArrowLeft, ArrowRight, RotateCw, CheckCircle2, XCircle } from "lucide-react";

export default function KnowledgeHubPage() {
  const { activeEpisode, knowledgeData } = usePodcast();
  const [activeTab, setActiveTab] = useState("Notes"); // 'Notes' | 'Mind Map' | 'Flashcards' | 'Quiz' | 'Summary'

  const data = knowledgeData[activeEpisode.id] || knowledgeData["e1"];

  // 1. Mind Map States
  const [expandedNodes, setExpandedNodes] = useState({
    root: true,
    core: true,
    collaboration: true,
    guardrails: true
  });

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // 2. Flashcards States
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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

  // 3. Quiz States
  const [quizScores, setQuizScores] = useState({}); // { qId: selectedIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);

  const handleQuizOptionClick = (qId, optionIdx, isCorrect) => {
    if (quizScores[qId] !== undefined) return; // Prevent double answers
    
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto ml-64 min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-white/5 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <span>🧠 AI Knowledge Extraction Hub</span>
          </h2>
          <p className="text-xs text-text-muted mt-1 font-medium">
            AI automatically extracts summarized concepts, study decks, quizzes, and logical mind maps
          </p>
        </div>

        {/* Tab Selector Links */}
        <div className="flex bg-[#13131A] rounded-2xl p-1 border border-white/5 gap-1 shrink-0">
          {["Notes", "Mind Map", "Flashcards", "Quiz", "Summary"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              className="glass-card p-8 border border-white/5 space-y-6 max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-heading font-bold text-white">Extracted Key Takeaways</h3>
              </div>

              <div className="space-y-4">
                {data.notes.map((note, index) => (
                  <div key={note.id || index} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-xs leading-relaxed text-slate-200 font-medium pt-0.5">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* B. MIND MAP VIEW (Custom Interactive SVG) */}
          {activeTab === "Mind Map" && (
            <motion.div
              key="mindmap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card p-6 border border-white/5 flex flex-col items-center justify-center"
            >
              <div className="mb-4 text-center">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/15 border border-primary/20 text-primary uppercase">
                  Interactive Node Graph
                </span>
                <h3 className="text-base font-heading font-bold text-white mt-1">
                  Click nodes to expand or collapse conceptual connections
                </h3>
              </div>

              {/* Custom SVG canvas */}
              <div className="w-full max-w-4xl bg-black/40 rounded-2xl border border-white/5 p-4 flex justify-center overflow-x-auto">
                <svg width="780" height="420" viewBox="0 0 780 420" className="text-white select-none">
                  {/* Definition for path arrowheads and gradients */}
                  <defs>
                    <linearGradient id="linkGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7B5EFF" />
                      <stop offset="100%" stopColor="#FF5E9C" />
                    </linearGradient>
                  </defs>

                  {/* Draw connection lines dynamically based on expansion */}
                  {/* Root (390, 200) to Level 1 Core (180, 80), Collaboration (180, 200), Guardrails (180, 320) */}
                  {expandedNodes.root && (
                    <>
                      <line x1="390" y1="200" x2="230" y2="100" stroke="url(#linkGrad)" strokeWidth="2" opacity="0.6" />
                      <line x1="390" y1="200" x2="230" y2="200" stroke="url(#linkGrad)" strokeWidth="2" opacity="0.6" />
                      <line x1="390" y1="200" x2="230" y2="300" stroke="url(#linkGrad)" strokeWidth="2" opacity="0.6" />
                    </>
                  )}

                  {/* Core Architecture branches */}
                  {expandedNodes.root && expandedNodes.core && (
                    <>
                      <line x1="230" y1="100" x2="80" y2="50" stroke="#7B5EFF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                      <line x1="230" y1="100" x2="80" y2="100" stroke="#7B5EFF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                      <line x1="230" y1="100" x2="80" y2="150" stroke="#7B5EFF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                    </>
                  )}

                  {/* Collaboration branches */}
                  {expandedNodes.root && expandedNodes.collaboration && (
                    <>
                      <line x1="230" y1="200" x2="570" y2="100" stroke="#FF5E9C" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                      <line x1="230" y1="200" x2="570" y2="200" stroke="#FF5E9C" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                      <line x1="230" y1="200" x2="570" y2="300" stroke="#FF5E9C" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                    </>
                  )}

                  {/* Guardrails branches */}
                  {expandedNodes.root && expandedNodes.guardrails && (
                    <>
                      <line x1="230" y1="300" x2="80" y2="250" stroke="#FF8C42" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                      <line x1="230" y1="300" x2="80" y2="300" stroke="#FF8C42" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                      <line x1="230" y1="300" x2="80" y2="350" stroke="#FF8C42" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                    </>
                  )}

                  {/* Draw Nodes */}
                  
                  {/* ROOT NODE (Center) */}
                  <g transform="translate(390, 200)" onClick={() => toggleNode("root")} className="cursor-pointer">
                    <circle r="40" fill="#13131A" stroke="#7B5EFF" strokeWidth="3" className="pulse-glow" />
                    <text textAnchor="middle" dy="4" fill="white" fontSize="9" fontWeight="bold">AI AGENTIC</text>
                    <text textAnchor="middle" dy="16" fill="white" fontSize="9" fontWeight="bold">ECOSYSTEM</text>
                  </g>

                  {/* CORE ARCHITECTURE NODE */}
                  {expandedNodes.root && (
                    <g transform="translate(230, 100)" onClick={() => toggleNode("core")} className="cursor-pointer">
                      <circle r="30" fill="#13131A" stroke={expandedNodes.core ? "#7B5EFF" : "#8888AA"} strokeWidth="2.5" />
                      <text textAnchor="middle" dy="2" fill="white" fontSize="8" fontWeight="bold">Core Design</text>
                      <text textAnchor="middle" dy="12" fill="#7B5EFF" fontSize="7" fontWeight="bold">
                        {expandedNodes.core ? "[-] Collapse" : "[+] Expand"}
                      </text>
                    </g>
                  )}

                  {/* ORCHESTRATION NODE */}
                  {expandedNodes.root && (
                    <g transform="translate(230, 200)" onClick={() => toggleNode("collaboration")} className="cursor-pointer">
                      <circle r="30" fill="#13131A" stroke={expandedNodes.collaboration ? "#FF5E9C" : "#8888AA"} strokeWidth="2.5" />
                      <text textAnchor="middle" dy="2" fill="white" fontSize="8" fontWeight="bold">Orchestrators</text>
                      <text textAnchor="middle" dy="12" fill="#FF5E9C" fontSize="7" fontWeight="bold">
                        {expandedNodes.collaboration ? "[-] Collapse" : "[+] Expand"}
                      </text>
                    </g>
                  )}

                  {/* GUARDRAILS NODE */}
                  {expandedNodes.root && (
                    <g transform="translate(230, 300)" onClick={() => toggleNode("guardrails")} className="cursor-pointer">
                      <circle r="30" fill="#13131A" stroke={expandedNodes.guardrails ? "#FF8C42" : "#8888AA"} strokeWidth="2.5" />
                      <text textAnchor="middle" dy="2" fill="white" fontSize="8" fontWeight="bold">Safety bounds</text>
                      <text textAnchor="middle" dy="12" fill="#FF8C42" fontSize="7" fontWeight="bold">
                        {expandedNodes.guardrails ? "[-] Collapse" : "[+] Expand"}
                      </text>
                    </g>
                  )}

                  {/* Leaf Nodes Core */}
                  {expandedNodes.root && expandedNodes.core && (
                    <>
                      <g transform="translate(80, 50)"><rect x="-55" y="-12" width="110" height="24" rx="6" fill="#13131A" stroke="#7B5EFF" strokeWidth="1" /><text textAnchor="middle" dy="4" fill="slate-300" fontSize="8">Goal Decomposition</text></g>
                      <g transform="translate(80, 100)"><rect x="-55" y="-12" width="110" height="24" rx="6" fill="#13131A" stroke="#7B5EFF" strokeWidth="1" /><text textAnchor="middle" dy="4" fill="slate-300" fontSize="8">Memory Buffers</text></g>
                      <g transform="translate(80, 150)"><rect x="-55" y="-12" width="110" height="24" rx="6" fill="#13131A" stroke="#7B5EFF" strokeWidth="1" /><text textAnchor="middle" dy="4" fill="slate-300" fontSize="8">Tool Execution Schema</text></g>
                    </>
                  )}

                  {/* Leaf Nodes Collaboration */}
                  {expandedNodes.root && expandedNodes.collaboration && (
                    <>
                      <g transform="translate(570, 100)"><rect x="-55" y="-12" width="110" height="24" rx="6" fill="#13131A" stroke="#FF5E9C" strokeWidth="1" /><text textAnchor="middle" dy="4" fill="slate-300" fontSize="8">Multi-Agent Graphs</text></g>
                      <g transform="translate(570, 200)"><rect x="-55" y="-12" width="110" height="24" rx="6" fill="#13131A" stroke="#FF5E9C" strokeWidth="1" /><text textAnchor="middle" dy="4" fill="slate-300" fontSize="8">ReAct Loops</text></g>
                      <g transform="translate(570, 300)"><rect x="-55" y="-12" width="110" height="24" rx="6" fill="#13131A" stroke="#FF5E9C" strokeWidth="1" /><text textAnchor="middle" dy="4" fill="slate-300" fontSize="8">Supervisor Router</text></g>
                    </>
                  )}

                  {/* Leaf Nodes Guardrails */}
                  {expandedNodes.root && expandedNodes.guardrails && (
                    <>
                      <g transform="translate(80, 250)"><rect x="-55" y="-12" width="110" height="24" rx="6" fill="#13131A" stroke="#FF8C42" strokeWidth="1" /><text textAnchor="middle" dy="4" fill="slate-300" fontSize="8">Constitutional Safety</text></g>
                      <g transform="translate(80, 300)"><rect x="-55" y="-12" width="110" height="24" rx="6" fill="#13131A" stroke="#FF8C42" strokeWidth="1" /><text textAnchor="middle" dy="4" fill="slate-300" fontSize="8">Execution Bounds</text></g>
                      <g transform="translate(80, 350)"><rect x="-55" y="-12" width="110" height="24" rx="6" fill="#13131A" stroke="#FF8C42" strokeWidth="1" /><text textAnchor="middle" dy="4" fill="slate-300" fontSize="8">Human-in-the-Loop</text></g>
                    </>
                  )}
                </svg>
              </div>
            </motion.div>
          )}

          {/* C. FLASHCARDS VIEW (3D Flip Deck) */}
          {activeTab === "Flashcards" && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-6"
            >
              {/* 3D card layout */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full max-w-[500px] h-[300px] perspective-1000 cursor-pointer relative"
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full h-full transform-style-3d relative duration-500 rounded-3xl bg-surface border border-white/5 shadow-2xl flex items-center justify-center p-8 text-center"
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 backface-hidden p-8 flex flex-col justify-between items-center bg-[#13131A] rounded-3xl">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase">
                      Flashcard {currentCardIdx + 1} of {data.flashcards.length}
                    </span>
                    <h3 className="text-lg font-heading font-extrabold text-white leading-normal my-auto">
                      {data.flashcards[currentCardIdx].question}
                    </h3>
                    <span className="text-[9px] text-text-muted font-semibold flex items-center gap-1.5 hover:text-white transition-colors">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Click to flip card</span>
                    </span>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 flex flex-col justify-between items-center bg-[#13131A] rounded-3xl border border-secondary/20">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/15 border border-secondary/20 text-secondary uppercase">
                      Suggested AI Answer
                    </span>
                    <p className="text-xs leading-relaxed text-slate-200 font-medium my-auto max-w-sm">
                      {data.flashcards[currentCardIdx].answer}
                    </p>
                    <span className="text-[9px] text-text-muted font-semibold flex items-center gap-1.5">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Click to return to question</span>
                    </span>
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
                  Deck Progress: {currentCardIdx + 1} / {data.flashcards.length}
                </span>
                <button
                  onClick={handleNextCard}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* D. QUIZ VIEW */}
          {activeTab === "Quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Score header */}
              <div className="glass-card p-5 border border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Interactive Assessment</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Select answers to evaluate your understanding</p>
                </div>
                {Object.keys(quizScores).length === data.quiz.length && (
                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-primary-dark text-white cursor-pointer transition-all"
                  >
                    Retake Quiz
                  </button>
                )}
              </div>

              {/* Questions Stream */}
              <div className="space-y-6">
                {data.quiz.map((q, idx) => {
                  const selectedIdx = quizScores[q.id];
                  const answered = selectedIdx !== undefined;

                  return (
                    <div key={q.id} className="glass-card p-6 border border-white/5 space-y-4">
                      <div className="flex gap-3 items-start">
                        <span className="w-6 h-6 rounded bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
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
                            optStyle = "bg-primary/10 border-primary text-white";
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
                          <div className="p-3 rounded-xl bg-white/[0.02] border-l-2 border-primary text-[10.5px] text-slate-300 leading-relaxed font-semibold">
                            <span className="text-white font-bold block mb-1">AI Explanation</span>
                            {q.explanation}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
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
                <Sparkles className="w-6 h-6 text-primary fill-primary/10" />
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
