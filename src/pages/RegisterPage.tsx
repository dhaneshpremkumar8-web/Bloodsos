import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplet,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Heart,
  Siren,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { bloodGroups } from '@/data/mockData';
import { classNames } from '@/utils/helpers';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bloodGroup: '',
    role: '',
    location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    if (!form.phone) e.phone = 'Phone number is required';
    else if (!/^[+\d\s()-]{10,}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    if (!form.bloodGroup) e.bloodGroup = 'Select your blood group';
    if (!form.role) e.role = 'Select your role';
    if (!form.location.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const u = await register(form);
      navigate(u.role === 'donor' ? '/donor' : '/dashboard', { replace: true });
    } catch (err) {
      setErrors({ password: err instanceof Error ? err.message : 'Registration failed' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-12">
      <div className="w-full max-w-2xl">
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
          <h1 className="font-display text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-600">Join the BloodSOS AI network and start saving lives.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="John Doe"
                    className={classNames('input-field pl-10', errors.name && 'border-accent-400')}
                  />
                </div>
                {errors.name && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    className={classNames('input-field pl-10', errors.email && 'border-accent-400')}
                  />
                </div>
                {errors.email && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="Min 6 characters"
                    className={classNames('input-field px-10', errors.password && 'border-accent-400')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.password}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className={classNames('input-field pl-10', errors.phone && 'border-accent-400')}
                  />
                </div>
                {errors.phone && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.phone}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Blood Group</label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => update('bloodGroup', e.target.value)}
                  className={classNames('input-field', errors.bloodGroup && 'border-accent-400')}
                >
                  <option value="">Select blood group</option>
                  {bloodGroups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {errors.bloodGroup && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.bloodGroup}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => update('location', e.target.value)}
                    placeholder="Chennai, Tamil Nadu"
                    className={classNames('input-field pl-10', errors.location && 'border-accent-400')}
                  />
                </div>
                {errors.location && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.location}</p>}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">I want to register as</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => update('role', 'donor')}
                  className={classNames(
                    'flex items-center gap-3 rounded-lg border-2 p-4 transition-all',
                    form.role === 'donor'
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  )}
                >
                  <div className={classNames('flex h-10 w-10 items-center justify-center rounded-lg', form.role === 'donor' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500')}>
                    <Heart className="h-5 w-5" fill={form.role === 'donor' ? 'currentColor' : 'none'} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">Donor</p>
                    <p className="text-xs text-gray-500">Donate blood</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => update('role', 'recipient')}
                  className={classNames(
                    'flex items-center gap-3 rounded-lg border-2 p-4 transition-all',
                    form.role === 'recipient'
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  )}
                >
                  <div className={classNames('flex h-10 w-10 items-center justify-center rounded-lg', form.role === 'recipient' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500')}>
                    <Siren className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">Recipient</p>
                    <p className="text-xs text-gray-500">Request blood</p>
                  </div>
                </button>
              </div>
              {errors.role && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.role}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
