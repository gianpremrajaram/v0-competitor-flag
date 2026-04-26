Skip to content
Microsoft
Open Source
Get involved Projects Ecosystem Our program Jobs Blog
All Microsoft
Search 
Light

Dark
Blog home
News
Search the site
Search the blog
Search
News • April 2, 2026 • 6 min read
Introducing the Agent Governance Toolkit: Open-source runtime security for AI agents
By Imran Siddique, Principal Group Engineering Manager, Microsoft

Share
Content type
News
Tags
Azure Kubernetes Service
Azure Open Source
more
AI agents are crossing a threshold. They’re no longer just answering questions in chat windows, they’re booking flights, executing trades, writing code, and managing infrastructure autonomously. Frameworks like LangChain, AutoGen, CrewAI, Microsoft Agent Framework, and Microsoft Foundry Agent Service have made it remarkably easy to build agents that reason, plan, and act. 

But as agents gain autonomy, a critical question emerges: who governs what they do? 

In December 2025, OWASP published the Top 10 for Agentic Applications for 2026, the first formal taxonomy of risks specific to autonomous AI agents, including goal hijacking, tool misuse, identity abuse, memory poisoning, cascading failures, and rogue agents. Regulatory frameworks are following: the European Union AI Act’s high-risk AI obligations take effect in August 2026, and the Colorado AI Act becomes enforceable in June 2026. The infrastructure to govern autonomous agent behavior has not kept pace with the ease of building agents. 

Today, we’re sharing the Agent Governance Toolkit, an open-source project released under the Microsoft organization and MIT license that brings runtime security governance to autonomous AI agents. It is the first toolkit to address all 10 OWASP agentic AI risks with deterministic, sub-millisecond policy enforcement. It’s designed to work with the frameworks developers already use, not replace them. 

Explore the Agent Governance Toolkit
Why we built this 
When we looked at how AI agents operate in practice, we noticed a familiar pattern: multiple untrusted programs sharing resources, making decisions, and interacting with the outside world, with limited mediation of their actions. 

Operating systems solved a similar problem decades ago with kernels, privilege rings, and process isolation. Service meshes solved it for microservices with mTLS and identity. Site Reliability Engineering (SRE) practices solved it for distributed systems with Service Level Objectives (SLOs) and circuit breakers. 

We asked: what if we took these proven, battle-tested patterns and applied them to AI agents? 

The result is a seven-package toolkit, available in Python, TypeScript, Rust, Go, and .NET, that provides: 

