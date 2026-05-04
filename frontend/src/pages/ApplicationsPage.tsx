import { useEffect, useState, useCallback } from 'react';
import { useJobs } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import JobFormModal from '../components/JobFormModal';
import type { Job, JobFormData, JobStatus } from '../types';

const STATUSES: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

const PRIORITIES = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const SORTS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt', label: 'Oldest first' },
  { value: '-appliedDate', label: 'Applied date (desc)' },
  { value: 'company', label: 'Company (A-Z)' },
];

export default function ApplicationsPage() {
  const { data, loading, error, fetchJobs, createJob, updateJob, deleteJob } = useJobs();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sort, setSort] = useState('-createdAt');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(() => {
    const params: Record<string, string> = { sort };
    if (status !== 'all') params.status = status;
    if (priority !== 'all') params.priority = priority;
    if (debouncedSearch) params.search = debouncedSearch;
    fetchJobs(params);
  }, [fetchJobs, sort, status, priority, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (form: Partial<JobFormData>) => {
    const newJob = await createJob(form);
    if (newJob) load();
  };

  const handleUpdate = async (form: Partial<JobFormData>) => {
    if (!editingJob) return;
    const updated = await updateJob(editingJob._id, form as Partial<Job>);
    if (updated) load();
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteJob(id);
    if (ok) load();
  };

  const openEdit = (job: Job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingJob(null);
  };

  const jobs = data?.jobs ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {jobs.length} result{jobs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Application
        </button>
      </div>

      {/* Filters bar */}
      <div className="card p-4 flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, position..."
            className="input-field pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                status === s.value
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="input-field w-auto text-sm"
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field w-auto text-sm"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {error ? (
        <div className="card p-8 text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button onClick={load} className="btn-secondary mt-4 mx-auto">Retry</button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
              <div className="flex gap-2 mb-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-14" />
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No applications found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {search || status !== 'all' ? 'Try adjusting your filters.' : 'Add your first application to get started.'}
          </p>
          {!search && status === 'all' && (
            <button onClick={() => setModalOpen(true)} className="btn-primary mt-4 mx-auto">
              Add Application
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onEdit={openEdit} onDelete={handleDelete} />
          ))}
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
