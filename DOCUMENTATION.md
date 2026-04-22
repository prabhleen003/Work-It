<div align="center">

<br/>

```
██████╗  ██████╗  ██████╗███████╗
██╔══██╗██╔═══██╗██╔════╝██╔════╝
██║  ██║██║   ██║██║     ███████╗
██║  ██║██║   ██║██║     ╚════██║
██████╔╝╚██████╔╝╚██████╗███████║
╚═════╝  ╚═════╝  ╚═════╝╚══════╝
```

### *Implementation Reference · Architecture Rationale · Requirement Coverage*

<br/>

![Canvas](https://img.shields.io/badge/Workflow_Canvas-React_Flow-FF0072?style=for-the-badge&logo=react&logoColor=white)
![Typed](https://img.shields.io/badge/Fully_Typed-TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tested](https://img.shields.io/badge/Logic_Tested-Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Mock API](https://img.shields.io/badge/Mock_API-In--Memory-8b5cf6?style=for-the-badge&logoColor=white)
![Zero Backend](https://img.shields.io/badge/Backend-None_Required-1e293b?style=for-the-badge&logoColor=white)

<br/>

> **This document maps every case-study requirement to its exact implementation.**  
> Architecture decisions, design tradeoffs, module responsibilities, and validation strategy — all in one place.

<br/>

</div>

---

## ✦ Purpose

The WorkIt prototype was built to demonstrate:

| Dimension | What Was Evaluated |
|-----------|-------------------|
| **React fundamentals** | Controlled state, composition, lifecycle |
| **Component architecture** | Clear separation of concerns, scalable decomposition |
| **React Flow usage** | Custom nodes, edge handling, canvas interaction |
| **Node configuration** | Type-specific forms, dynamic fields |
| **Mock API integration** | Endpoint-shaped in-memory layer |
| **Validation & simulation** | DAG rules, branch-aware execution |
| **Unit tests** | Pure logic coverage with Vitest |
| **Engineering reasoning** | Decisions made explicit, not just implied |

The implementation treats the workflow designer as a **small system with clear boundaries** — not a single-page UI demo.

<br/>

---

## ✦ Three Concerns, One System

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#0f172a',
    'primaryTextColor': '#f1f5f9',
    'primaryBorderColor': '#6366f1',
    'lineColor': '#818cf8',
    'secondaryColor': '#1e293b',
    'mainBkg': '#1e293b',
    'nodeBorder': '#6366f1',
    'clusterBkg': '#1e293b',
    'titleColor': '#c7d2fe',
    'edgeLabelBackground': '#0f172a',
    'fontFamily': 'monospace',
    'fontSize': '14px'
  }
}}%%
flowchart LR
    A["🎨 Visual\nComposition"]:::c1 <--> B["⚙️ Node\nConfiguration"]:::c2
    B <--> C["🛡️ Validation &\nExecution"]:::c3
    A <--> C

    classDef c1 fill:#1e3a5f,stroke:#38bdf8,color:#bae6fd
    classDef c2 fill:#2d1b4e,stroke:#a78bfa,color:#ddd6fe
    classDef c3 fill:#064e3b,stroke:#34d399,color:#d1fae5
```

Everything flows through a single source of truth — `nodes` and `edges` state in `App.tsx` — while each concern lives in its own focused module.

<br/>

---

## ✦ Requirement 1 — Workflow Canvas

**What was asked for:** drag nodes from a sidebar, connect with edges, select to edit, delete, auto-validate.

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
    SB["🎨 Sidebar\nDrag Source"]:::step --> DZ["🖱️ Canvas\nDrop Zone"]:::canvas
    DZ --> NP["📍 Node\nPlaced"]:::step
    NP --> SEL["🔵 Node\nSelected"]:::step
    SEL --> ED["✏️ Edit in\nDetails Panel"]:::panel
    DZ --> CONN["🔗 Draw\nEdge"]:::step
    CONN --> VAL["⚡ Auto\nValidation"]:::validator

    classDef step fill:#064e3b,stroke:#34d399,color:#d1fae5
    classDef canvas fill:#065f46,stroke:#10b981,color:#d1fae5
    classDef panel fill:#022c22,stroke:#059669,color:#d1fae5
    classDef validator fill:#1a2e1a,stroke:#4ade80,color:#bbf7d0
```

