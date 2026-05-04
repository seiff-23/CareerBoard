import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 4);
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-400'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex flex-col items-center justify-center px-4 transition-colors duration-300">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 6a6 6 0 100 12A6 6 0 0012 6z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <span className="text-white text-xl font-bold">CB</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Career<span className="text-indigo-600 dark:text-indigo-400">Board</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Your job search, organised.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Min. 6 characters"
                required
              />
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2 flex gap-1 items-center">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i < strength ? strengthColor[strength] : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                  <span className={`text-xs ml-1 font-medium ${
                    strength <= 1 ? 'text-red-500' : strength === 2 ? 'text-amber-500' : strength === 3 ? 'text-blue-500' : 'text-green-500'
                  }`}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="label">Confirm password</label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                className={`input-field ${
                  form.confirm && form.confirm !== form.password
                    ? 'border-red-400 focus:ring-red-400'
                    : ''
                }`}
                placeholder="Repeat your password"
                required
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          Built with React · Node.js · MongoDB
        </p>
      </div>
    </div>
  );
}
