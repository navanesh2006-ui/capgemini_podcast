// Mock transcripts database for PodcastMind AI chat panel
// Each transcript contains 20+ timestamped entries in the format [MM:SS] Speaker: text

export const mockTranscripts = {
  e1: `[00:00] Host: Welcome to this episode. Today we are talking about the Future of Agentic AI.
[01:15] Host: We are joined by Dr. Sarah Jenkins, an AI Pioneer. Sarah, what is agentic AI?
[02:40] Guest: Thanks for having me. Agentic AI refers to systems that don't just process queries but actually act autonomously to achieve complex goals.
[04:10] Host: How does that differ from traditional chat bots?
[05:45] Guest: Chat bots are reactive. Agentic systems are proactive—they plan, use tools, and correct their own errors.
[08:15] Guest: At 08:15, let's look at multi-agent systems, where multiple specialized agents collaborate to solve a problem.
[10:30] Host: That sounds like a company where different departments work together.
[12:00] Guest: Exactly. You might have an agent for coding, one for testing, and one for project management.
[14:15] Host: How do these agents maintain memory across tasks?
[16:40] Guest: They use vector databases for long-term memory and local buffers for short-term working context.
[18:50] Host: What are the main frameworks developers use to build these agents today?
[21:10] Guest: LangChain and CrewAI are very popular, as well as Auto-GPT for autonomous task loops.
[23:35] Host: What are the limitations or bottlenecks of this technology?
[25:50] Guest: Infinite loops are a huge problem. An agent can get stuck trying to solve the same error repeatedly.
[28:15] Guest: At 28:15, another bottleneck is hallucination. If an agent hallucinates a tool argument, the entire pipeline fails.
[31:00] Host: How do we secure these systems against prompt injection?
[33:20] Guest: We use input sanitization, dual-LLM architectures for security checks, and strict environment sandboxing.
[35:45] Host: Tell us about human-in-the-loop, or HITL, design.
[38:10] Guest: HITL ensures that for high-risk actions, like sending an email or spending money, the agent prompts a human for approval.
[41:30] Host: What is the long-term outlook for agentic systems in daily life?
[44:15] Guest: By 2030, everyone will have personal agent co-pilots managing their schedules, research, and communication.
[47:50] Host: That sounds both exciting and slightly overwhelming.
[50:10] Guest: It is a massive shift, but with the right alignment and safety guardrails, it will unlock incredible productivity.
[52:00] Host: Thank you, Sarah, for sharing these insights on Agentic AI.`,

  e2: `[00:00] Host: Welcome to another episode. Today we're discussing Building AI Startups.
[01:20] Host: Our guest is Jackie Jantos, a seasoned tech founder. Jackie, how do you find a real problem to solve?
[02:50] Guest: Hi everyone. The key is avoiding the 'wrapper app' trap. You need to solve deep workflow problems, not just put a pretty UI on an API.
[04:30] Host: Can you explain the AI stack for startups?
[06:10] Guest: The stack is split into the infrastructure layer, the middleware layer, and the application layer. Startups should focus on the application layer.
[08:00] Guest: At 08:00, let's talk about model fine-tuning versus RAG, or retrieval-augmented generation.
[10:15] Host: When should a founder choose one over the other?
[12:10] Guest: RAG is better for proprietary and dynamic data. Fine-tuning is better for teaching the model a specific style or format.
[14:30] Host: How important is customer acquisition in the early days?
[16:50] Guest: It is everything. You must talk to customers daily and iterate on their feedback immediately.
[19:20] Host: What APIs are standard in your tech stack?
[21:40] Guest: OpenAI's GPT-4o and Anthropic's Claude 3.5 Sonnet are standard, along with Pinecone or pgvector for vector databases.
[24:10] Host: What about GPU hosting? Is it a major bottleneck?
[26:30] Guest: Yes, for training models, it is very expensive. But for inference, using serverless API endpoints saves a lot of capital.
[28:50] Guest: At 28:50, let's discuss VCs and fundraising in 2025 and 2026.
[31:10] Host: What are investors looking for now?
[33:30] Guest: Defensibility. They want to see data moats, unique user workflows, and high customer retention.
[36:00] Host: How do you build a team of AI engineers when the market is so competitive?
[38:20] Guest: Hire generalist software engineers who are curious. You don't need PhDs to build great AI applications.
[40:50] Host: What's your advice on pricing strategies?
[43:00] Guest: Don't charge based on API usage alone. Charge based on the value and time saved for the user.
[45:00] Host: Thank you, Jackie. That was an invaluable guide to building AI startups.`,

  e3: `[00:00] Host: Welcome to All In The Mind. Today's topic is the Future of Work in the age of AI.
[01:10] Host: I'm joined by Dr. Ryan Vance, a future workplace specialist. Ryan, what is the biggest change we'll see?
[02:30] Guest: The biggest change is the automation of routine cognitive tasks. Things like summarizing reports, scheduling, and basic drafting are being taken over by AI.
[04:00] Host: Will this lead to massive unemployment?
[05:45] Guest: It will cause displacement, yes, but also creation. We'll need people to manage, audit, and direct these AI systems.
[07:50] Guest: At 07:50, we should discuss up-skilling and vocational training.
[10:00] Host: How can workers prepare for this transition?
[11:50] Guest: Learn how to write good prompts, understand vector indexing basics, and focus on uniquely human skills like empathy and complex problem solving.
[13:40] Host: What about remote work? How does AI play into that?
[15:50] Guest: AI enables better asynchronous collaboration. Automated meeting summaries and translation tools make global remote teams highly efficient.
[18:10] Host: Do you think AI will lead to a 4-day work week?
[20:30] Guest: That is the hope. If productivity gains are shared fairly, workers can achieve the same output in fewer hours.
[22:40] Host: Let's talk about the gig economy. How is that evolving?
[25:00] Guest: AI-powered platforms are matching freelancers with tasks instantly, predicting rates, and even vetting project quality.
[27:15] Guest: At 27:15, a major challenge is management. How do you manage a team that is part human and part AI agent?
[29:30] Host: Yes, that sounds like a coordination nightmare.
[31:40] Guest: It requires new management frameworks where AI actions are audited and human-in-the-loop reviews are integrated.
[33:50] Host: How should the education system adapt?
[36:10] Guest: We must move away from rote memorization and focus on critical thinking, collaboration, and computer science literacy.
[38:00] Host: Excellent summary. Thank you, Ryan, for this look into the future of work.`,

  e4: `[00:00] Host: Welcome back. Today we're exploring AI Ethics and Society.
[01:15] Host: Our guest is Dr. Ryan Vance, an ethics professor. Ryan, what are the primary concerns today?
[02:45] Guest: The immediate concerns are bias, fairness, and the lack of representativeness in training data, which leads to discriminatory outcomes.
[04:30] Host: How does bias sneak into these models?
[06:10] Guest: Models learn from historical human data. If the historical data is biased, the model will replicate and even amplify that bias.
[08:15] Guest: At 08:15, let's address deepfakes, misinformation, and election integrity.
[10:30] Host: How can we combat the flood of AI-generated fake media?
[12:10] Guest: We need cryptographically signed metadata, like watermarks, and better public media literacy programs.
[14:30] Host: What is the alignment problem?
[16:50] Guest: It is the challenge of ensuring AI systems' goals align with human values and safety, preventing unintended consequences.
[19:20] Host: How are copyright and IP rights changing?
[21:40] Guest: Creators are fighting back against unauthorized scraping of their books, music, and art for training data.
[24:10] Host: What is the status of government regulations?
[26:30] Guest: The EU AI Act is active, placing strict rules on high-risk AI uses, while other regions are focusing on voluntary guidelines.
[28:45] Guest: At 28:45, let's compare existential risk from AGI versus near-term harms.
[31:00] Host: Which should we focus on?
[33:20] Guest: We must focus on both. Near-term harms like bias and job displacement are happening now, but we must also lay the groundwork for safe superintelligence.
[35:50] Host: What about the role of open source AI in society?
[38:10] Guest: Open source democratizes access to technology, but it also increases the risk of malicious actors repurposing models.
[41:00] Host: How does Universal Basic Income, or UBI, fit into this future?
[43:20] Guest: UBI is increasingly discussed as a necessary cushion for workers displaced by rapid automation.
[46:15] Host: How can companies build ethical AI practices?
[48:30] Guest: Establish independent ethics boards, conduct third-party audits of models, and prioritize transparency.
[50:10] Host: Thank you, Ryan. That was a crucial discussion on AI ethics.`,

  e5: `[00:00] Host: Welcome to this segment. Today we are discussing LLM Trends 2025.
[01:10] Host: Our guest is Sarah Jenkins, an AI engineer. Sarah, what is the biggest technical trend?
[02:30] Guest: The shift towards Mixture of Experts, or MoE, architectures. Instead of activating the entire network, we only route queries to specialized sub-networks.
[04:10] Host: Does that make model execution faster and cheaper?
[05:50] Guest: Exactly. It reduces the computational cost of running massive models while maintaining performance.
[07:50] Guest: At 07:50, let's look at Small Language Models, or SLMs, running locally on devices.
[10:15] Host: Will we have full LLMs running on our smartphones?
[12:10] Guest: Yes, Apple and Google are deploying highly optimized 3B to 7B models on-device, offering instant, private responses.
[14:30] Host: How is multimodality changing LLM interactions?
[16:50] Guest: Models are now natively multimodal. They process text, images, video, and audio simultaneously without needing separate pipelines.
[19:20] Host: What are reasoning models, like OpenAI's o1 or deep thinking architectures?
[21:40] Guest: These models use chain-of-thought processing and reinforcement learning to 'think' before responding, greatly improving math and coding logic.
[24:10] Host: How cheap are API tokens becoming?
[26:30] Guest: Token costs have dropped by over 90% in the last year, making complex agentic loops economically viable.
[28:45] Guest: At 28:45, let's discuss context window expansion.
[31:00] Host: Models can now process millions of tokens. How does this affect developers?
[33:20] Guest: You can pass entire codebases or books directly into the context window, reducing the immediate need for complex RAG setups.
[35:50] Host: Tell us about the use of synthetic data for training LLMs.
[38:10] Guest: As real-world human data runs out, models are trained on high-quality data generated by other models.
[40:40] Host: What hardware advancements are driving this?
[41:50] Guest: Nvidia's new architectures, Google TPUs, and custom silicon from cloud providers are accelerating training speeds.
[42:10] Host: Thank you, Sarah, for this technical deep dive into LLM trends.`
};
