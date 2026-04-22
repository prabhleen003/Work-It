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
  start:     { label: 'Start Node',      icon: <Play size={14} className="fill-green-600 text-green-600" />,  color: 'text-green-600' },
  task:      { label: 'Task Node',        icon: <ClipboardList size={14} className="text-blue-600" />,         color: 'text-blue-600' },
  approval:  { label: 'Approval Node',    icon: <UserCheck size={14} className="text-amber-600" />,            color: 'text-amber-600' },
  automated: { label: 'Automated Step',   icon: <Zap size={14} className="fill-teal-600 text-teal-600" />,     color: 'text-teal-600' },
  end:       { label: 'End Node',         icon: <StopCircle size={14} className="text-red-600" />,             color: 'text-red-600' },
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
      <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Node Details</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 text-gray-400">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <ClipboardList size={22} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">No node selected</p>
          <p className="text-xs text-gray-400">Click any node on the canvas to edit its properties</p>
        </div>
      </aside>
    );
  }

  const meta = KIND_META[node.data.kind];

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          {meta.icon}
          <h2 className={`text-sm font-semibold ${meta.color}`}>{meta.label}</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <NodeForm node={node} automations={automations} onUpdate={onUpdate} />
      </div>

      <div className="px-4 pb-4 flex-shrink-0">
        <button
          onClick={() => onDelete(node.id)}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
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
      <label className="text-xs font-medium text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = 'w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-800';
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
        <input className={inputClass} value={data.title} onChange={e => patch({ title: e.target.value })} placeholder="e.g. New Employee Onboarding" />
      </Field>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-600">Metadata</label>
          <button onClick={addMeta} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
            <Plus size={11} /> Add
          </button>
        </div>
        {data.metadata.map(m => (
          <div key={m.id} className="flex gap-1.5 items-center">
            <input className={`${inputClass} flex-1`} value={m.key} onChange={e => updateMeta(m.id, 'key', e.target.value)} placeholder="Key" />
            <input className={`${inputClass} flex-1`} value={m.value} onChange={e => updateMeta(m.id, 'value', e.target.value)} placeholder="Value" />
            <button onClick={() => removeMeta(m.id)} className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0">
              <X size={13} />
            </button>
          </div>
        ))}
        {data.metadata.length === 0 && (
          <p className="text-xs text-gray-400 italic">No metadata fields</p>
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
        <input className={inputClass} value={data.title} onChange={e => patch({ title: e.target.value })} placeholder="e.g. Collect Documents" />
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
          <label className="text-xs font-medium text-gray-600">Custom Fields</label>
          <button onClick={addField} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
            <Plus size={11} /> Add Field
          </button>
        </div>
        {data.customFields.map(f => (
          <div key={f.id} className="flex gap-1.5 items-center">
            <input className={`${inputClass} flex-1`} value={f.key} onChange={e => updateField(f.id, 'key', e.target.value)} placeholder="Key" />
            <input className={`${inputClass} flex-1`} value={f.value} onChange={e => updateField(f.id, 'value', e.target.value)} placeholder="Value" />
            <button onClick={() => removeField(f.id)} className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0">
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
          placeholder="e.g. Manager Approval"
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
        <p className="text-xs text-gray-400 mt-0.5">
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
        <p className="text-xs text-blue-500">
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
        <input className={inputClass} value={data.title} onChange={e => patch({ title: e.target.value })} placeholder="e.g. Send Welcome Email" />
      </Field>
      <Field label="Action">
        <select className={inputClass} value={data.actionId} onChange={e => handleActionChange(e.target.value)}>
          <option value="">-- Select an action --</option>
          {automations.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </Field>
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Action Parameters</label>
          {selectedAction.params.map(param => (
            <div key={param}>
              <label className="text-xs text-gray-500 capitalize block mb-0.5">{param}</label>
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
        <input className={inputClass} value={data.endMessage} onChange={e => patch({ endMessage: e.target.value })} placeholder="e.g. Onboarding Complete" />
      </Field>
      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-gray-700">Summary Flag</p>
          <p className="text-xs text-gray-400">Generate a summary report on completion</p>
        </div>
        <button
          onClick={() => patch({ summaryFlag: !data.summaryFlag })}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${data.summaryFlag ? 'bg-blue-600' : 'bg-gray-300'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${data.summaryFlag ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
      </div>
    </>
  );
}
