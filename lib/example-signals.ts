// Three example signals across the threat spectrum.
// Each cached_result was captured from the live Groq llama-3.3-70b run
// against the current profile + system prompt — frozen here so the demo
// renders instantly and survives an API blip.
import type { ExampleSignal } from "./types"

export const exampleSignals: ExampleSignal[] = [
  {
    title: "Microsoft Agent Governance Toolkit launches",
    raw_text: `Microsoft introduces the Agent Governance Toolkit: open-source runtime security for AI agents.

Today we're sharing the Agent Governance Toolkit, an open-source project released under the Microsoft organization and MIT license that brings runtime security governance to autonomous AI agents. It is the first toolkit to address all ten OWASP agentic AI risks with deterministic, sub-millisecond policy enforcement. It is designed to work with the frameworks developers already use, not replace them.

The result is a seven-package toolkit, available in Python, TypeScript, Rust, Go, and .NET, that provides:

Agent OS: a stateless policy engine that intercepts every agent's action before execution at sub-millisecond latency (<0.1ms p99). Think of it as the kernel for AI agents. Supports YAML rules, OPA Rego, and Cedar policy languages.

Agent Mesh: cryptographic identity (decentralized identifiers with Ed25519), the Inter-Agent Trust Protocol (IATP) for secure agent-to-agent communication, and dynamic trust scoring on a 0 to 1000 scale with five behavioral tiers.

Agent Runtime: dynamic execution rings inspired by CPU privilege levels, saga orchestration for multi-step transactions, and a kill switch for emergency agent termination.

Agent SRE: SLOs, error budgets, circuit breakers, chaos engineering, and progressive delivery applied to agent systems.

Agent Compliance: automated governance verification with compliance grading, regulatory framework mapping (European Union AI Act, HIPAA, SOC2), and OWASP Agentic AI Top 10 evidence collection covering all ten risk categories.

The toolkit is framework-agnostic from day one. Each integration hooks into a framework's native extension points — LangChain's callback handlers, CrewAI's task decorators, Microsoft Agent Framework's middleware pipeline — so adding governance does not require rewriting agent code.`,
    cached_result: {
      overlap_score: 80,
      threat_type: "positioning_collision",
      confidence: "high",
      why_it_matters:
        "Microsoft's Agent Governance Toolkit directly competes with Precept Labs' positioning on AI agent integrity and governance, potentially threatening Precept Labs' market share and validation. The toolkit's comprehensive features and open-source nature may attract AI developers and compliance leads, Precept Labs' target users.",
      evidence_lines: [
        "open-source runtime security for AI agents",
        "deterministic, sub-millisecond policy enforcement",
        "automated governance verification with compliance grading",
        "regulatory framework mapping (European Union AI Act, HIPAA, SOC2)",
      ],
      recommended_action: "reposition",
    },
  },
  {
    title: "Langfuse 4.0 ships Agent Trace View",
    raw_text: `Langfuse 4.0 introduces Agent Trace View, a new visualization mode that maps every step in a multi-agent workflow as a traceable graph. Developers can drill into agent-to-agent handoffs, inspect the inputs and outputs at each step, and run automated evaluations on final outputs.

The release adds native OpenTelemetry GenAI span support and out-of-the-box integrations with LangGraph and CrewAI. Teams can correlate evaluation scores with specific handoffs, making post-run debugging of multi-agent failures dramatically faster.

Agent Trace View is available now to all Langfuse Cloud and self-hosted users on supported tiers.`,
    cached_result: {
      overlap_score: 40,
      threat_type: "adjacent_noise",
      confidence: "medium",
      why_it_matters:
        "Langfuse 4.0's Agent Trace View introduces a visualization mode for multi-agent workflows, which is related to Precept Labs' focus on information integrity at agent boundaries. However, Langfuse's approach focuses on post-run debugging and output tracing, rather than pre-handoff scoring and information contracts.",
      evidence_lines: [
        "maps every step in a multi-agent workflow as a traceable graph",
        "inspect the inputs and outputs at each step",
        "correlate evaluation scores with specific handoffs",
      ],
      recommended_action: "monitor",
    },
  },
  {
    title: "Zapier launches AI Steps",
    raw_text: `Zapier announces AI Steps, a new no-code feature that lets users insert a ChatGPT or Claude step into any Zap. Summarize incoming emails before routing them, classify support tickets, draft Slack replies, or generate weekly reports — all without writing code.

AI Steps is available now to Zapier customers on the Pro plan and above. Token usage is included in plan quotas, with no separate AI provider account required.`,
    cached_result: {
      overlap_score: 10,
      threat_type: "non_threat",
      confidence: "low",
      why_it_matters:
        "The signal is about a no-code feature for integrating AI models into workflows, which is unrelated to Precept Labs' focus on information integrity and contracts between AIs.",
      evidence_lines: [
        "Zapier announces AI Steps, a new no-code feature",
        "insert a ChatGPT or Claude step into any Zap",
        "Summarize incoming emails before routing them, classify support tickets",
      ],
      recommended_action: "ignore",
    },
  },
]
