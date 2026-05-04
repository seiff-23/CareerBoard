export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export type JobStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';
export type JobPriority = 'low' | 'medium' | 'high';

export interface Job {
  _id: string;
  company: string;
  position: string;
  location: string;
  status: JobStatus;
  salary: string;
  url: string;
  notes: string;
  appliedDate: string;
  priority: JobPriority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JobStats {
  wishlist: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}

export interface MonthlyData {
  _id: { year: number; month: number };
  count: number;
}

export interface JobsResponse {
  jobs: Job[];
  stats: JobStats;
  total: number;
  monthly: MonthlyData[];
}

export interface JobFormData {
  company: string;
  position: string;
  location: string;
  status: JobStatus;
  salary: string;
  url: string;
  notes: string;
  appliedDate: string;
  priority: JobPriority;
  tags: string[];
}

export const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  wishlist: {
    label: 'Wishlist',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    dot: 'bg-blue-500',
  },
  applied: {
    label: 'Applied',
    color: 'text-indigo-700 dark:text-indigo-300',
    bg: 'bg-indigo-100 dark:bg-indigo-900/40',
    dot: 'bg-indigo-500',
  },
  interview: {
    label: 'Interview',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    dot: 'bg-amber-500',
  },
  offer: {
    label: 'Offer 🎉',
    color: 'text-green-700 dark:text-green-300',
    bg: 'bg-green-100 dark:bg-green-900/40',
    dot: 'bg-green-500',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-100 dark:bg-red-900/40',
    dot: 'bg-red-500',
  },
};

export const PRIORITY_CONFIG: Record<
  JobPriority,
  { label: string; color: string; bg: string }
> = {
  low: {
    label: 'Low',
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-700',
  },
  medium: {
    label: 'Medium',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
  },
  high: {
    label: 'High',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/30',
  },
};
