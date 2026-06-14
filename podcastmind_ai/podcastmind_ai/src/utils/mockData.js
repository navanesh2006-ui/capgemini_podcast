// Sample Data and Mock Database for PodcastMind AI

export const mockPodcasts = [
  {
    id: "p1",
    title: "The AI Revolution Podcast",
    host: "Alex Carter",
    description: "Conversations on the frontier of AI research, multi-agent frameworks, neuro-symbolic systems, and how digital intelligence is transforming society, entrepreneurship, and creative workflows.",
    thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80",
    uploadDate: "2026-05-20",
    category: "Technology",
    duration: "3:48:50",
    episodesCount: 5,
    plays: "128,450",
    likes: "12,940",
    shares: "4,820",
    transcript: "Alex: Welcome to the AI Revolution. Today, we're talking about Agentic AI. We're joined by leading researchers to explore how software shifts from automated routines to autonomous agents. When we talk about Agentic AI, we are describing systems that can plan, execute, reason, and self-correct..."
  },
  {
    id: "p2",
    title: "Deep Tech Founder Lounge",
    host: "Sarah Jenkins",
    description: "Insights from builders creating hardtech, biotech, spatial computing, and AI hardware. Real talk about seed rounds, hardware scaling, and IP licensing.",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80",
    uploadDate: "2026-05-18",
    category: "Business",
    duration: "1:24:15",
    episodesCount: 2,
    plays: "45,210",
    likes: "3,890",
    shares: "1,120",
    transcript: ""
  },
  {
    id: "p3",
    title: "The Multiverse Mindset",
    host: "Dr. Ryan Vance",
    description: "Exploring cognitive models, neurodiversity, and how mental models from economics, physics, and philosophy combine to solve hard technology problems.",
    thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    uploadDate: "2026-05-12",
    category: "Philosophy",
    duration: "2:40:00",
    episodesCount: 3,
    plays: "32,900",
    likes: "2,450",
    shares: "910",
    transcript: ""
  }
];

export const mockEpisodes = [
  {
    id: "e1",
    podcastId: "p1",
    title: "The Future of Agentic AI",
    duration: "52:15",
    durationSeconds: 3135,
    plays: "38,420",
    likes: "3,120",
    uploadDate: "2026-05-20",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    host: "Alex Carter",
    audioUrl: "" // Dynamically handled via canvas audio simulator
  },
  {
    id: "e2",
    podcastId: "p1",
    title: "Building AI Startups",
    duration: "45:32",
    durationSeconds: 2732,
    plays: "28,150",
    likes: "2,450",
    uploadDate: "2026-05-15",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
    host: "Alex Carter",
    audioUrl: ""
  },
  {
    id: "e3",
    podcastId: "p1",
    title: "The Future of Work",
    duration: "38:11",
    durationSeconds: 2291,
    plays: "24,310",
    likes: "1,980",
    uploadDate: "2026-05-10",
    thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
    host: "Alex Carter",
    audioUrl: ""
  },
  {
    id: "e4",
    podcastId: "p1",
    title: "AI Ethics & Society",
    duration: "50:22",
    durationSeconds: 3022,
    plays: "19,820",
    likes: "1,540",
    uploadDate: "2026-05-05",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    host: "Alex Carter",
    audioUrl: ""
  },
  {
    id: "e5",
    podcastId: "p1",
    title: "LLM Trends 2025",
    duration: "42:10",
    durationSeconds: 2530,
    plays: "17,650",
    likes: "1,420",
    uploadDate: "2026-04-28",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80",
    host: "Alex Carter",
    audioUrl: ""
  }
];