Agent OS: A stateless policy engine that intercepts every agent’s action before execution at sub-millisecond latency (<0.1ms p99). Think of it as the kernel for AI agents. Supports YAML rules, OPA Rego, and Cedar policy languages.
Agent Mesh: Cryptographic identity (decentralized identifiers (DIDs) with Ed25519), the Inter-Agent Trust Protocol (IATP) for secure agent-to-agent communication, and dynamic trust scoring on a 0 to 1000 scale with five behavioral tiers.
Agent Runtime: Dynamic execution rings inspired by CPU privilege levels, saga orchestration for multi-step transactions, and a kill switch for emergency agent termination.
Agent SRE: SLOs, error budgets, circuit breakers, chaos engineering, and progressive delivery—production reliability practices applied to agent systems.
Agent Compliance: Automated governance verification with compliance grading, regulatory framework mapping (European Union AI Act, HIPAA, and system and organization controls 2 (SOC2), and OWASP Agentic AI Top 10 evidence collection covering all 10 risk categories.
Agent Marketplace: Plugin lifecycle management with Ed25519 signing, verification, trust-tiered capability gating, and supply-chain security.
Agent Lightning: Reinforcement learning (RL) training governance with policy-enforced runners and reward shaping ensures zero policy violations during reinforcement learning training. 
Designed for the ecosystem 
A governance toolkit is only useful if it works with the frameworks people actually use. We designed the toolkit to be framework-agnostic from day one. Each integration hooks into a framework’s native extension points, LangChain’s callback handlers, CrewAI’s task decorators, Google ADK’s plugin system, Microsoft Agent Framework’s middleware pipeline, so adding governance doesn’t require rewriting agent code. 

Several integrations are already working with production frameworks. Dify has the governance plugin in its marketplace. LlamaIndex has a TrustedAgentWorker integration. The OpenAI Agents SDK, Haystack, LangGraph, and PydanticAI integrations are shipped, OpenAI Agents and LangGraph are published on PyPl, Haystack is upstream, and PydanticAI has a working adapter. 

The toolkit also works across language ecosystems. A TypeScript SDK is available through npm (@microsoft/agentmesh-sdk), and a .NET SDK is available in NuGet (Microsoft.AgentGovernance), bringing the same governance capabilities to Node.js and C# teams. 

For developers building with any of these frameworks, governance is a pip install and a few lines of configuration away: 

pip install agent-governance-toolkit[full] 

Open source by design 
The project is MIT-licensed and structured as a monorepo with seven independently installable packages. Teams can adopt governance incrementally—start with just the policy engine, add identity when multi-agent scenarios emerge, and layer in SRE practices as systems scale. 

We believe agent governance is too important to be controlled by any single vendor. We’re releasing this project under Microsoft today, but our aspiration is to move it into a foundation home where it can be governed by the broader community. We’re actively engaging with the OWASP agentic AI community and foundation leaders to make this happen. Our goal is to make the world more secure everywhere, and that requires shared stewardship. 

We’ve invested in the open-source fundamentals: 

More than 9,500 tests across all packages, with continuous fuzzing through ClusterFuzzLite.
Supply-chain Levels for Software Artifacts (SLSA)-compatible build provenance with actions and attest-build-provenance.
OpenSSF Scorecard tracking at scorecard.dev.
CodeQL and Dependabot for automated vulnerability scanning.
Pinned dependencies with cryptographic hashes for continuous integration (CI) tooling.
20 step-by-step tutorials covering every package and feature.
.NET and TypeScript SDKs alongside Python for cross-platform teams.
The architecture is designed to be extensible. The toolkit exposes public interfaces—ToolCallInterceptor, BaseIntegration, PluginInterface, PolicyProviderInterface—that allow third-party tools to plug into the governance pipeline without modifying core code. 

Addressing the OWASP Agentic AI Top 10 
When OWASP published their Agentic AI Top 10 in December 2025, the first formal taxonomy of risks specific to autonomous AI agents, we mapped each risk to the toolkit’s capabilities: 

Goal hijacking—Semantic intent classifier in the policy engine.
Tool misuse—Capability sandboxing and Model Context Protocol (MCP) security gateway.
Identity abuse—DID-based identity with behavioral trust scoring.
Supply chain risks—Plugin signing with Ed25519 and manifest verification.
Code execution—Execution rings with resource limits.
Memory poisoning—Cross-Model Verification Kernel (CMVK) with majority voting.
Insecure communications—Inter-Agent Trust Protocol (IATP) encryption layer.
Cascading failures—Circuit breakers and SLO enforcement.
Human-agent trust exploitation—Approval workflows with quorum logic.
Rogue agents—Ring isolation, trust decay, and automated kill switch.
This alignment was by design. The OS-inspired architecture creates defense in depth, multiple independent layers that each address different threat categories. 

What we learned building in the open 
Building this toolkit reinforced several lessons that apply broadly to open-source projects: 

Borrow from solved problems. The OS kernel, service mesh, and SRE playbook all addressed security and reliability in other domains. Translating those patterns to AI agents was more effective than inventing from scratch. The open-source community has decades of wisdom embedded in these systems; we tried to honor that by building on it.
Make security the default, not an add-on. We built governance into the execution path, intercepting actions, rather than as an optional wrapper. Optional security tends to go unadopted. That said, no security layer is a silver bullet; defense in depth and ongoing monitoring remain essential. 
Statelessness enables everything. By making the kernel stateless, horizontal scaling, containerized deployment, and auditability came naturally. Every design decision became easier once we committed to statelessness. 
Trust is dynamic, not static. A binary trusted and untrusted model doesn’t capture reality. Trust scoring with behavioral decay and dynamic privilege assignment turned out to be a much better model for systems where agents are constantly changing. 
Community and contributions 
The toolkit has already received its first community contributions, including a Pull Request for a failure-mode analysis module and an integration with Microsoft’s Agent Framework middleware pipeline. We’re actively engaging with the OWASP Agent Security Initiative, the LF AI & Data Foundation, and the CoSAI working groups. 

We welcome contributions of all kinds, new framework adapters, policy templates, documentation improvements, bug reports, and feature requests. 

Get started 
git clone https://github.com/microsoft/agent-governance-toolkit 

cd agent-governance-toolkit 

pip install -e "packages/agent-os[dev]" -e "packages/agent-mesh[dev]" -e "packages/agent-sre[dev]" 

# Run the governance demo 

python demo/maf_governance_demo.py 

The toolkit runs at sub-millisecond governance latency (<0.1ms p99) and works with Python 3.10+. Individual packages are available on PyPI for teams that want to adopt incrementally. 

Deploy on Microsoft Azure 
For the fastest path to production, deploy the toolkit on Azure: 

Microsoft Azure Kubernetes Service (AKS): Deploy the policy engine as a sidecar container alongside your agents for transparent governance.
Microsoft Foundry Agent Service: Use the built-in middleware integration for agents built on Foundry.
Microsoft Azure Container Apps: Run governance-enabled agents in a serverless container environment.
Explore our Azure deployment guides in the repository for step-by-step instructions for each scenario. 

AI agents are becoming autonomous decision-makers in high-stakes domains. The question isn’t whether we need governance for these systems, but whether we’ll build it proactively, before incidents force our hand, or reactively, after them. We chose proactively. We built it in the open. We hope you’ll join us.

Learn more about the Agent Governance Toolkit
The Agent Governance Toolkit is open source under the MIT license. 
