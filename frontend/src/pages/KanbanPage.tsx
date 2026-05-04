import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useJobs } from '../hooks/useJobs';
import KanbanColumn from '../components/KanbanColumn';
import JobFormModal from '../components/JobFormModal';
import type { Job, JobFormData, JobStatus } from '../types';

const STATUSES: JobStatus[] = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];

export default function KanbanPage() {
  const { data, loading, fetchJobs, createJob, updateJob, deleteJob } = useJobs();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCreate = async (form: Partial<JobFormData>) => {
    const newJob = await createJob(form);
    if (newJob) fetchJobs();
  };

  const handleUpdate = async (form: Partial<JobFormData>) => {
    if (!editingJob) return;
    const updated = await updateJob(editingJob._id, form as Partial<Job>);
    if (updated) fetchJobs();
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteJob(id);
    if (ok) fetchJobs();
  };

  const handleStatusChange = useCallback(
    async (jobId: string, newStatus: JobStatus) => {
      const job = data?.jobs.find((j) => j._id === jobId);
      if (!job || job.status === newStatus) return;
      // Optimistic update via refetch after server update
      const updated = await updateJob(jobId, { status: newStatus });
      if (updated) fetchJobs();
    },
    [data, updateJob, fetchJobs]
  );

  const openEdit = (job: Job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingJob(null);
  };

  const jobs = data?.jobs ?? [];
  const total = jobs.length;

  // Group jobs by status
  const jobsByStatus = STATUSES.reduce<Record<JobStatus, Job[]>>(
    (acc, s) => ({ ...acc, [s]: jobs.filter((j) => j.status === s) }),
    {} as Record<JobStatus, Job[]>
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Drag & drop cards to update their status · {total} application{total !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Application
        </button>
      </div>

      {/* Drag hint */}
      <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg w-fit text-xs text-indigo-600 dark:text-indigo-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
        Drag cards between columns to update status instantly
      </div>

      {/* Board */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                jobs={jobsByStatus[status]}
                onEdit={openEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && total === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your board is empty</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Add applications and organise them visually with drag & drop.
          </p>
          <button onClick={() => setModalOpen(true)} className="btn-primary mx-auto">
            Add Your First Application
          </button>
        </div>
      )}

      <JobFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={editingJob ? handleUpdate : handleCreate}
        editJob={editingJob}
      />
    </div>
  );
}
