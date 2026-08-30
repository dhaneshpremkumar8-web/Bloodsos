import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { classNames } from '@/utils/helpers';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const user = await login(email, password);
      navigate(user.role === 'donor' ? '/donor' : '/dashboard', { replace: true });
    } catch (err) {
      setErrors({ password: err instanceof Error ? err.message : 'Login failed' });
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 shadow-sm">
            <Droplet className="h-5 w-5 text-white" fill="white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold text-gray-900">BloodSOS</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-600">AI</span>
          </div>
        </Link>

        <div className="card p-8 shadow-card-hover animate-slide-up">
          <h1 className="font-display text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-600">Sign in to access your dashboard and SOS alerts.</p>

          {/* Demo credentials */}
          <div className="mt-4 rounded-lg border border-info-200 bg-info-50 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-info-700">
              <Info className="h-3.5 w-3.5" />
              Demo Accounts (password: demo123)
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              <button
                onClick={() => fillDemo('requester@bloodsos.ai')}
                className="rounded-md bg-white px-3 py-1.5 text-left text-xs text-gray-700 transition-colors hover:bg-info-100"
              >
                <span className="font-semibold text-accent-600">Requester:</span> requester@bloodsos.ai
              </button>
              <button
                onClick={() => fillDemo('donor@bloodsos.ai')}
                className="rounded-md bg-white px-3 py-1.5 text-left text-xs text-gray-700 transition-colors hover:bg-info-100"
              >
                <span className="font-semibold text-success-600">Donor:</span> donor@bloodsos.ai
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={classNames('input-field pl-10', errors.email && 'border-accent-400 focus:border-accent-500 focus:ring-accent-500/20')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 flex items-center gap-1 text-xs text-accent-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={classNames('input-field px-10', errors.password && 'border-accent-400 focus:border-accent-500 focus:ring-accent-500/20')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 flex items-center gap-1 text-xs text-accent-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                Remember me
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Register here
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          BloodSOS is an emergency donor coordination platform. In a medical emergency, contact emergency medical services and the relevant hospital/blood bank.
        </p>
      </div>
    </div>
  );
}
