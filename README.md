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

## Sync

On merge to `main`, the GitHub Action validates templates, builds `dist/catalog.json`, uploads it as an artifact, and can call an AgentHub sync endpoint when these secrets are configured:

- `AGENTHUB_TEMPLATE_SYNC_URL`
- `AGENTHUB_TEMPLATE_SYNC_TOKEN`
