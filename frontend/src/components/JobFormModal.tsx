import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { Job, JobFormData, JobPriority, JobStatus } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<JobFormData>) => Promise<void>;
  editJob?: Job | null;
}

const defaultForm: JobFormData = {
  company: '',
  position: '',
  location: '',
  status: 'applied',
  salary: '',
  url: '',
  notes: '',
  appliedDate: format(new Date(), 'yyyy-MM-dd'),
  priority: 'medium',
  tags: [],
};

export default function JobFormModal({ isOpen, onClose, onSubmit, editJob }: Props) {
  const [form, setForm] = useState<JobFormData>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editJob) {
      setForm({
        company: editJob.company,
        position: editJob.position,
        location: editJob.location,
        status: editJob.status,
        salary: editJob.salary,
        url: editJob.url,
        notes: editJob.notes,
        appliedDate: format(new Date(editJob.appliedDate), 'yyyy-MM-dd'),
        priority: editJob.priority,
        tags: editJob.tags || [],
      });
    } else {
      setForm(defaultForm);
    }
    setTagInput('');
  }, [editJob, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-up border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {editJob ? '✏️ Edit Application' : '➕ New Application'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Company + Position */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Company *</label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Google"
                  required
                />
              </div>
              <div>
                <label className="label">Position *</label>
                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Senior Frontend Dev"
                  required
                />
              </div>
            </div>

            {/* Location + Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Remote / Paris, France"
                />
              </div>
              <div>
                <label className="label">Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="€45k - €55k"
                />
              </div>
            </div>

            {/* Status + Priority + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="input-field">
                  <option value="wishlist">Wishlist</option>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="label">Applied Date</label>
                <input
                  type="date"
                  name="appliedDate"
                  value={form.appliedDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Job URL */}
            <div>
              <label className="label">Job URL</label>
              <input
                type="url"
                name="url"
                value={form.url}
                onChange={handleChange}
                className="input-field"
                placeholder="https://..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="label">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="input-field flex-1"
                  placeholder="react, remote, startup..."
                />
                <button type="button" onClick={addTag} className="btn-secondary px-3">
                  Add
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-indigo-900 dark:hover:text-white ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="label">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Interview notes, contacts, next steps..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : editJob ? (
                  'Save Changes'
                ) : (
                  'Add Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