**Where it lives:**

| Responsibility | File |
|----------------|------|
| Sidebar drag source | `components/layout/Sidebar.tsx` |
| Canvas drop handling + edge creation | `components/canvas/WorkflowCanvas.tsx` |
| Selection + deletion | `App.tsx` |
| Auto-validation trigger | `App.tsx` |

**Canvas affordances included:** background grid · controls · minimap · fit-to-view

<br/>

---

## ✦ Requirement 2 — Node Types

**What was asked for:** Start · Task · Approval · Automated Step · End

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
    WF["📐 workflow.ts\nDomain Types"]:::types

    WF --> SN["▶ StartNode\nStartNodeData"]:::start
    WF --> TN["📋 TaskNode\nTaskNodeData"]:::task
    WF --> AN["👔 ApprovalNode\nApprovalNodeData"]:::approval
    WF --> AU["⚡ AutomatedNode\nAutomatedNodeData"]:::auto
    WF --> EN["⏹ EndNode\nEndNodeData"]:::finish

    classDef types fill:#4c1d95,stroke:#a78bfa,color:#ede9fe
    classDef start fill:#312e81,stroke:#818cf8,color:#e0e7ff
    classDef task fill:#1e3a5f,stroke:#38bdf8,color:#bae6fd
    classDef approval fill:#2d1b4e,stroke:#c084fc,color:#f3e8ff
    classDef auto fill:#064e3b,stroke:#34d399,color:#d1fae5
    classDef finish fill:#1c1917,stroke:#a8a29e,color:#f5f5f4
```

Each node type has a **dedicated TypeScript interface**, its own **React Flow renderer**, and its own **editing form section**. This avoids the "one big loosely-typed node object" antipattern and makes future extension straightforward.

**Renderers:**

| Node | Renderer |
|------|----------|
| Start | `components/nodes/StartNode.tsx` |
| Task | `components/nodes/TaskNode.tsx` |
| Approval | `components/nodes/ApprovalNode.tsx` |
| Automated Step | `components/nodes/AutomatedNode.tsx` |
| End | `components/nodes/EndNode.tsx` |
| Default data factory | `components/canvas/defaultNodeData.ts` |

<br/>

---

## ✦ Requirement 3 — Node Editing Forms

**What was asked for:** dedicated editing experience per node type, dynamic fields for automations.

`NodeDetailsPanel` switches its form content based on `node.data.kind`. Every form is a **controlled form** that patches active node state immediately — no submit button, no local form state.

**Field map by node type:**

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#0f172a',
    'primaryTextColor': '#f1f5f9',
    'primaryBorderColor': '#334155',
    'lineColor': '#475569',
    'mainBkg': '#1e293b',
    'nodeBorder': '#334155',
    'clusterBkg': '#0f172a',
    'titleColor': '#94a3b8',
    'edgeLabelBackground': '#0f172a',
    'fontFamily': 'monospace',
    'fontSize': '13px'
  }
}}%%
flowchart LR
    P["🔧 NodeDetailsPanel"]:::panel

    P --> S["▶ Start\n─────────────\ntitle\nmetadata k-v pairs"]:::start
    P --> T["📋 Task\n─────────────\ntitle · description\nassignee · due date\ncustom fields"]:::task
    P --> A["👔 Approval\n─────────────\ntitle · approver role\nauto-approve threshold\ndecision mode"]:::approval
    P --> AU["⚡ Automated\n─────────────\ntitle · action selector\n↳ dynamic params\nfrom API"]:::auto
    P --> E["⏹ End\n─────────────\nend message\nsummary flag"]:::finish

    classDef panel fill:#312e81,stroke:#818cf8,color:#e0e7ff
    classDef start fill:#1e1b4b,stroke:#6366f1,color:#e0e7ff
    classDef task fill:#1e3a5f,stroke:#38bdf8,color:#bae6fd
    classDef approval fill:#2d1b4e,stroke:#c084fc,color:#f3e8ff
    classDef auto fill:#064e3b,stroke:#34d399,color:#d1fae5
    classDef finish fill:#1c1917,stroke:#a8a29e,color:#f5f5f4
```

