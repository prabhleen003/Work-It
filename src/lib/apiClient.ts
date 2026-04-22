import { handleMockRequest } from './mockApi';
import type { AutomationAction, SimulationResult, WorkflowJSON } from '../types/workflow';

/**
 * Facade pattern: Centralized API client with typed methods.
 * Currently uses mock API; can be replaced with real endpoints.
 */
export const apiClient = {
  get(path: '/automations'): Promise<AutomationAction[]> {
    return handleMockRequest({ method: 'GET', path });
  },

  post(path: '/simulate', body: WorkflowJSON): Promise<SimulationResult> {
    return handleMockRequest({ method: 'POST', path, body });
  },
};
