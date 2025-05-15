import {Task} from './Task'
export * from './GroupByOption'
export * from './Task'
export * from './Dependency'


export interface ExportOptions {
    includeDependencies?: boolean;
    fileName?: string;
    formatOptions?: {
      pdf?: {
        orientation?: 'portrait' | 'landscape';
      };
      excel?: {
        includeStyles?: boolean;
      };
    };
  }

  export interface TaskApiResponse {
    data: Task[];
    total: number;
    page: number;
    limit: number;
  }
  
  export interface TaskUpdatePayload {
    id: string;
    changes: Partial<Omit<Task, 'id'>>;
  }