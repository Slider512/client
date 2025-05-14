export interface Task  {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  progress: number;
  assignee?: string;
  updatedAt?:string;
  createdAt:string;
  status?: 'Not Started' | 'In Progress' | 'Completed';
  priority?: 'Low' | 'Medium' | 'High';
  dependencies?: string[];
}