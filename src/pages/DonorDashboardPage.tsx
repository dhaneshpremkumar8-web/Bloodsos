import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  MapPin,
  Heart,
  Siren,
  CheckCircle,
  XCircle,
  Truck,
  Hospital,
  Activity,
  Clock,
  Star,
  Zap,
  Brain,
  Phone,
  ArrowRight,
  Award,
  ShieldCheck,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardCard from '@/components/DashboardCard';
import { useAuth } from '@/context/AuthContext';
import { useSOS } from '@/context/SOSContext';
import {
  classNames,
  getUrgencyConfig,
  getStageConfig,
  getAvailabilityConfig,
  formatTimeAgo,
  getInitials,
  calculateMatchScore,
  getMatchReasons,
  getValidNextStages,
  isCompatibleDonor,
} from '@/utils/helpers';
import { mockDonors } from '@/data/mockData';
import type { SOSRequest, SOSStage, AvailabilityStatus } from '@/types';

export default function DonorDashboardPage() {
  const { user } = useAuth();
  const {
    sosRequests,
    donorAvailability,
    acceptSOS,
    declineSOS,
    updateSOSStage,
    toggleAvailability,
  } = useSOS();

  // The logged-in donor's mock data record
  const donorRecord = useMemo(
    () => mockDonors.find((d) => d.id === user?.id) ?? mockDonors[0],
    [user]
  );

  const currentAvailability: AvailabilityStatus = donorAvailability[donorRecord.id] ?? 'available';
  const isAvailable = currentAvailability === 'available';

  // Incoming SOS: compatible, active, not yet responded to by this donor, and donor is available
  const incomingSOS = useMemo(() => {
    if (!isAvailable) return [];
    return sosRequests.filter((s) => {
      if (s.stage === 'completed' || s.stage === 'cancelled') return false;
      if (s.acceptedDonor && s.acceptedDonor.donorId !== donorRecord.id) return false;
      if (s.acceptedDonor && s.acceptedDonor.donorId === donorRecord.id) return false;
      if (!isCompatibleDonor(donorRecord.bloodGroup, s.bloodGroup)) return false;
      const alreadyResponded = s.responses.some((r) => r.donorId === donorRecord.id);
      return !alreadyResponded;
    });
  }, [sosRequests, donorRecord, isAvailable]);

  // Active SOS: this donor has accepted and it's in progress
  const activeSOS = useMemo(() => {
    return sosRequests.filter(
      (s) => s.acceptedDonor?.donorId === donorRecord.id && s.stage !== 'completed' && s.stage !== 'cancelled'
    );
  }, [sosRequests, donorRecord]);

  // History: completed or declined by this donor
  const historySOS = useMemo(() => {
    return sosRequests.filter((s) => {
      if (s.stage === 'completed' && s.acceptedDonor?.donorId === donorRecord.id) return true;
      const resp = s.responses.find((r) => r.donorId === donorRecord.id);
      return resp?.status === 'declined' || resp?.status === 'completed';
    });
  }, [sosRequests, donorRecord]);

  const availabilityConfig = getAvailabilityConfig(currentAvailability);

  const handleToggleAvailability = () => {
    toggleAvailability(donorRecord.id, isAvailable ? 'unavailable' : 'available');
  };

  const handleAccept = (sosId: string) => {
    acceptSOS(sosId, donorRecord.id);
  };

  const handleDecline = (sosId: string) => {
    declineSOS(sosId, donorRecord.id);
  };

  const handleStageAction = (sosId: string, stage: SOSStage) => {
    updateSOSStage(sosId, stage);
  };

  const stageActions: Record<SOSStage, { label: string; nextStage: SOSStage; icon: typeof Truck } | null> = {
    created: null,
    searching: null,
    donor_notified: null,
    donor_accepted: { label: "I'm on the way", nextStage: 'on_the_way', icon: Truck },
    on_the_way: { label: 'Arrived at hospital', nextStage: 'arrived', icon: Hospital },
    arrived: { label: 'Donation in progress', nextStage: 'in_progress', icon: Activity },
    in_progress: { label: 'Donation completed', nextStage: 'completed', icon: CheckCircle },
    completed: null,
    cancelled: null,
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Donor Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome, {user?.name}. Here are your donor details and emergency requests.
        </p>
      </div>

      {/* Donor Profile Summary */}
      <div className="card mb-6 overflow-hidden">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700">
              {getInitials(user?.name ?? 'Donor')}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">{user?.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="badge border border-primary-200 bg-primary-50 text-primary-700 font-bold">
                  <Droplet className="h-3 w-3" fill="currentColor" />
                  {user?.bloodGroup}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {user?.location}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="h-3.5 w-3.5 text-warning-500" fill="currentColor" />
                  {donorRecord.reliabilityScore}% reliability
                </span>
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Availability Status
            </span>
            <button
              onClick={handleToggleAvailability}
              className={classNames(
                'relative flex items-center gap-3 rounded-full py-2 pl-3 pr-4 transition-all',
                isAvailable
                  ? 'bg-success-500 text-white shadow-sm hover:bg-success-600'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              )}
            >
              <span
                className={classNames(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  isAvailable ? 'bg-white/20' : 'bg-white/40'
                )}
              >
                <Heart
                  className={classNames('h-4 w-4', isAvailable ? 'text-white' : 'text-gray-500')}
                  fill={isAvailable ? 'currentColor' : 'none'}
                />
              </span>
              <span className="text-sm font-semibold">
                {isAvailable ? 'AVAILABLE FOR EMERGENCY' : 'CURRENTLY UNAVAILABLE'}
              </span>
            </button>
            <p className="text-xs text-gray-400">
              {isAvailable
                ? 'You will receive compatible SOS requests.'
                : 'You will not receive new SOS requests.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Donations"
          value={donorRecord.totalDonations}
          icon={Droplet}
          color="primary"
        />
        <DashboardCard
          title="Incoming SOS"
          value={incomingSOS.length}
          icon={Siren}
          color="accent"
        />
        <DashboardCard
          title="Active Donations"
          value={activeSOS.length}
          icon={Activity}
          color="success"
        />
        <DashboardCard
          title="Reliability Score"
          value={`${donorRecord.reliabilityScore}%`}
          icon={Award}
          color="info"
        />
      </div>

      {/* Incoming SOS Requests */}
      <div className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
          <Siren className="h-4 w-4 text-accent-600" />
          Incoming SOS Requests
          {incomingSOS.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-600 px-1.5 text-xs font-bold text-white">
              {incomingSOS.length}
            </span>
          )}
        </h2>

        {!isAvailable ? (
          <div className="card flex flex-col items-center justify-center p-8 text-center">
            <Heart className="h-10 w-10 text-gray-300" fill="none" />
            <p className="mt-3 text-sm font-medium text-gray-600">You are currently unavailable</p>
            <p className="mt-1 text-xs text-gray-400">
              Toggle your availability to receive emergency blood requests.
            </p>
          </div>
        ) : incomingSOS.length === 0 ? (
          <div className="card flex flex-col items-center justify-center p-8 text-center">
            <CheckCircle className="h-10 w-10 text-success-300" />
            <p className="mt-3 text-sm font-medium text-gray-600">No incoming requests</p>
            <p className="mt-1 text-xs text-gray-400">
              You'll see compatible emergency requests here when they come in.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {incomingSOS.map((sos) => {
              const urgency = getUrgencyConfig(sos.urgency);
              const score = calculateMatchScore(donorRecord, sos);
              const reasons = getMatchReasons(donorRecord, sos);
              return (
                <div
                  key={sos.id}
                  className="card relative overflow-hidden border-l-4 border-accent-500 p-5 animate-slide-up"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-600">
                        <Siren className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-accent-600">
                          Emergency Blood Request
                        </p>
                        <p className="text-xs text-gray-400">{formatTimeAgo(sos.createdAt)}</p>
                      </div>
                    </div>
                    <span className={classNames('badge border', urgency.classes)}>
                      <span className={classNames('h-1.5 w-1.5 rounded-full', urgency.dot)} />
                      {urgency.label}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-lg bg-primary-50 p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-white">
                      <Droplet className="h-6 w-6" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary-700">{sos.bloodGroup}</p>
                      <p className="text-xs text-gray-600">{sos.unitsRequired} unit(s) required</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs text-gray-400">Smart Match</p>
                      <p className="text-xl font-bold text-success-600">{score}%</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-1.5">
                      <Hospital className="h-3.5 w-3.5 text-gray-400" />
                      {sos.hospital}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {sos.location} &middot; {donorRecord.distance} km away
                    </p>
                  </div>

                  {/* Compatibility reasons */}
                  <div className="mt-3 rounded-lg bg-gray-50 p-3">
                    <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-gray-500">
                      <Brain className="h-3 w-3" />
                      Why you're matched
                    </p>
                    <ul className="space-y-0.5">
                      {reasons.map((reason, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <CheckCircle className="h-3 w-3 text-success-500" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAccept(sos.id)}
                      className="btn-primary flex-1 text-sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accept SOS
                    </button>
                    <button
                      onClick={() => handleDecline(sos.id)}
                      className="btn-secondary text-sm"
                    >
                      <XCircle className="h-4 w-4" />
                      Decline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active SOS — accepted by this donor */}
      {activeSOS.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            <Activity className="h-4 w-4 text-success-600" />
            Active SOS — You Accepted
          </h2>
          <div className="space-y-4">
            {activeSOS.map((sos) => {
              const stage = getStageConfig(sos.stage);
              const action = stageActions[sos.stage];
              return (
                <div key={sos.id} className="card border-l-4 border-success-500 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                        <Droplet className="h-5 w-5 text-primary-600" fill="currentColor" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{sos.hospital}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="badge border border-primary-200 bg-primary-50 text-primary-700">
                            {sos.bloodGroup}
                          </span>
                          <span className="text-xs text-gray-500">
                            {sos.unitsRequired} unit(s) &middot; {sos.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={classNames('badge', stage.classes)}>
                      <span className={classNames('h-1.5 w-1.5 rounded-full', stage.dot)} />
                      {stage.label}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-success-50 p-3 text-sm text-success-700">
                    <CheckCircle className="h-4 w-4" />
                    SOS Accepted &middot; Requester notified
                  </div>

                  {action && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleStageAction(sos.id, action.nextStage)}
                        className="btn-primary w-full text-sm"
                      >
                        <action.icon className="h-4 w-4" />
                        {action.label}
                      </button>
                    </div>
                  )}

                  {sos.stage === 'completed' && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-success-100 p-3 text-sm font-medium text-success-800">
                      <CheckCircle className="h-4 w-4" />
                      Donation completed. Thank you for saving lives!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Donation History */}
      {historySOS.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            <Clock className="h-4 w-4 text-gray-400" />
            Donation History
          </h2>
          <div className="card divide-y divide-gray-100">
            {historySOS.map((sos) => {
              const resp = sos.responses.find((r) => r.donorId === donorRecord.id);
              const isCompleted = sos.stage === 'completed' && sos.acceptedDonor?.donorId === donorRecord.id;
              return (
                <Link
                  key={sos.id}
                  to={`/sos/${sos.id}`}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                    <Droplet className="h-4 w-4 text-primary-600" fill="currentColor" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{sos.hospital}</p>
                    <p className="text-xs text-gray-400">
                      {sos.bloodGroup} &middot; {formatTimeAgo(sos.createdAt)}
                    </p>
                  </div>
                  <span
                    className={classNames(
                      'badge',
                      isCompleted
                        ? 'bg-success-50 text-success-700'
                        : resp?.status === 'declined'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-info-50 text-info-700'
                    )}
                  >
                    {isCompleted ? 'Completed' : resp?.status === 'declined' ? 'Declined' : 'Accepted'}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>
              );
            })}
          </div>
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