> **Auto-approve threshold** — a value `> 0` fast-paths the approval node as approved during simulation and follows the approved branch. A value of `0` uses mock manual decision behavior.

**Where it lives:** `components/panels/NodeDetailsPanel.tsx`

<br/>

---

## ✦ Requirement 4 — Mock API Layer

**What was asked for:** `GET /automations` and `POST /simulate`

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#1a0a0a',
    'primaryTextColor': '#fee2e2',
    'primaryBorderColor': '#ef4444',
    'lineColor': '#f87171',
    'secondaryColor': '#2e0a0a',
    'mainBkg': '#1a0a0a',
    'nodeBorder': '#ef4444',
    'clusterBkg': '#2e0a0a',
    'titleColor': '#fca5a5',
    'edgeLabelBackground': '#1a0a0a',
    'fontFamily': 'monospace'
  }
}}%%
flowchart LR
    UI["🖥️ UI Layer\nApp.tsx"]:::ui

    UI -->|"await fetchAutomations()"| AC["🌐 apiClient.ts\nTyped fetch wrapper"]:::client
    UI -->|"await simulate(payload)"| AC

    AC -->|"GET /automations"| MK["🔮 mockApi.ts\nIn-memory router"]:::mock
    AC -->|"POST /simulate"| MK

    MK -->|"automation list"| AC
    MK -->|"execution log"| AC

    AC -->|"AutomationDef[]"| UI
    AC -->|"SimulationResult"| UI

    classDef ui fill:#1e3a5f,stroke:#38bdf8,color:#bae6fd
    classDef client fill:#2d1b4e,stroke:#a78bfa,color:#ddd6fe
    classDef mock fill:#431407,stroke:#f97316,color:#fed7aa
```

**Why two layers?** `apiClient.ts` provides the UI a typed request surface. `mockApi.ts` routes by method + path and returns mocked responses. The UI never calls mock internals directly — it would call the same `apiClient` whether the backend were real or mocked.

All async calls are wrapped with `try` / `catch` / `finally`. Simulation failures surface as **failed sandbox results** — loading state is always cleared, no uncaught promise errors.

**Endpoints:**

| Endpoint | Behavior |
|----------|----------|
| `GET /automations` | Returns `send_email`, `generate_doc` with dynamic parameter definitions |
| `POST /simulate` | Accepts serialized workflow JSON, returns step-by-step execution log |

**Where it lives:** `lib/apiClient.ts` · `lib/mockApi.ts`

<br/>

---

## ✦ Requirement 5 — Sandbox Panel

**What was asked for:** serialize workflow, send to simulation, show results, validate structure.

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
flowchart TD
    SBX["🧪 SandboxPanel"]:::root

    SBX --> J["📄 Workflow JSON\nSerialized payload preview"]:::pane
    SBX --> V["✅ Validation State\nPass · fail · error list"]:::pane
    SBX --> L["📊 Execution Log\nStep · timestamp · status"]:::pane

    L --> OK["✅ Successful\nsimulation steps"]:::ok
    L --> FAIL["❌ Failed\nsimulation response"]:::fail

    classDef root fill:#065f46,stroke:#10b981,color:#d1fae5
    classDef pane fill:#064e3b,stroke:#34d399,color:#d1fae5
    classDef ok fill:#1a2e1a,stroke:#4ade80,color:#bbf7d0
    classDef fail fill:#431407,stroke:#f97316,color:#fed7aa
```

