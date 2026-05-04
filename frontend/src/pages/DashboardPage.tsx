import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from 'recharts';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../hooks/useJobs';
import { useTheme } from '../context/ThemeContext';
import StatsCard from '../components/StatsCard';
import JobFormModal from '../components/JobFormModal';
import type { Job, JobFormData } from '../types';
import { STATUS_CONFIG } from '../types';

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DashboardPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { data, loading, fetchJobs, createJob } = useJobs();
  const [modalOpen, setModalOpen] = useState(false);

  const isDark = theme === 'dark';
  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCreate = async (form: Partial<JobFormData>) => {
    const newJob = await createJob(form);
    if (newJob) fetchJobs();
  };

  const stats = data?.stats;
  const jobs = data?.jobs ?? [];
  const totalJobs = jobs.length;
  const successRate = totalJobs > 0 ? Math.round((stats?.offer ?? 0) / totalJobs * 100) : 0;
  const interviewRate = totalJobs > 0
    ? Math.round(((stats?.interview ?? 0) + (stats?.offer ?? 0)) / totalJobs * 100)
    : 0;

  // Pie chart data
  const pieData = stats
    ? Object.entries(STATUS_CONFIG).map(([key, cfg], i) => ({
        name: cfg.label.replace(' 🎉', ''),
        value: stats[key as keyof typeof stats] ?? 0,
        color: PIE_COLORS[i],
      })).filter((d) => d.value > 0)
    : [];

  // Monthly bar chart
  const monthlyData = (() => {
    if (!data?.monthly) return [];
    const map = new Map<string, number>();
    data.monthly.forEach(({ _id, count }) => {
      map.set(`${_id.year}-${_id.month}`, count);
    });
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      return { month: MONTH_NAMES[d.getMonth()], count: map.get(key) ?? 0 };
    });
  })();

  const recentJobs = [...jobs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} · {totalJobs} application{totalJobs !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Application
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Wishlist"
          value={stats?.wishlist ?? 0}
          color="text-blue-600 dark:text-blue-400"
          bgColor="bg-blue-100 dark:bg-blue-900/40"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>}
        />
        <StatsCard
          title="Applied"
          value={stats?.applied ?? 0}
          color="text-indigo-600 dark:text-indigo-400"
          bgColor="bg-indigo-100 dark:bg-indigo-900/40"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
        <StatsCard
          title="Interview"
          value={stats?.interview ?? 0}
          color="text-amber-600 dark:text-amber-400"
          bgColor="bg-amber-100 dark:bg-amber-900/40"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
        />
        <StatsCard
          title="Offers"
          value={stats?.offer ?? 0}
          color="text-green-600 dark:text-green-400"
          bgColor="bg-green-100 dark:bg-green-900/40"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
          subtitle={successRate > 0 ? `${successRate}% success rate` : undefined}
        />
        <StatsCard
          title="Rejected"
          value={stats?.rejected ?? 0}
          color="text-red-600 dark:text-red-400"
          bgColor="bg-red-100 dark:bg-red-900/40"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Charts row */}
      {totalJobs > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Activity bar chart */}
          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">Monthly Activity</h2>
              <span className="text-xs text-gray-400 dark:text-gray-500">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1f2937' : '#fff',
                    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: isDark ? '#f9fafb' : '#111827',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="count" name="Applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status distribution pie */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">Status Breakdown</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1f2937' : '#fff',
                    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', color: textColor }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Interview rate banner */}
      {totalJobs >= 5 && (
        <div className="card p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📊</div>
            <div>
              <p className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm">
                Your interview rate is <span className="text-lg font-bold">{interviewRate}%</span>
              </p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5">
                {interviewRate >= 20
                  ? 'Great performance! Keep applying to similar roles.'
                  : 'Consider tailoring your resume more to each role.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent applications */}
      {recentJobs.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Recent Applications</h2>
            <Link to="/applications" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentJobs.map((job) => {
              const s = STATUS_CONFIG[job.status];
              return (
                <div key={job._id} className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm shrink-0">
                    {job.company.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{job.position}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{job.company}</p>
                  </div>
                  <div className="shrink-0 hidden sm:block">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.color}`}>
                      {s.label}
                    </span>
                  </div>
                  <div className="shrink-0 text-xs text-gray-400 dark:text-gray-500 hidden md:block">
                    {format(new Date(job.createdAt), 'MMM d')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalJobs === 0 && (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Start tracking your job search</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            Add your first job application and get a clear overview of your search progress.
          </p>
          <button onClick={() => setModalOpen(true)} className="btn-primary mx-auto">
            Add Your First Application
          </button>
        </div>
      )}

      <JobFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