export const mockViralClips = {
  e1: [
    {
      id: "clip-1",
      episodeId: "e1",
      startTime: "01:24",
      startTimeSeconds: 84,
      endTime: "02:10",
      quote: "AI won't replace humans, but humans with AI will replace humans without AI.",
      viralScore: 96,
      emotion: "🔥 Excitement",
      thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "clip-2",
      episodeId: "e1",
      startTime: "00:58",
      startTimeSeconds: 58,
      endTime: "01:40",
      quote: "The next decade belongs to those who build, not those who just use AI.",
      viralScore: 92,
      emotion: "💡 Inspiration",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "clip-3",
      episodeId: "e1",
      startTime: "12:15",
      startTimeSeconds: 735,
      endTime: "13:05",
      quote: "Agentic software doesn't wait for your keystroke; it schedules its own subtasks, reviews its mistakes, and executes iteratively.",
      viralScore: 88,
      emotion: "🧠 Deep Thinking",
      thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "clip-4",
      episodeId: "e1",
      startTime: "26:40",
      startTimeSeconds: 1600,
      endTime: "27:30",
      quote: "When multi-agent structures collaborate, the emergent intelligence can solve logic problems that completely freeze a single LLM.",
      viralScore: 85,
      emotion: "😮 Surprise",
      thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "clip-5",
      episodeId: "e1",
      startTime: "34:10",
      startTimeSeconds: 2050,
      endTime: "35:12",
      quote: "The bottleneck is no longer compute efficiency; it's our ability to design reliable guardrails for recursive autonomous logic.",
      viralScore: 79,
      emotion: "⚡ Curiosity",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80"
    }
  ]
};

export const mockEmotionTimeline = {
  e1: [
    { timestamp: "00:00", timestampSeconds: 0, excitement: 85, curiosity: 70, surprise: 45, deepThinking: 40, joy: 60, quote: "Let's plunge into the world of Agentic AI.", dominant: "Excitement" },
    { timestamp: "05:00", timestampSeconds: 300, excitement: 70, curiosity: 85, surprise: 50, deepThinking: 60, joy: 55, quote: "How can software dynamically reason?", dominant: "Curiosity" },
    { timestamp: "10:00", timestampSeconds: 600, excitement: 65, curiosity: 90, surprise: 40, deepThinking: 75, joy: 50, quote: "Structuring workflows using graph nodes.", dominant: "Curiosity" },
    { timestamp: "15:00", timestampSeconds: 900, excitement: 80, curiosity: 75, surprise: 85, deepThinking: 50, joy: 70, quote: "The model rewrites its own execution plan on the fly!", dominant: "Surprise" },
    { timestamp: "20:00", timestampSeconds: 1200, excitement: 60, curiosity: 80, surprise: 55, deepThinking: 88, joy: 45, quote: "Evaluating safety bounds of recursive subtasks.", dominant: "Deep Thinking" },
    { timestamp: "25:00", timestampSeconds: 1500, excitement: 82, curiosity: 78, surprise: 70, deepThinking: 65, joy: 80, quote: "It succeeded on 98% of the complex test cases!", dominant: "Joy" },
    { timestamp: "30:00", timestampSeconds: 1800, excitement: 75, curiosity: 85, surprise: 50, deepThinking: 92, joy: 40, quote: "Defining cognitive architectures: planners vs executors.", dominant: "Deep Thinking" },
    { timestamp: "35:00", timestampSeconds: 2100, excitement: 88, curiosity: 80, surprise: 78, deepThinking: 70, joy: 75, quote: "Imagine a company of 100 autonomous specialized agents.", dominant: "Excitement" },
    { timestamp: "40:00", timestampSeconds: 2400, excitement: 50, curiosity: 82, surprise: 60, deepThinking: 95, joy: 35, quote: "The alignment problem: value tracking in multi-turn logic.", dominant: "Deep Thinking" },
    { timestamp: "45:00", timestampSeconds: 2700, excitement: 91, curiosity: 75, surprise: 80, deepThinking: 60, joy: 85, quote: "We are releasing the entire agent framework open source today!", dominant: "Excitement" },
    { timestamp: "50:00", timestampSeconds: 3000, excitement: 78, curiosity: 80, surprise: 65, deepThinking: 82, joy: 79, quote: "The future is collaborative. Thanks for listening.", dominant: "Joy" }
  ]
};