**Where it lives:** `lib/serialization.ts` · `components/panels/SandboxPanel.tsx` · `App.tsx`

<br/>

---

## ✦ Requirement 6 — Validation Strategy

**What was asked for:** auto-validate basic constraints — Start node correctness, graph soundness.

Validation lives in `lib/validation.ts` as **pure domain logic** — not embedded in UI components. This makes it directly unit-testable and UI-agnostic.

It runs **automatically** on workflow changes and is also invoked as a **safety gate** before simulation.

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
    V["🛡️ validation.ts"]:::root

    V --> G["📐 Graph Structure"]:::group
    V --> N["🔧 Node Config"]:::group
    V --> C["🔄 Cycle Check"]:::group

    G --> R1["Exactly one Start node"]:::rule
    G --> R2["At least one End node"]:::rule
    G --> R3["Start has no incoming edges"]:::rule
    G --> R4["Start connects forward"]:::rule
    G --> R5["End has no outgoing edges"]:::rule
    G --> R6["No disconnected nodes"]:::rule

    N --> R7["Required fields present\non all node types"]:::rule
    N --> R8["Approval has both\napproved + rejected branches"]:::rule

    C --> R9["DFS cycle detection\nacross entire graph"]:::rule

    classDef root fill:#4c1d95,stroke:#a78bfa,color:#ede9fe
    classDef group fill:#2e1065,stroke:#7c3aed,color:#ddd6fe
    classDef rule fill:#1e1b4b,stroke:#6366f1,color:#e0e7ff
```

<br/>

---

## ✦ Requirement 7 — Simulation Strategy

The simulation engine walks the graph from the Start node and produces an ordered execution log.

**Approval node behavior:**

| `autoApproveThreshold` | Behavior |
|------------------------|----------|
| `> 0` | Auto-approved; branching follows the `approved` path |
| `= 0` | Mock manual decision; branching randomly picks approved or rejected |

**Step-by-step log output:**

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
    ST["▶ Start\nlog entry point"]:::s --> T["📋 Task\nlog task + assignee"]:::t
    T --> A{"👔 Approval\nlog decision"}:::a
    A -->|"threshold > 0\nauto-approved"| AU["⚡ Automated Step\nlog action"]:::au
    A -->|"threshold = 0\nmock decision"| RW["🔄 Rework\nlog rejection"]:::t
    AU --> E["⏹ End\nlog completion"]:::e
    RW --> E

    classDef s fill:#312e81,stroke:#818cf8,color:#e0e7ff
    classDef t fill:#1e3a5f,stroke:#38bdf8,color:#bae6fd
    classDef a fill:#2d1b4e,stroke:#c084fc,color:#f3e8ff
    classDef au fill:#064e3b,stroke:#34d399,color:#d1fae5
    classDef e fill:#1c1917,stroke:#a8a29e,color:#f5f5f4
```

**Where it lives:** `lib/mockApi.ts`

<br/>

---

## ✦ Requirement 8 — Test Coverage

All core workflow logic has **Vitest unit test** coverage. Tests target pure functions — no component rendering, no DOM.

| Test | File | What It Proves |
|------|------|----------------|
| Valid sample workflow passes | `validation.test.ts` | Happy-path baseline |
| Missing rejected branch detected | `validation.test.ts` | Approval rule enforcement |
| Missing required task assignee | `validation.test.ts` | Field-level validation |
| Cycle detection triggers | `validation.test.ts` | DAG integrity |
| Auto-approved simulation path | `mockApi.test.ts` | Branch-aware execution |
| Missing Start node → simulation fail | `mockApi.test.ts` | Safe failure mode |

```bash
npm test
```

> Validation and simulation are the highest-value logic paths in the prototype. Testing them directly gives confidence that graph rules and sandbox behavior remain stable as the UI evolves.

<br/>

---

