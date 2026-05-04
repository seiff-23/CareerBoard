import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { jobsAPI } from '../services/api';
import type { Job, JobFormData, JobsResponse } from '../types';

export function useJobs() {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (params?: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobsAPI.getAll(params);
      setData(res.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to load applications.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createJob = useCallback(async (formData: Partial<JobFormData>): Promise<Job | null> => {
    try {
      const res = await jobsAPI.create(formData);
      toast.success('Application added!');
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add application.');
      return null;
    }
  }, []);

  const updateJob = useCallback(async (id: string, updates: Partial<Job>): Promise<Job | null> => {
    try {
      const res = await jobsAPI.update(id, updates);
      toast.success('Application updated!');
      return res.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update application.');
      return null;
    }
  }, []);

  const deleteJob = useCallback(async (id: string): Promise<boolean> => {
    try {
      await jobsAPI.remove(id);
      toast.success('Application removed.');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete application.');
      return false;
    }
  }, []);

  return { data, loading, error, fetchJobs, createJob, updateJob, deleteJob };
}