export const mockKnowledge = {
  e1: {
    notes: [
      { id: "n1", content: "Agentic AI = Autonomous decision making. Agents plan, decide, and execute sequences of tools to achieve specified goals." },
      { id: "n2", content: "Multi-agent systems enable collaboration. Complex problems are split into subtasks handled by specialized personas (e.g. coder, tester, researcher)." },
      { id: "n3", content: "Future: AI as teammates, not tools. Moving from passive LLM chats to active agents that run in the background." },
      { id: "n4", content: "Ethics, safety & alignment are critical. Unchecked recursion can cause API loop failures, halluncinated chains, or security leaks." },
      { id: "n5", content: "Real world applications are exploding in healthcare diagnosis, automated trading, and physical robotics controls." }
    ],
    flashcards: [
      {
        id: "fc-1",
        question: "What distinguishes standard AI from Agentic AI?",
        answer: "Standard AI is primarily reactive (responds to direct prompts). Agentic AI is proactive and autonomous: it can break down goals, plan sequences, execute actions using external tools, evaluate results, and self-correct."
      },
      {
        id: "fc-2",
        question: "What is a 'Multi-Agent System'?",
        answer: "A design pattern where multiple specialized AI agents collaborate. Each agent is given a specific role, system prompt, and subset of tools, communicating via structured channels to solve complex objectives."
      },
      {
        id: "fc-3",
        question: "What is the role of a 'Plan-and-Solve' loop?",
        answer: "It is an agentic pattern where the AI generates a multi-step task list, executes steps sequentially, reviews the output at each step, and dynamically adjusts the remaining plan based on results."
      },
      {
        id: "fc-4",
        question: "Explain the risk of 'Recursive Loop Execution'.",
        answer: "A state where an agent repeatedly queries tools in an infinite cycle because it lacks a clear termination condition or fails to interpret errors, resulting in high costs or server overload."
      },
      {
        id: "fc-5",
        question: "What is 'Neuro-symbolic AI' in the context of agents?",
        answer: "Combining connectionist neural systems (like LLMs for intuition and text) with symbolic reasoning rules (like graph search or constraint solvers for strict logic and math verification)."
      }
    ],
    quiz: [
      {
        id: "q-1",
        question: "Which component is responsible for maintaining state and task history in an agentic loop?",
        options: ["Vector Database", "Memory Buffer", "Model Weights", "API Endpoint"],
        answer: "Memory Buffer",
        explanation: "Memory buffers store short-term execution trails, variables, and past tools' outputs during a single session, allowing the agent to remember what it has done."
      },
      {
        id: "q-2",
        question: "What does an agent use to interact with databases, web browsers, or sandboxed consoles?",
        options: ["Embeddings", "System Prompts", "Tools / Functions", "Fine-Tuning"],
        answer: "Tools / Functions",
        explanation: "Tools or functions are standard interfaces (APIs) defined in the agent's schema that the model can invoke to read or write external data."
      },
      {
        id: "q-3",
        question: "What represents a major bottleneck in scaling multi-agent orchestrations?",
        options: ["Prompt length constraints", "API context window & token consumption costs", "Loss of physical server hardware", "Slow internet connections"],
        answer: "API context window & token consumption costs",
        explanation: "Multi-agent systems pass long transcripts, history, and tool definitions back and forth, consuming millions of tokens quickly and expanding context length."
      },
      {
        id: "q-4",
        question: "What is a popular design framework for agent safety alignment?",
        options: ["Constitutional AI", "Hyperparameter tuning", "VGGNet", "Recursive SQL"],
        answer: "Constitutional AI",
        explanation: "Constitutional AI uses a set of explicit, readable rules (a constitution) that a critic model uses to evaluate and filter an agent's outputs."
      },
      {
        id: "q-5",
        question: "What is the primary benefit of the ReAct (Reason + Act) design pattern?",
        options: ["It removes the need for vector retrieval.", "It alternates reasoning thoughts with actions, increasing execution trace transparency and success rates.", "It compiles Javascript code to C++.", "It bypasses GPU nodes entirely."],
        answer: "It alternates reasoning thoughts with actions, increasing execution trace transparency and success rates.",
        explanation: "ReAct prompts the model to output a 'Thought' explaining its strategy, followed by an 'Action' (calling a tool), and then receiving an 'Observation'. This makes reasoning auditable and structured."
      }
    ],
    summary: {
      paragraphs: [
        "In this episode, host Alex Carter breaks down the structural shift from static LLM querying to autonomous, goal-directed agent loops. The primary thesis is that software is evolving from standard trigger-response automation into active digital team members. This evolution is unlocked by advanced reasoning capabilities that let models self-correct when actions fail.",
        "The conversation outlines the core design pattern of multi-agent architectures, wherein complex tasks are split among specialized agents. For example, a research agent gathers data, a coding agent writes the script, and a testing agent runs validation. By collaborating in structured graph environments, these systems overcome token limits and semantic drifts that typically freeze individual models.",
        "Lastly, the speaker underscores the massive developer challenge of alignment, security, and cost control. Because agentic loops execute recursively, they are prone to infinite loops and security exploits if not bounded. The host concludes that building robust agent platforms requires strict constitutional guardrails and real-time execution telemetry to make AI actions transparent and safe."
      ]
    },
    mindMap: {
      id: "root",
      label: "Agentic AI Ecosystem",
      expanded: true,
      children: [
        {
          id: "core",
          label: "Core Architecture",
          expanded: true,
          children: [
            { id: "c1", label: "Goal Decomposition", expanded: false },
            { id: "c2", label: "Memory (Short/Long term)", expanded: false },
            { id: "c3", label: "Tool Execution Interfaces", expanded: false }
          ]
        },
        {
          id: "collaboration",
          label: "Orchestration Models",
          expanded: true,
          children: [
            { id: "co1", label: "Multi-Agent Graphs", expanded: false },
            { id: "co2", label: "ReAct (Reason + Act)", expanded: false },
            { id: "co3", label: "Supervisor Routing", expanded: false }
          ]
        },
        {
          id: "guardrails",
          label: "Safety & Alignment",
          expanded: true,
          children: [
            { id: "g1", label: "Constitutional Safety", expanded: false },
            { id: "g2", label: "Execution Bounding", expanded: false },
            { id: "g3", label: "Human-in-the-Loop (HITL)", expanded: false }
          ]
        }
      ]
    }
  }
};