## ✦ Architecture — Full Picture

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#0f172a',
    'primaryTextColor': '#f1f5f9',
    'primaryBorderColor': '#6366f1',
    'lineColor': '#818cf8',
    'secondaryColor': '#1e293b',
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
    App["⚙️ App.tsx\nState Orchestration"]:::core

    App --> Canvas["🖼 WorkflowCanvas"]:::ui
    App --> Details["🔧 NodeDetailsPanel"]:::ui
    App --> Sandbox["🧪 SandboxPanel"]:::ui

    Canvas --> Nodes["🔷 Custom Node\nComponents"]:::component
    Details --> Types["📐 workflow.ts\nType System"]:::lib
    Sandbox --> Serial["📦 serialization.ts"]:::lib

    App --> Valid["✅ validation.ts"]:::lib
    App --> ApiC["🌐 apiClient.ts"]:::lib
    ApiC --> Mock["🔮 mockApi.ts"]:::lib
    Mock --> Sim["⚡ Simulation\nEngine"]:::engine

    Tests["🧪 Vitest\nUnit Tests"]:::test --> Valid
    Tests --> Sim
    Sample["📄 sampleWorkflow.ts"]:::data --> App

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

## ✦ Design Tradeoffs

| Decision | Rationale |
|----------|-----------|
| **No backend persistence** | Explicitly out of scope per the brief — effort focused on interaction quality and workflow correctness |
| **No authentication** | Excluded by brief — keeps prototype focused on workflow design |
| **In-memory mock API** | Demonstrates frontend-backend boundary without backend setup complexity |
| **Validation as plain TypeScript** | Easier to evolve and directly unit-test when not embedded in UI components |
| **`dist/` excluded from Git** | Reproducible via `npm run build` — no stale build artifacts in history |
| **Zero `npm audit` vulnerabilities** | Unused deps removed, dev tooling updated |

<br/>

---

## ✦ Scalability Notes

This prototype is intentionally lightweight. The natural next architectural step is extracting orchestration into custom hooks:

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
flowchart LR
    APP["⚙️ App.tsx\ncurrent monolith"]:::current

    APP -.->|"extract"| H1["🪝 useWorkflowDesignerState\nnodes · edges · selection"]:::hook
    APP -.->|"extract"| H2["🪝 useWorkflowValidation\nauto-validate on change"]:::hook
    APP -.->|"extract"| H3["🪝 useWorkflowSimulation\nserialize · call API · parse log"]:::hook

    classDef current fill:#431407,stroke:#f97316,color:#fed7aa
    classDef hook fill:#1e3a5f,stroke:#38bdf8,color:#bae6fd
```

<br/>

---

## ✦ Assumptions

- HR admins are the primary users
- Workflows are modeled as directed acyclic graphs
- Exactly one Start node is the workflow entry point
- One or more End nodes are valid workflow exits
- Approval branching uses explicit `approved` and `rejected` handles

<br/>

---

## ✦ Out of Scope — By Design

> These were intentionally not implemented to stay aligned with the brief.

Authentication · Backend persistence · Database storage · Role-based access control · Audit history · Import / Export

<br/>

---

## ✦ Suggested Next Steps

If extended beyond the assignment:

1. Extract orchestration into `useWorkflowValidation`, `useWorkflowSimulation`, `useWorkflowDesignerState`
2. Add local persistence or backend save / load
3. Richer simulation controls and branch conditions
4. Keyboard accessibility and canvas shortcuts
5. Workflow JSON import / export
6. Component-level interaction tests

<br/>

---

<div align="center">

<br/>

*This document is the companion to [`README.md`](./README.md).*  
*Every section maps directly to a case-study requirement.*

<br/>

![Validation](https://img.shields.io/badge/Validation-DAG_Rules-8b5cf6?style=flat-square)
![Simulation](https://img.shields.io/badge/Simulation-Branch_Aware-10b981?style=flat-square)
![Tests](https://img.shields.io/badge/Tests-Pure_Logic-f97316?style=flat-square)
![API](https://img.shields.io/badge/API-Endpoint_Shaped-6366f1?style=flat-square)

<br/>

</div>
