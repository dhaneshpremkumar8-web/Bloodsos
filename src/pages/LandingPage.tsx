import { Link } from 'react-router-dom';
import {
  Droplet,
  Siren,
  Search,
  Mic,
  Brain,
  ShieldCheck,
  Clock,
  MapPin,
  Heart,
  ArrowRight,
  Users,
  Activity,
  Zap,
  Star,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Our AI ranks donors by distance, availability, reliability, and donation eligibility to find the perfect match in seconds.',
    color: 'text-primary-600 bg-primary-50',
  },
  {
    icon: Siren,
    title: 'Instant SOS Alerts',
    description: 'Broadcast emergency blood requests to nearby donors instantly. Get responses in real-time when every second counts.',
    color: 'text-accent-600 bg-accent-50',
  },
  {
    icon: Mic,
    title: 'Voice SOS',
    description: 'Just speak your emergency. Our voice recognition extracts blood group, location, and urgency automatically.',
    color: 'text-info-600 bg-info-50',
  },
  {
    icon: MapPin,
    title: 'Location-Based Search',
    description: 'Find donors near you with precise distance tracking. Filter by blood group, availability, and proximity.',
    color: 'text-success-600 bg-success-50',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Donors',
    description: 'Every donor is verified with reliability scores and donation history. Trust the network that saves lives.',
    color: 'text-warning-600 bg-warning-50',
  },
  {
    icon: Activity,
    title: 'Real-Time Dashboard',
    description: 'Track active requests, donor responses, and fulfillment status with a comprehensive live dashboard.',
    color: 'text-primary-600 bg-primary-50',
  },
];

const stats = [
  { value: '12,500+', label: 'Registered Donors', icon: Users },
  { value: '3,200+', label: 'Lives Saved', icon: Heart },
  { value: '890+', label: 'SOS Fulfilled', icon: Siren },
  { value: '< 2 min', label: 'Avg. Response Time', icon: Zap },
];

const steps = [
  {
    number: '01',
    title: 'Register',
    description: 'Sign up as a donor or recipient with your blood group and location.',
    icon: Users,
  },
  {
    number: '02',
    title: 'Get Matched',
    description: 'Our AI finds the best donors based on compatibility, distance, and availability.',
    icon: Brain,
  },
  {
    number: '03',
    title: 'Save Lives',
    description: 'Connect with matched donors instantly and coordinate the emergency donation.',
    icon: Heart,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary-100/40 blur-3xl" />
        <div className="absolute left-1/4 top-1/2 h-64 w-64 rounded-full bg-accent-100/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-sm font-medium text-primary-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
                </span>
                AI-Powered Emergency Blood Matching
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Every second counts.
                <br />
                <span className="text-primary-600">Every drop matters.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-gray-600">
                BloodSOS AI connects hospitals and patients with nearby verified blood donors
                in real-time, using AI to find the perfect match when lives are on the line.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="btn-primary text-base">
                  <Droplet className="h-5 w-5" fill="currentColor" />
                  Become a Donor
                </Link>
                <Link to="/login" className="btn-secondary text-base">
                  Emergency SOS
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-success-500" />
                  Verified Network
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary-500" />
                  24/7 Available
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-warning-500" fill="currentColor" />
                  Trusted by 50+ Hospitals
                </div>
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="card relative overflow-hidden p-6 shadow-card-hover">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-600">
                      <Siren className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Active SOS Alert</p>
                      <p className="text-xs text-gray-500">Apollo Hospitals, Chennai</p>
                    </div>
                  </div>
                  <span className="badge border border-accent-200 bg-accent-50 text-accent-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse" />
                    Critical
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-lg bg-primary-50 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-600 text-white">
                    <Droplet className="h-7 w-7" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-700">O-</p>
                    <p className="text-xs text-gray-600">3 units needed</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-500">Match Score</p>
                    <p className="text-lg font-bold text-success-600">97%</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {[
                    { name: 'Rahul Menon', group: 'O-', score: 97, distance: '5.2 km' },
                    { name: 'Arjun Sharma', group: 'O+', score: 88, distance: '2.3 km' },
                    { name: 'Surya Prakash', group: 'O+', score: 85, distance: '2.9 km' },
                  ].map((donor, i) => (
                    <div
                      key={donor.name}
                      className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                        {donor.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{donor.name}</p>
                        <p className="text-xs text-gray-500">{donor.distance} &middot; {donor.group}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-success-500"
                            style={{ width: `${donor.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-success-600">{donor.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-success-50 px-4 py-2.5">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-success-700">
                    <Zap className="h-4 w-4" />
                    3 donors matched in 1.2s
                  </span>
                  <span className="text-xs text-success-600">AI Engine</span>
                </div>
              </div>

              <div className="absolute -right-4 -top-4 hidden rotate-6 lg:block">
                <div className="card flex items-center gap-2 px-4 py-2 shadow-card-hover">
                  <Brain className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-semibold text-gray-700">AI Match Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
                <p className="font-display text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            Built for emergencies, powered by AI
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to find blood donors fast, coordinate donations, and save lives.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card card-hover group p-6 animate-slide-up">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps from emergency to life-saving donation.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-px w-full bg-gradient-to-r from-primary-200 to-transparent md:block" />
                )}
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-card">
                  <step.icon className="h-10 w-10 text-primary-600" />
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary-700">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-accent-800" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to save a life?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-100">
            Join thousands of donors and hospitals using BloodSOS AI. Your one donation can save up to three lives.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary-700 shadow-lg transition-all hover:bg-primary-50 hover:shadow-xl active:scale-95"
            >
              <Droplet className="h-5 w-5" fill="currentColor" />
              Register as Donor
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
            >
              Sign In
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