export const mockAudienceInsights = {
  e1: {
    engagementScore: 78,
    audienceRetention: 78,
    audienceRetentionChange: 12,
    avgWatchTime: "31:24",
    avgWatchTimeSeconds: 1884,
    avgWatchTimeChange: 8,
    dropoffPoint: "22:15",
    dropoffPointSeconds: 1335,
    dropoffPointChange: -5,
    totalListens: "38,420",
    completionRate: 64,
    retentionCurve: [
      { timestamp: "00:00", rate: 100 },
      { timestamp: "05:00", rate: 95 },
      { timestamp: "10:00", rate: 90 },
      { timestamp: "15:00", rate: 88 },
      { timestamp: "20:00", rate: 82 },
      { timestamp: "22:15", rate: 78 }, // Dropoff point reference
      { timestamp: "25:00", rate: 75 },
      { timestamp: "30:00", rate: 72 },
      { timestamp: "35:00", rate: 70 },
      { timestamp: "40:00", rate: 68 },
      { timestamp: "45:00", rate: 66 },
      { timestamp: "50:00", rate: 64 },
      { timestamp: "52:15", rate: 62 }
    ],
    devices: [
      { name: "Mobile", value: 55, color: "#7B5EFF" },
      { name: "Desktop", value: 30, color: "#FF5E9C" },
      { name: "Smart Speakers", value: 15, color: "#00E5A0" }
    ],
    geography: [
      { country: "United States", listens: "17,289", share: 45 },
      { country: "United Kingdom", listens: "6,915", share: 18 },
      { country: "Germany", listens: "4,610", share: 12 },
      { country: "India", listens: "3,842", share: 10 },
      { country: "Canada", listens: "3,073", share: 8 },
      { country: "Others", listens: "2,691", share: 7 }
    ]
  }
};

