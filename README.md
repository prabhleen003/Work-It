<div align="center">

<br/>

```
██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗██╗████████╗
██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝██║╚══██╔══╝
██║ █╗ ██║██║   ██║██████╔╝█████╔╝ ██║   ██║   
██║███╗██║██║   ██║██╔══██╗██╔═██╗ ██║   ██║   
╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗██║   ██║   
 ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   
```

### *Visual HR Workflow Designer · Validator · Sandbox*

<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Flow](https://img.shields.io/badge/React_Flow-FF0072?style=for-the-badge&logo=react&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

<br/>

> **Drag. Connect. Validate. Simulate.**  
> A full-featured canvas for designing internal HR workflows — onboarding, leave approvals, document verification — with real-time validation and a step-by-step execution sandbox.

<br/>

</div>

---

## ✦ What It Does

WorkIt is a React prototype for **visually composing HR workflows** as directed graphs. It combines an interactive canvas, intelligent validation, and a mock simulation engine into a single, cohesive experience — with zero backend required.

<br/>

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#1a1a2e',
    'primaryTextColor': '#e0e0ff',
    'primaryBorderColor': '#7c3aed',
    'lineColor': '#7c3aed',
    'secondaryColor': '#16213e',
    'tertiaryColor': '#0f3460',
    'background': '#0a0a1a',
    'mainBkg': '#1a1a2e',
    'nodeBorder': '#7c3aed',
    'clusterBkg': '#16213e',
    'titleColor': '#e0e0ff',
    'edgeLabelBackground': '#16213e',
    'fontFamily': 'monospace'
  }
}}%%
flowchart LR
    S(["▶ START"]):::start --> T["📋 Collect Documents"]:::task
    T --> A{"👔 Manager\nApproval"}:::approval
    A -->|"✅ Approved"| M["📧 Send Welcome Email"]:::auto
    A -->|"❌ Rejected"| R["🔄 Rework Documents"]:::task
    M --> E(["⏹ END"]):::finish
    R --> E

    classDef start fill:#7c3aed,stroke:#a78bfa,color:#fff,rx:20
    classDef finish fill:#0f3460,stroke:#60a5fa,color:#fff,rx:20
    classDef task fill:#1e3a5f,stroke:#38bdf8,color:#e0e0ff
    classDef approval fill:#2d1b4e,stroke:#a78bfa,color:#e0e0ff
    classDef auto fill:#0d3d2e,stroke:#34d399,color:#e0e0ff
```

<br/>

---

## ✦ Node Types

| Node | Icon | Purpose |
|------|------|---------|
| **Start** | `▶` | Entry point — title & metadata key-values |
| **Task** | `📋` | Human task — assignee, due date, custom fields |
| **Approval** | `👔` | Decision gate — approver role, auto-approve threshold, branching |
| **Automated Step** | `⚡` | System action — driven by mock automation API |
| **End** | `⏹` | Terminal node — summary message & flag |

<br/>

---

## ✦ Architecture

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#0f172a',
    'primaryTextColor': '#f1f5f9',
    'primaryBorderColor': '#6366f1',
    'lineColor': '#818cf8',
    'secondaryColor': '#1e293b',
    'tertiaryColor': '#0f172a',
    'mainBkg': '#1e293b',
    'nodeBorder': '#6366f1',
    'clusterBkg': '#1e293b',
    'titleColor': '#c7d2fe',
    'edgeLabelBackground': '#0f172a',
    'fontFamily': 'monospace',
    'fontSize': '13px'
  }
}}%%
flowchart TD
    App["⚙️  App.tsx\nState Orchestration"]:::core

    App --> Canvas["🖼  WorkflowCanvas"]:::ui
    App --> Details["🔧  NodeDetailsPanel"]:::ui
    App --> Sandbox["🧪  SandboxPanel"]:::ui

    Canvas --> Nodes["🔷  Custom Node\nComponents"]:::component
    Details --> Types["📐  workflow.ts\nType System"]:::lib
    Sandbox --> Serial["📦  serialization.ts"]:::lib

    App --> Valid["✅  validation.ts"]:::lib
    App --> ApiC["🌐  apiClient.ts"]:::lib
    ApiC --> Mock["🔮  mockApi.ts"]:::lib
    Mock --> Sim["⚡  Simulation\nEngine"]:::engine

    Tests["🧪  Vitest\nUnit Tests"]:::test --> Valid
    Tests --> Sim
    Sample["📄  sampleWorkflow.ts"]:::data --> App

    classDef core fill:#312e81,stroke:#818cf8,color:#e0e7ff
    classDef ui fill:#1e3a5f,stroke:#38bdf8,color:#e0f2fe
    classDef component fill:#164e63,stroke:#22d3ee,color:#e0f2fe
    classDef lib fill:#1a2e1a,stroke:#4ade80,color:#dcfce7
    classDef engine fill:#2d1b4e,stroke:#c084fc,color:#f3e8ff
    classDef test fill:#431407,stroke:#fb923c,color:#ffedd5
    classDef data fill:#1c1917,stroke:#a8a29e,color:#f5f5f4
```

