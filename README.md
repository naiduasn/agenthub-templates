# AgentHub Templates

Global YAML templates for AgentHub agents, workflows, skills, and connections.

This repository is the source of truth for built-in templates. AgentHub syncs these templates into its control plane, then users clone them into tenant/project scope before customizing or running them.

## Layout

```txt
templates/
├── agents/
├── workflows/
├── skills/
└── connections/
schemas/
scripts/
```

Each template lives in its own folder with a `template.yaml` file. Optional local files such as `instructions.md`, `SKILL.md`, and `README.md` can be referenced from the YAML and are inlined into the generated catalog.

## Validate

```sh
npm install
npm run validate
npm run build:catalog
```

`npm run build:catalog` writes `dist/catalog.json`.

## Design Rules

- Workflows declare abstract connection slots and capabilities, not provider credentials.
- Connections expose capabilities such as `portfolio.holdings.read` or `market.quotes.read`.
- Projects bind workflow slots to concrete connection instances such as Kite, a custom MCP server, or an internal API.
- Global templates are immutable inputs. Tenant/project clones are where customization happens.
- Template updates should be opt-in for cloned instances. A newer global template may show an "update available" state, but must not silently mutate customer-owned instructions, skills, workflow stages, connections, or schedules.

## Categories

Templates use a small category taxonomy in YAML metadata. Prefer these category labels before adding new ones:

- `Trading`: market data, portfolio review, research, watchlists, and read-only decision support.
- `Productivity`: inbox, meetings, calendars, tasks, and team operating rhythms.
- `Support`: ticket triage, customer response drafting, knowledge-base retrieval, and escalation.
- `Research`: web/document research, evidence tables, and cited briefs.
- `Learning`: study plans, practice tasks, review checkpoints, and source-backed coaching.
- `Writing`: draft editing, source checks, style review, and approval-gated publishing.
- `Developer`: pull requests, CI, incidents, runbooks, and engineering operations.
- `Data`: warehouse analysis, data quality, freshness, and metric diagnostics.

## Current Catalog Highlights

- Trading: `portfolio-review`, `ensemble-risk-review`, `market-briefing`.
- Productivity: `meeting-to-actions`, `inbox-prioritization`.
- Support: `support-ticket-resolution`.
- Research and learning: `research-brief`, `learning-plan-coach`.
- Writing: `content-brief-to-publish`.
- Developer and data: `pr-review-closeout`, `incident-postmortem`, `data-quality-monitor`.

## Source Notes And Credits

The templates in this repository are original AgentHub YAML definitions. We use public product/docs pages and open-source repositories as demand signals and design inspiration; we do not copy large prompt bodies or source code from them.

Research signals used for this expansion include:

- Agentic workflow demand and operating model: [McKinsey on agentic AI](https://www.mckinsey.com/capabilities/quantumblack/our-insights/one-year-of-agentic-ai-six-lessons-from-the-people-doing-the-work), [IBM AI agent use cases](https://www.ibm.com/think/topics/ai-agent-use-cases), [Zapier Agents](https://zapier.com/blog/zapier-agents-guide/), and [Zapier AI](https://zapier.com/ai).
- Research and learning: [OpenAI Deep Research](https://openai.com/index/introducing-deep-research/), [OpenAI Study Mode](https://openai.com/index/chatgpt-study-mode/), [NotebookLM](https://notebooklm.google/), [Khanmigo](https://www.khanmigo.ai/), and [Claude for Education](https://www.anthropic.com/news/introducing-claude-for-education).
- Productivity and support: [Microsoft Copilot agents overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview), [Microsoft Teams recap](https://support.microsoft.com/en-us/teams/meetings/recap-in-microsoft-teams), [Zoom AI Companion meeting summaries](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0058013), [Zendesk AI agents](https://www.zendesk.com/service/ai/ai-agents/), [Intercom Fin](https://fin.ai/), and [Salesforce Agentforce use cases](https://www.salesforce.com/agentforce/use-cases/).
- Developer/data: [GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent), [GitHub Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review), [GitHub Agentic Workflows](https://github.github.com/gh-aw/), [OpenHands](https://github.com/OpenHands/openhands), [SWE-agent](https://swe-agent.com/latest/), [Vanna](https://github.com/vanna-ai/vanna), [WrenAI](https://getwren.ai/oss), and [K8sGPT](https://github.com/k8sgpt-ai/k8sgpt).
- Trading and finance: [Anthropic finance agents](https://www.anthropic.com/news/finance-agents), [SEC EDGAR APIs](https://www.sec.gov/search-filings/edgar-application-programming-interfaces), [OpenBB](https://github.com/OpenBB-finance/OpenBB), [QuantConnect LEAN](https://github.com/QuantConnect/Lean), [Microsoft Qlib](https://github.com/microsoft/qlib), [FinRL](https://github.com/AI4Finance-Foundation/FinRL), [Hummingbot](https://github.com/hummingbot/hummingbot), [Freqtrade](https://github.com/freqtrade/freqtrade), [Riskfolio-Lib](https://github.com/dcajasn/Riskfolio-Lib), and [skfolio](https://github.com/skfolio/skfolio).

Open-source inspiration and license notes:

- Inspired by [Vercel Eve](https://github.com/vercel/eve) and [Vercel Labs Eve Content Agent Template](https://github.com/vercel-labs/eve-content-agent-template) for directory-first agent authoring and approval-oriented content workflows. Eve projects are Apache-2.0 at the time of review.
- Inspired by [openclaw/agent-skills](https://github.com/openclaw/agent-skills) and [OpenClaw Skills docs](https://docs.openclaw.ai/tools/skills) for reusable skill repositories, scope/allowlist thinking, and governance. The `openclaw/agent-skills` repository is MIT at the time of review.
- Inspired by [Nous Research Hermes Agent](https://github.com/NousResearch/hermes-agent) for progressive-disclosure skills, bundled catalogs, and editable user-owned skill directories. Hermes Agent is MIT at the time of review.
- Inspired by [Agent Skills open standard](https://github.com/agentskills/agentskills), [Anthropic skills](https://github.com/anthropics/skills), and [microsoft/skills](https://github.com/microsoft/skills) for portable skill packaging and category organization. Check each upstream repository for per-skill license details before adapting specific text or assets.
- Inspired by curated directories such as [VoltAgent awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) and [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) for marketplace taxonomy and review-before-install warnings. Individual listed skills are not redistributed here.

## Deferred Template Ideas

These are intentionally deferred until the catalog has stronger runtime support or dedicated connector contracts:

- Equity earnings reviewer, quant backtest copilot, options strategy scanner, crypto bot operations, and broker reconciliation.
- Sales prospecting, PMO weekly status, employee onboarding, AP invoice approval, and weekly business analyst.
- Issue-to-PR coding agent, security remediation, docs/runbook keeper, and test coverage agent.
- Language roleplay coach, academic literature review matrix, rubric reviewer, and notebook builder.

## Sync

On merge to `main`, the GitHub Action validates templates, builds `dist/catalog.json`, uploads it as an artifact, and can call an AgentHub sync endpoint when these secrets are configured:

- `AGENTHUB_TEMPLATE_SYNC_URL`
- `AGENTHUB_TEMPLATE_SYNC_TOKEN`
