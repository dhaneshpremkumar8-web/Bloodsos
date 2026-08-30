import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Droplet,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Siren,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useSOS } from '@/context/SOSContext';
import { mockDonors } from '@/data/mockData';
import {
  classNames,
  formatTimeAgo,
  getStageConfig,
  getUrgencyConfig,
} from '@/utils/helpers';

export default function HistoryPage() {
  const { user } = useAuth();
  const { sosRequests } = useSOS();
  const isDonor = user?.role === 'donor';
  const donorRecord = useMemo(
    () => mockDonors.find((d) => d.id === user?.id) ?? mockDonors[0],
    [user]
  );

  const historyItems = useMemo(() => {
    if (isDonor) {
      return sosRequests.filter((s) => {
        if (s.stage === 'completed' && s.acceptedDonor?.donorId === donorRecord.id) return true;
        const resp = s.responses.find((r) => r.donorId === donorRecord.id);
        return resp?.status === 'declined' || resp?.status === 'completed';
      });
    }
    return sosRequests.filter(
      (s) =>
        s.requesterId === user?.id ||
        s.requesterName === user?.name ||
        s.stage === 'completed' ||
        s.stage === 'cancelled'
    );
  }, [sosRequests, user, isDonor, donorRecord]);

  const completedCount = isDonor
    ? sosRequests.filter((s) => s.stage === 'completed' && s.acceptedDonor?.donorId === donorRecord.id).length
    : sosRequests.filter((s) => s.stage === 'completed' && (s.requesterId === user?.id || s.requesterName === user?.name)).length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {isDonor ? 'Donation History' : 'SOS History'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {isDonor
            ? 'A record of your past donations and responses to emergency requests.'
            : 'A record of your past emergency blood requests.'}
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-50">
            <CheckCircle className="h-5 w-5 text-success-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{completedCount}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
            <History className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{historyItems.length}</p>
            <p className="text-xs text-gray-500">Total Records</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50">
            <Heart className="h-5 w-5 text-accent-600" fill="currentColor" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {isDonor ? donorRecord.totalDonations : completedCount}
            </p>
            <p className="text-xs text-gray-500">{isDonor ? 'Total Donations' : 'Lives Touched'}</p>
          </div>
        </div>
      </div>

      {/* History List */}
      {historyItems.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-12 text-center">
          <History className="h-12 w-12 text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-600">No history yet</p>
          <p className="mt-1 text-xs text-gray-400">
            {isDonor
              ? 'Your donation responses will appear here.'
              : 'Your past SOS requests will appear here.'}
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {historyItems.map((sos) => {
            const stage = getStageConfig(sos.stage);
            const urgency = getUrgencyConfig(sos.urgency);
            const isCompleted = sos.stage === 'completed';
            const isCancelled = sos.stage === 'cancelled';
            const donorResp = isDonor
              ? sos.responses.find((r) => r.donorId === donorRecord.id)
              : null;

            return (
              <Link
                key={sos.id}
                to={`/sos/${sos.id}`}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-gray-50"
              >
                <div
                  className={classNames(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    isCompleted
                      ? 'bg-success-50'
                      : isCancelled
                      ? 'bg-gray-100'
                      : 'bg-primary-50'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-success-600" />
                  ) : isCancelled ? (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Droplet className="h-5 w-5 text-primary-600" fill="currentColor" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="badge border border-primary-200 bg-primary-50 text-primary-700">
                      {sos.bloodGroup}
                    </span>
                    <p className="text-sm font-medium text-gray-900">{sos.hospital}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {sos.location} &middot; {formatTimeAgo(sos.createdAt)}
                  </p>
                  {donorResp && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      Your response: <span className="font-medium">{donorResp.status}</span>
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={classNames('badge', stage.classes)}>
                    {stage.label}
                  </span>
                  <span className={classNames('text-xs', urgency.classes.split(' ')[1])}>
                    {urgency.label}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
              </Link>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs text-gray-500">
          <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-gray-400" />
          BloodSOS is an emergency donor coordination platform. In a medical emergency, contact emergency medical services and the relevant hospital/blood bank.
        </p>
      </div>
    </DashboardLayout>
  );
}