<br/>

---

## ✦ Data Flow

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#0c1a0c',
    'primaryTextColor': '#d1fae5',
    'primaryBorderColor': '#10b981',
    'lineColor': '#34d399',
    'secondaryColor': '#052e16',
    'mainBkg': '#0c1a0c',
    'nodeBorder': '#10b981',
    'clusterBkg': '#052e16',
    'titleColor': '#6ee7b7',
    'edgeLabelBackground': '#052e16',
    'fontFamily': 'monospace'
  }
}}%%
flowchart LR
    A["🎨 Sidebar\nNode Palette"]:::step --> B["🖼 React Flow\nCanvas"]:::canvas
    B --> C["🖱 Select\nNode"]:::step
    C --> D["🔧 Node Details\nPanel"]:::panel
    D --> E["✏️ Update\nNode Data"]:::step
    E --> B

    B --> F["⚡ Auto\nValidation"]:::validator
    F --> G["📋 Sandbox\nValidation View"]:::panel

    B --> H["📦 Serialize\nWorkflow"]:::step
    H --> I["🌐 POST\n/simulate"]:::api
    I --> J["📊 Execution\nLog"]:::panel

    classDef step fill:#064e3b,stroke:#34d399,color:#d1fae5
    classDef canvas fill:#065f46,stroke:#10b981,color:#d1fae5
    classDef panel fill:#022c22,stroke:#059669,color:#d1fae5
    classDef validator fill:#1a2e1a,stroke:#4ade80,color:#bbf7d0
    classDef api fill:#0c2340,stroke:#38bdf8,color:#bae6fd
