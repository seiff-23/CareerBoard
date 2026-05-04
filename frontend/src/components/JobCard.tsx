import { format } from 'date-fns';
import type { Job } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../types';

interface Props {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export default function JobCard({ job, onEdit, onDelete }: Props) {
  const status = STATUS_CONFIG[job.status];
  const priority = PRIORITY_CONFIG[job.priority];

  return (
    <div className="card p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-base">
            {job.position}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{job.company}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
          <button
            onClick={() => onEdit(job)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this application?')) onDelete(job._id);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Status + Priority badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
          {priority.label}
        </span>
      </div>

      {/* Meta info */}
      <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
        {job.location && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{job.location}</span>
          </div>
        )}
        {job.salary && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{job.salary}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{format(new Date(job.appliedDate), 'MMM dd, yyyy')}</span>
        </div>
      </div>

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="px-2 py-0.5 text-gray-400 dark:text-gray-500 text-xs">
              +{job.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* URL link */}
      {job.url && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View job posting
          </a>
        </div>
      )}
    </div>
  );
}
