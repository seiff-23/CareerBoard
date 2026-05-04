import type { Job, JobStatus } from '../types';
import { STATUS_CONFIG } from '../types';
import JobCard from './JobCard';

interface Props {
  status: JobStatus;
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
}

export default function KanbanColumn({ status, jobs, onEdit, onDelete, onStatusChange }: Props) {
  const config = STATUS_CONFIG[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    if (jobId) onStatusChange(jobId, status);
  };

  const handleDragStart = (e: React.DragEvent, jobId: string) => {
    e.dataTransfer.setData('jobId', jobId);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="flex flex-col w-72 shrink-0 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
              {config.label}
            </h3>
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
            {jobs.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[200px] max-h-[calc(100vh-280px)]">
        {jobs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2 opacity-50">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Drop cards here</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              draggable
              onDragStart={(e) => handleDragStart(e, job._id)}
              className="cursor-grab active:cursor-grabbing"
            >
              <JobCard job={job} onEdit={onEdit} onDelete={onDelete} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