```

<br/>

---

## ✦ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open the Vite local URL shown in your terminal.

<br/>

### All Scripts

```bash
npm run dev        # → start dev server with HMR
npm run build      # → production build → dist/
npm run preview    # → preview production build locally
npm run lint       # → ESLint
npm run typecheck  # → tsc --noEmit
npm test           # → Vitest unit tests
```

<br/>

---

## ✦ Folder Structure

```
src/
├── components/
│   ├── canvas/          ← React Flow canvas + edge config
│   ├── layout/          ← Shell, sidebar, toolbar
│   ├── nodes/           ← Custom node renderers (5 types)
│   └── panels/          ← NodeDetailsPanel + SandboxPanel
├── data/
│   └── sampleWorkflow.ts
├── lib/
│   ├── apiClient.ts     ← Typed fetch wrapper
│   ├── mockApi.ts       ← In-memory GET /automations + POST /simulate
│   ├── mockApi.test.ts
│   ├── serialization.ts ← Graph → wire format
│   ├── validation.ts    ← DAG rules + field checks
│   └── validation.test.ts
├── types/
│   └── workflow.ts      ← All node/edge interfaces
├── App.tsx              ← State orchestration root
└── main.tsx
```

<br/>

---

## ✦ Core Design Choices

**Typed node data model** — Each node type carries a dedicated TypeScript interface. Forms, validation, and rendering all derive from the same source of truth.

**Separation of concerns** — Canvas logic, node rendering, editing UX, and business logic live in distinct layers with no cross-cutting dependencies.

**Endpoint-shaped mock API** — The app speaks to a lightweight API client with `GET /automations` and `POST /simulate`, keeping the mock layer close to a real backend contract.

**Safety-first validation** — The validator checks start/end presence, directionality, disconnected nodes, missing required fields, approval branch completeness, and cycle detection.

**Auto-approve threshold** — Approval nodes with a threshold `> 0` are fast-pathed as approved during simulation. A threshold of `0` uses mock decision behavior.

<br/>

---

## ✦ Validation Rules

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#1a0a2e',
    'primaryTextColor': '#ede9fe',
    'primaryBorderColor': '#8b5cf6',
    'lineColor': '#a78bfa',
    'secondaryColor': '#2e1065',
    'mainBkg': '#1a0a2e',
    'nodeBorder': '#8b5cf6',
    'clusterBkg': '#2e1065',
    'titleColor': '#c4b5fd',
    'edgeLabelBackground': '#1a0a2e',
    'fontFamily': 'monospace'
  }
}}%%
flowchart TD
    V["🛡️ Validator"]:::root

    V --> R1["✅ Single Start Node\npresent & unique"]:::rule
    V --> R2["✅ End Node\npresent"]:::rule
    V --> R3["✅ Start has no\nincoming edges"]:::rule
    V --> R4["✅ End has no\noutgoing edges"]:::rule
    V --> R5["✅ No disconnected\nnodes"]:::rule
    V --> R6["✅ Required fields\nfilled on all nodes"]:::rule
    V --> R7["✅ Approval nodes have\nboth branch edges"]:::rule
    V --> R8["✅ No cycles\nin the graph"]:::rule

    classDef root fill:#4c1d95,stroke:#a78bfa,color:#ede9fe
    classDef rule fill:#1e1b4b,stroke:#6366f1,color:#e0e7ff
```

<br/>

---

## ✦ Unit Test Coverage

| Test Case | File |
|-----------|------|
| Valid sample workflow passes | `validation.test.ts` |
| Missing approval branch detected | `validation.test.ts` |
| Missing required task fields flagged | `validation.test.ts` |
| Cycle detection triggers | `validation.test.ts` |
| Auto-approved simulation path | `mockApi.test.ts` |
| Missing Start node simulation failure | `mockApi.test.ts` |

```bash
npm test
```

<br/>

---

## ✦ Mock API Contract

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/automations` | `GET` | Returns available automation action definitions |
| `/simulate` | `POST` | Accepts serialized workflow, returns execution log |

All async calls are wrapped with `try` / `catch` / `finally`. Simulation failures surface as failed sandbox results; loading state is always cleared.

<br/>

---

## ✦ Assumptions & Scope

- **No authentication** — per the case-study brief
- **No backend persistence** — workflows live in client state only
- **Deterministic structure, mocked execution** — simulation follows graph topology faithfully
- **`dist/` excluded from Git** — reproducible via `npm run build`

<br/>

---

## ✦ Roadmap

- [ ] Local / backend workflow persistence
- [ ] Undo / redo history stack
- [ ] Workflow JSON import & export
- [ ] Richer branch conditions beyond approval outcomes
- [ ] Component interaction & accessibility test coverage
- [ ] Custom hooks for workflow orchestration

<br/>

---

<div align="center">

<br/>

*Built with precision for the Tredence Analytics Full Stack Engineering Intern case study.*  
*Companion doc: [`DOCUMENTATION.md`](./DOCUMENTATION.md) — requirement-by-requirement implementation mapping.*

<br/>

![Built with React](https://img.shields.io/badge/Built_with-React_Flow-FF0072?style=flat-square&logo=react)
![Tests](https://img.shields.io/badge/Tests-Vitest-6E9F18?style=flat-square)
![Zero Backend](https://img.shields.io/badge/Backend-None_Required-gray?style=flat-square)

<br/>

</div>
