/**
 * Типы группировки задач
 */
export type GroupByOption = 
  | 'none'      // Без группировки
  | 'status'    // По статусу
  | 'assignee'  // По исполнителю
  | 'priority'  // По приоритету
  | 'project';  // По проекту

/**
 * Интерфейс опции группировки
 */
export interface GroupByOptionItem {
  value: GroupByOption;
  label: string;
  icon: React.ReactNode;
}

/**
 * Доступные опции группировки
 */
/*
export const groupByOptions: GroupByOptionItem[] = [
  { 
    value: 'none', 
    label: 'No Grouping', 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor"/>
    </svg>
  },
  { 
    value: 'status', 
    label: 'By Status', 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 13H10V11H4V13ZM4 17H10V15H4V17ZM4 9H10V7H4V9ZM14 7V9H20V7H14ZM14 11V13H20V11H14ZM14 15V17H20V15H14Z" fill="currentColor"/>
    </svg>
  },
  { 
    value: 'assignee', 
    label: 'By Assignee', 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
    </svg>
  },
  { 
    value: 'priority', 
    label: 'By Priority', 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 10H19V12H14V10ZM14 6H19V8H14V6ZM14 14H19V16H14V14ZM4 16H12V14H4V16ZM4 10H12V8H4V10ZM4 4H12V2H4V4Z" fill="currentColor"/>
    </svg>
  }
];*/