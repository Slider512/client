import { format, parseISO, differenceInDays, addDays } from 'date-fns';

export const formatDate = (dateString: string, formatStr = 'yyyy-MM-dd') => {
  return format(parseISO(dateString), formatStr);
};

export const calculateDuration = (startDate: string, endDate: string) => {
  return differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
};

export const generateDateRange = (startDate: Date, days: number) => {
  return Array.from({ length: days }, (_, i) => addDays(startDate, i));
};

export const isWeekend = (date: Date) => {
  return date.getDay() === 0 || date.getDay() === 6;
};