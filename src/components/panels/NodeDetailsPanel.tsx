import { useState, useEffect } from 'react';
import {
  Play, ClipboardList, UserCheck, Zap, StopCircle, X, Trash2, Plus,
} from 'lucide-react';
import type {
  WorkflowNode, WorkflowNodeData, StartNodeData, TaskNodeData,
  ApprovalNodeData, AutomatedNodeData, EndNodeData, AutomationAction, KVPair,
} from '../../types/workflow';

interface Props {
  node: WorkflowNode | null;
  automations: AutomationAction[];
  onUpdate: (id: string, data: WorkflowNodeData) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

// Metadata for node type display (icon, label, color coding)
const KIND_META = {
  start:     { label: 'Start Node', icon: <Play size={14} className="fill-emerald-700 text-emerald-700 dark:fill-emerald-300 dark:text-emerald-300" />, color: 'text-emerald-700 dark:text-emerald-300', badge: 'border-emerald-100 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/45' },
  task:      { label: 'Task Node', icon: <ClipboardList size={14} className="text-indigo-700 dark:text-indigo-300" />, color: 'text-indigo-700 dark:text-indigo-300', badge: 'border-indigo-100 bg-indigo-50 dark:border-indigo-900/60 dark:bg-indigo-950/45' },
  approval:  { label: 'Approval Node', icon: <UserCheck size={14} className="text-amber-700 dark:text-amber-300" />, color: 'text-amber-700 dark:text-amber-300', badge: 'border-amber-100 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/45' },
  automated: { label: 'Automated Step', icon: <Zap size={14} className="fill-teal-700 text-teal-700 dark:fill-teal-300 dark:text-teal-300" />, color: 'text-teal-700 dark:text-teal-300', badge: 'border-teal-100 bg-teal-50 dark:border-teal-900/60 dark:bg-teal-950/45' },
  end:       { label: 'End Node', icon: <StopCircle size={14} className="text-rose-700 dark:text-rose-300" />, color: 'text-rose-700 dark:text-rose-300', badge: 'border-rose-100 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/45' },
};

function newKV(): KVPair {
  return { id: `kv_${Date.now()}_${Math.random()}`, key: '', value: '' };
}

/**
 * Right-side panel: Node property editor.
 * Displays form fields specific to selected node type and enables dynamic property updates.
 */
export default function NodeDetailsPanel({ node, automations, onUpdate, onDelete, onClose }: Props) {
  if (!node) {
    return (
      <aside className="flex w-80 flex-col border-l border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#fbfbfc] px-4 py-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Node Details</h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-slate-400 dark:text-slate-500">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <ClipboardList size={22} className="text-slate-300 dark:text-slate-500" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-300">No node selected</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Click any node on the canvas to edit its properties</p>
        </div>
      </aside>
    );
  }

  const meta = KIND_META[node.data.kind];

  return (
    <aside className="flex w-80 flex-col overflow-hidden border-l border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 bg-[#fbfbfc] px-4 py-3.5 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${meta.badge}`}>
            {meta.icon}
          </div>
          <h2 className={`text-sm font-semibold ${meta.color}`}>{meta.label}</h2>
        </div>
        <button onClick={onClose} className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200">
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <NodeForm node={node} automations={automations} onUpdate={onUpdate} />
      </div>

      <div className="flex-shrink-0 px-4 pb-4">
        <button
          onClick={() => onDelete(node.id)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-rose-200 py-2 text-sm font-medium text-rose-700 shadow-sm transition-colors hover:bg-rose-50 dark:border-rose-900/70 dark:text-rose-300 dark:hover:bg-rose-950/40"
        >
          <Trash2 size={14} />
          Delete Node
        </button>
      </div>
    </aside>
  );
}

function NodeForm({ node, automations, onUpdate }: Omit<Props, 'onClose' | 'onDelete'> & { node: WorkflowNode }) {
  const [data, setData] = useState<WorkflowNodeData>(node.data);

  useEffect(() => {
    setData(node.data);
  }, [node.id, node.data]);

  function patch(partial: Partial<WorkflowNodeData>) {
    const next = { ...data, ...partial } as WorkflowNodeData;
    setData(next);
    onUpdate(node.id, next);
  }

  switch (data.kind) {
    case 'start': return <StartForm data={data} patch={(p) => patch(p as Partial<StartNodeData>)} />;
    case 'task': return <TaskForm data={data} patch={(p) => patch(p as Partial<TaskNodeData>)} />;
    case 'approval': return <ApprovalForm data={data} patch={(p) => patch(p as Partial<ApprovalNodeData>)} />;
    case 'automated': return <AutomatedForm data={data} automations={automations} patch={(p) => patch(p as Partial<AutomatedNodeData>)} />;
    case 'end': return <EndForm data={data} patch={(p) => patch(p as Partial<EndNodeData>)} />;
  }
}

// ---- Form field helpers ----
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {label} {required && <span className="text-rose-500 dark:text-rose-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500';
const textareaClass = `${inputClass} resize-none`;

// ---- Start Form ----
function StartForm({ data, patch }: { data: StartNodeData; patch: (p: Partial<StartNodeData>) => void }) {
  function addMeta() { patch({ metadata: [...data.metadata, newKV()] }); }
  function removeMeta(id: string) { patch({ metadata: data.metadata.filter(m => m.id !== id) }); }
  function updateMeta(id: string, field: 'key' | 'value', val: string) {
    patch({ metadata: data.metadata.map(m => m.id === id ? { ...m, [field]: val } : m) });
  }

  return (
    <>
      <Field label="Start Title" required>
        <input className={inputClass} value={data.title} onChange={e => patch({ title: e.target.value })} placeholder="e.g. Candidate Offer Approval" />
      </Field>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Metadata</label>
          <button onClick={addMeta} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200">
            <Plus size={11} /> Add
          </button>
        </div>
        {data.metadata.map(m => (
          <div key={m.id} className="flex gap-1.5 items-center">
            <input className={`${inputClass} flex-1`} value={m.key} onChange={e => updateMeta(m.id, 'key', e.target.value)} placeholder="Key" />
            <input className={`${inputClass} flex-1`} value={m.value} onChange={e => updateMeta(m.id, 'value', e.target.value)} placeholder="Value" />
            <button onClick={() => removeMeta(m.id)} className="flex-shrink-0 p-1 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-300">
              <X size={13} />
            </button>
          </div>
        ))}
        {data.metadata.length === 0 && (
          <p className="text-xs italic text-slate-400 dark:text-slate-500">No metadata fields</p>
        )}
      </div>
    </>
  );
}

// ---- Task Form ----
function TaskForm({ data, patch }: { data: TaskNodeData; patch: (p: Partial<TaskNodeData>) => void }) {
  function addField() { patch({ customFields: [...data.customFields, newKV()] }); }
  function removeField(id: string) { patch({ customFields: data.customFields.filter(f => f.id !== id) }); }
  function updateField(id: string, field: 'key' | 'value', val: string) {
    patch({ customFields: data.customFields.map(f => f.id === id ? { ...f, [field]: val } : f) });
  }

  return (
    <>
      <Field label="Title" required>
        <input className={inputClass} value={data.title} onChange={e => patch({ title: e.target.value })} placeholder="e.g. Draft Offer Package" />
      </Field>
      <Field label="Description">
        <textarea className={textareaClass} rows={3} value={data.description} onChange={e => patch({ description: e.target.value })} placeholder="Describe the task..." />
      </Field>
      <Field label="Assignee">
        <input className={inputClass} value={data.assignee} onChange={e => patch({ assignee: e.target.value })} placeholder="e.g. HR Executive" />
      </Field>
      <Field label="Due Date">
        <input className={inputClass} type="date" value={data.dueDate} onChange={e => patch({ dueDate: e.target.value })} />
      </Field>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Custom Fields</label>
          <button onClick={addField} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200">
            <Plus size={11} /> Add Field
          </button>
        </div>
        {data.customFields.map(f => (
          <div key={f.id} className="flex gap-1.5 items-center">
            <input className={`${inputClass} flex-1`} value={f.key} onChange={e => updateField(f.id, 'key', e.target.value)} placeholder="Key" />
            <input className={`${inputClass} flex-1`} value={f.value} onChange={e => updateField(f.id, 'value', e.target.value)} placeholder="Value" />
            <button onClick={() => removeField(f.id)} className="flex-shrink-0 p-1 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-300">
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// ---- Approval Form ----
function ApprovalForm({ data, patch }: { data: ApprovalNodeData; patch: (p: Partial<ApprovalNodeData>) => void }) {
  const ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'C-Suite'];

  return (
    <>
      <Field label="Title" required>
        <input
          className={inputClass}
          value={data.title}
          onChange={e => patch({ title: e.target.value })}
          placeholder="e.g. Compensation Approval"
        />
      </Field>

      <Field label="Approver Role" required>
        <input
          className={inputClass}
          value={data.approverRole}
          onChange={e => patch({ approverRole: e.target.value })}
          placeholder="e.g. Manager, HRBP, Director"
          list="approval-role-suggestions"
        />
        <datalist id="approval-role-suggestions">
          {ROLES.map((role) => (
            <option key={role} value={role} />
          ))}
        </datalist>
      </Field>

      <Field label="Auto-approve Threshold (hours)">
        <input
          className={inputClass}
          type="number"
          min={0}
          value={data.autoApproveThreshold}
          onChange={e => patch({ autoApproveThreshold: Number(e.target.value) })}
          placeholder="0 = disabled"
        />
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
          Automatically approve after this many pending hours. 0 = disabled.
        </p>
      </Field>

      <Field label="Decision Mode">
        <select
          className={inputClass}
          value={data.decisionMode ?? 'single'}
          onChange={(e) =>
            patch({ decisionMode: e.target.value as 'single' | 'approved_rejected' })
          }
        >
          <option value="single">Single Path</option>
          <option value="approved_rejected">Approved / Rejected (Branching)</option>
        </select>
      </Field>

      {data.decisionMode === 'approved_rejected' && (
        <p className="text-xs text-indigo-600 dark:text-indigo-300">
          This node will create two paths: Approved and Rejected
        </p>
      )}
    </>
  );
}

// ---- Automated Form ----
function AutomatedForm({ data, automations, patch }: { data: AutomatedNodeData; automations: AutomationAction[]; patch: (p: Partial<AutomatedNodeData>) => void }) {
  const selectedAction = automations.find(a => a.id === data.actionId);

  function handleActionChange(actionId: string) {
    const action = automations.find(a => a.id === actionId);
    const params: Record<string, string> = {};
    if (action) action.params.forEach(p => { params[p] = data.actionParams[p] ?? ''; });
    patch({ actionId, actionParams: params });
  }

  function updateParam(key: string, value: string) {
    patch({ actionParams: { ...data.actionParams, [key]: value } });
  }

  return (
    <>
      <Field label="Title">
        <input className={inputClass} value={data.title} onChange={e => patch({ title: e.target.value })} placeholder="e.g. Generate Offer Letter" />
      </Field>
      <Field label="Action">
        <select className={inputClass} value={data.actionId} onChange={e => handleActionChange(e.target.value)}>
          <option value="">-- Select an action --</option>
          {automations.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </Field>
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Action Parameters</label>
          {selectedAction.params.map(param => (
            <div key={param}>
              <label className="mb-0.5 block text-xs capitalize text-slate-500 dark:text-slate-400">{param}</label>
              <input
                className={inputClass}
                value={data.actionParams[param] ?? ''}
                onChange={e => updateParam(param, e.target.value)}
                placeholder={`Enter ${param}...`}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ---- End Form ----
function EndForm({ data, patch }: { data: EndNodeData; patch: (p: Partial<EndNodeData>) => void }) {
  return (
    <>
      <Field label="End Message">
        <input className={inputClass} value={data.endMessage} onChange={e => patch({ endMessage: e.target.value })} placeholder="e.g. Offer Workflow Closed" />
      </Field>
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/80">
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Summary Flag</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Generate a summary report on completion</p>
        </div>
        <button
          onClick={() => patch({ summaryFlag: !data.summaryFlag })}
          className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${data.summaryFlag ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm dark:bg-slate-200 ${data.summaryFlag ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </>
  );
}