export const mockPerspectives = {
  e1: {
    beginner: {
      emoji: "😊",
      title: "Beginner Mode",
      tagline: "Simple explanations & key basics",
      summary: "In this mode, all technical jargon is simplified into friendly analogies. For example, an 'Agentic AI' is explained as a digital assistant that can do a list of tasks for you, rather than just answer questions. If you ask it to plan a trip, it doesn't just write down places; it checks reviews, looks up prices, and puts together a schedule, checking and fixing its own errors along the way.",
      bullets: [
        "What is an agent? Think of it like a smart assistant that can carry out tasks on its own, not just chat with you.",
        "Why is it different? Normal AI needs your help at every step. Agentic AI is given a goal (like 'write a report') and works until it is done.",
        "Analogy: A standard chat AI is a calculator; an agent is a helpful research assistant.",
        "Emergence: When multiple agent systems talk to each other, they work like a team in an office, double-checking each other's work."
      ],
      insight: "Crucial takeaway: The future of software means you describe what you want done, and the software works in the background to deliver it."
    },
    founder: {
      emoji: "🚀",
      title: "Founder Mode",
      tagline: "Business impact & startup insights",
      summary: "This mode focuses on how startups can build moat-like products in the age of agentic software, and where the economic value accumulates. Alex outlines that the marginal cost of execution is dropping to near zero. Startups must focus on building proprietary evaluation datasets and tight integrations rather than basic wrapper clients.",
      bullets: [
        "Market disruption: Traditional SaaS platforms that charge per seat will be replaced by outcome-based pricing models run by AI worker networks.",
        "Cost Structure Shift: Instead of human headcount scaling linearly, founders can scale execution bandwidth exponentially via multi-agent networks.",
        "Building Moats: The value is not in renting LLMs; it is in owning the business feedback loop and fine-tuning custom agent constitutional constraints.",
        "New Opportunities: Micro-agents for specialized industries (compliance, tax, biotech) represent huge blue-ocean spaces."
      ],
      insight: "Key Opportunity: The companies that build reliable telemetry and security guardrails for autonomous agents will capture massive B2B enterprise software value."
    },
    expert: {
      emoji: "🧠",
      title: "Expert Mode",
      tagline: "Deep technical analysis",
      summary: "For researchers and engineers, this mode parses the exact algorithmic patterns discussed in the episode. It covers the mathematical formulation of ReAct prompts, tree-of-thoughts search nodes, and memory injection states. Alex discusses how neuro-symbolic systems bridge the gap between probabilistic LLM outputs and deterministic graph checks.",
      bullets: [
        "Cognitive Patterns: Focuses on DAG (Directed Acyclic Graph) architectures where agents route intermediate JSON states through validation models.",
        "Memory Implementations: Contrasts simple chat-history buffers with dynamic vector store database retrieval and episodic memory compression.",
        "Self-Correction: Explores how critiques are parsed back into system prompts via code execution traces (evaluating stack traces as model inputs).",
        "Orchestration: Compares orchestrators (central routing models) with choreographers (peer-to-peer event streams)."
      ],
      insight: "Technical bottleneck: Managing latency in multi-turn reasoning chains. Every call to an LLM adds seconds, making execution speed optimization the primary engineering priority."
    },
    critical: {
      emoji: "⚖️",
      title: "Critical Mode",
      tagline: "Balanced analysis & different opinions",
      summary: "This perspective scrutinizes the overhyped claims of autonomous agents. It addresses safety risks, cost blowouts, and the lack of reliable deterministic boundaries. While enthusiasts celebrate autonomous code generation, critics point out that agents can exhaust credit card APIs in minutes, hallucinate loops, and fail silently in ways that are hard to debug.",
      bullets: [
        "Hype vs. Reality: Most current agent frameworks fail on complex real-world tasks more than 60% of the time, requiring constant human rescue.",
        "Cost Exposures: Autonomous agent recursion can generate thousands of API calls, leading to massive cloud bills for zero actual output.",
        "Security Threats: Prompt injection vulnerabilities are magnified. If an agent accesses your email, a malicious email can hijack the agent's goal.",
        "Job Displacement Anxiety: While creators promise augmentation, the obvious business incentive is labor cost replacement, creating socio-economic friction."
      ],
      insight: "Cynical truth: Until we solve the reliability and security isolation boundary problems, agents will remain limited to low-risk developer sandboxes."
    }
  }
};
