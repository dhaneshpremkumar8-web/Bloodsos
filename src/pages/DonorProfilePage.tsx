import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  Droplet,
  Calendar,
  CheckCircle,
  XCircle,
  UserMinus,
  Award,
  ShieldCheck,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import Spinner from '@/components/Spinner';
import { mockDonors } from '@/data/mockData';
import {
  getAvailabilityConfig,
  getReliabilityColor,
  formatDate,
  formatTimeAgo,
  classNames,
  getInitials,
} from '@/utils/helpers';
import type { Donor, ResponseRecord } from '@/types';

const responseStatusConfig = {
  accepted: { label: 'Accepted', classes: 'bg-info-50 text-info-700', icon: CheckCircle },
  completed: { label: 'Completed', classes: 'bg-success-50 text-success-700', icon: CheckCircle },
  declined: { label: 'Declined', classes: 'bg-gray-100 text-gray-600', icon: XCircle },
  no_show: { label: 'No Show', classes: 'bg-accent-50 text-accent-700', icon: UserMinus },
};

export default function DonorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetId = id ?? user?.id;
    if (!targetId) {
      setLoading(false);
      return;
    }
    const d = mockDonors.find((donor) => donor.id === targetId) ?? null;
    setDonor(d);
    setLoading(false);
  }, [id, user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" label="Loading donor profile..." />
        </div>
      </DashboardLayout>
    );
  }

  if (!donor) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Droplet className="h-12 w-12 text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-600">Donor not found</p>
          <Link to="/donors" className="btn-secondary mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Donors
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const availability = getAvailabilityConfig(donor.availability);

  const stats = [
    { label: 'Total Donations', value: donor.totalDonations, icon: Droplet, color: 'text-primary-600 bg-primary-50' },
    { label: 'Reliability Score', value: `${donor.reliabilityScore}%`, icon: Star, color: 'text-warning-600 bg-warning-50' },
    { label: 'Last Donation', value: donor.lastDonationDate ? formatDate(donor.lastDonationDate) : 'N/A', icon: Calendar, color: 'text-info-600 bg-info-50' },
    { label: 'Eligibility', value: donor.donationEligibility ? 'Eligible' : 'Not Eligible', icon: ShieldCheck, color: donor.donationEligibility ? 'text-success-600 bg-success-50' : 'text-gray-600 bg-gray-100' },
  ];

  return (
    <DashboardLayout>
      <Link to={user?.role === 'donor' ? '/donor' : '/donors'} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" />
        {user?.role === 'donor' ? 'Back to Dashboard' : 'Back to Donors'}
      </Link>

      {/* Profile Header */}
      <div className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary-600 to-accent-600" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-primary-100 text-3xl font-bold text-primary-700 shadow-sm">
              {getInitials(donor.name)}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl font-bold text-gray-900">{donor.name}</h1>
                <span className={classNames('badge', availability.classes)}>
                  <span className={classNames('h-1.5 w-1.5 rounded-full', availability.dot)} />
                  {availability.label}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {donor.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Droplet className="h-4 w-4 text-primary-500" fill="currentColor" />
                  Blood Group: <span className="font-semibold text-primary-700">{donor.bloodGroup}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {donor.distance} km away
                </span>
              </div>
            </div>
            <div className="flex gap-2 pb-2">
              <a href={`tel:${donor.phone}`} className="btn-primary text-sm">
                <Phone className="h-4 w-4" />
                Call
              </a>
              <a href={`mailto:${donor.email}`} className="btn-secondary text-sm">
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className={classNames('flex h-10 w-10 items-center justify-center rounded-lg', stat.color)}>
              <stat.icon className="h-5 w-5" fill={stat.icon === Droplet ? 'currentColor' : 'none'} />
            </div>
            <p className="mt-3 text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Personal Details + Reliability */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Personal Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-400">Full Name</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{donor.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Blood Group</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{donor.bloodGroup}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Phone Number</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{donor.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Email Address</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{donor.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Location</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{donor.location}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Last Donation</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">
                {donor.lastDonationDate ? formatDate(donor.lastDonationDate) : 'No donations yet'}
              </p>
            </div>
          </div>
        </div>

        <div className="card flex flex-col items-center justify-center p-6">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(donor.reliabilityScore / 100) * 327} 327`}
                className={getReliabilityColor(donor.reliabilityScore)}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <Award className={classNames('h-6 w-6', getReliabilityColor(donor.reliabilityScore))} />
              <span className="mt-1 text-2xl font-bold text-gray-900">{donor.reliabilityScore}%</span>
              <span className="text-xs text-gray-400">Reliability</span>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-gray-500">
            Based on response rate, completed donations, and punctuality.
          </p>
        </div>
      </div>

      {/* Response History */}
      <div className="mt-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Response History</h2>
        <div className="card overflow-hidden">
          {donor.responseHistory.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No response history yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {donor.responseHistory.map((record: ResponseRecord) => {
                const config = responseStatusConfig[record.status];
                const Icon = config.icon;
                return (
                  <div key={record.id} className="flex items-center gap-4 p-4">
                    <div className={classNames('flex h-9 w-9 items-center justify-center rounded-lg', config.classes)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Responded to SOS Request
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTimeAgo(record.respondedAt)}
                      </p>
                    </div>
                    <span className={classNames('badge', config.classes)}>{config.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
