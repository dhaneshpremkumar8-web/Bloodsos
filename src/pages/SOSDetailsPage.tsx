import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Droplet,
  Building2,
  MapPin,
  Phone,
  Clock,
  User,
  Siren,
  Brain,
  Zap,
  Mail,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  Hospital,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DonorCard from '@/components/DonorCard';
import { useAuth } from '@/context/AuthContext';
import { useSOS } from '@/context/SOSContext';
import { mockDonors } from '@/data/mockData';
import {
  getUrgencyConfig,
  getStageConfig,
  formatDateTime,
  formatTimeAgo,
  rankDonorsWithReasons,
  classNames,
  getInitials,
  STAGE_ORDER,
} from '@/utils/helpers';
import type { DonorResponse, SOSStage } from '@/types';

const responseStatusConfig: Record<string, { label: string; classes: string; icon: typeof CheckCircle }> = {
  accepted: { label: 'Accepted', classes: 'bg-info-50 text-info-700', icon: CheckCircle },
  pending: { label: 'Pending', classes: 'bg-warning-50 text-warning-700', icon: Clock },
  declined: { label: 'Declined', classes: 'bg-gray-100 text-gray-600', icon: XCircle },
  completed: { label: 'Completed', classes: 'bg-success-50 text-success-700', icon: CheckCircle },
  no_show: { label: 'No Show', classes: 'bg-accent-50 text-accent-700', icon: XCircle },
};

export default function SOSDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { sosRequests, getSOSById, updateSOSStage } = useSOS();

  // Always get the latest version from the shared store
  const sos = id ? getSOSById(id) : undefined;

  if (!sos) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Siren className="h-12 w-12 text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-600">SOS request not found</p>
          <Link to="/sos" className="btn-secondary mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to SOS Board
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const urgency = getUrgencyConfig(sos.urgency);
  const stage = getStageConfig(sos.stage);
  const isDonor = user?.role === 'donor';
  const isRequester = !isDonor;

  // Compute matched donors with reasons
  const matchedDonors = rankDonorsWithReasons(mockDonors, sos);

  const details = [
    { icon: Building2, label: 'Hospital', value: sos.hospital },
    { icon: MapPin, label: 'Location', value: sos.location },
    { icon: Phone, label: 'Contact', value: sos.contactNumber },
    { icon: User, label: 'Requested By', value: sos.requesterName },
    { icon: Clock, label: 'Posted', value: formatDateTime(sos.createdAt) },
  ];

  // Stage progression for the progress bar
  const currentStageIndex = STAGE_ORDER.indexOf(sos.stage);

  // Donor stage actions (only visible to the accepted donor)
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

  const action = stageActions[sos.stage];
  const isAcceptedDonor = sos.acceptedDonor?.donorId === user?.id;

  return (
    <DashboardLayout>
      <Link
        to={isDonor ? '/donor' : '/sos'}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-600"
      >
        <ArrowLeft className="h-4 w-4" />
        {isDonor ? 'Back to Donor Dashboard' : 'Back to SOS Board'}
      </Link>

      {/* SOS Header */}
      <div className="card overflow-hidden">
        <div className={classNames(
          'px-6 py-4',
          sos.urgency === 'critical' ? 'bg-accent-50' : sos.urgency === 'urgent' ? 'bg-warning-50' : 'bg-info-50'
        )}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className={classNames(
                'flex h-12 w-12 items-center justify-center rounded-lg',
                sos.urgency === 'critical' ? 'bg-accent-600' : sos.urgency === 'urgent' ? 'bg-warning-500' : 'bg-info-500'
              )}>
                <Droplet className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge border border-primary-200 bg-white text-primary-700 text-sm font-bold">
                    {sos.bloodGroup}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {sos.unitsRequired} {sos.unitsRequired === 1 ? 'unit' : 'units'} needed
                  </span>
                </div>
                <h1 className="mt-1 font-display text-xl font-bold text-gray-900">{sos.hospital}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={classNames('badge border', urgency.classes)}>
                <span className={classNames('h-1.5 w-1.5 rounded-full', urgency.dot)} />
                {urgency.label}
              </span>
              <span className={classNames('badge', stage.classes)}>
                <span className={classNames('h-1.5 w-1.5 rounded-full', stage.dot)} />
                {stage.label}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Description</p>
            <p className="mt-1 text-sm text-gray-700">{sos.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <detail.icon className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{detail.label}</p>
                  <p className="text-sm font-medium text-gray-900">{detail.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stage Progress Bar */}
          {sos.stage !== 'cancelled' && (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">SOS Progress</p>
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
                {STAGE_ORDER.map((s, i) => {
                  const sConfig = getStageConfig(s);
                  const isPast = i < currentStageIndex;
                  const isCurrent = i === currentStageIndex;
                  return (
                    <div key={s} className="flex items-center gap-1">
                      {i > 0 && (
                        <div className={classNames('h-0.5 w-4 shrink-0', isPast ? 'bg-success-400' : 'bg-gray-200')} />
                      )}
                      <div className="flex shrink-0 flex-col items-center gap-1">
                        <div
                          className={classNames(
                            'flex h-6 w-6 items-center justify-center rounded-full text-xs',
                            isPast && 'bg-success-500 text-white',
                            isCurrent && 'bg-primary-600 text-white ring-2 ring-primary-200',
                            !isPast && !isCurrent && 'bg-gray-100 text-gray-400'
                          )}
                        >
                          {isPast ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                        </div>
                        <span className={classNames(
                          'whitespace-nowrap text-[10px] font-medium',
                          isCurrent ? 'text-primary-700' : isPast ? 'text-success-600' : 'text-gray-400'
                        )}>
                          {sConfig.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Donor action buttons (only for the accepted donor) */}
          {isAcceptedDonor && action && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <button
                onClick={() => updateSOSStage(sos.id, action.nextStage)}
                className="btn-primary w-full"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </button>
            </div>
          )}

          {/* Requester contact actions */}
          {isRequester && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
              <a href={`tel:${sos.contactNumber}`} className="btn-primary text-sm">
                <Phone className="h-4 w-4" />
                Call Contact
              </a>
              <a href={`sms:${sos.contactNumber}`} className="btn-secondary text-sm">
                <MessageCircle className="h-4 w-4" />
                Send Message
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Accepted Donor Info (Requester view) */}
      {sos.acceptedDonor && (
        <div className="mt-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Accepted Donor</h2>
          <div className="card border-l-4 border-success-500 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-base font-bold text-success-700">
                  {getInitials(sos.acceptedDonor.donorName)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{sos.acceptedDonor.donorName}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="badge border border-primary-200 bg-primary-50 text-primary-700">
                      {sos.acceptedDonor.donorBloodGroup}
                    </span>
                    <span className="text-xs text-gray-500">
                      {sos.acceptedDonor.donorDistance} km away
                    </span>
                    <span className="text-xs text-gray-400">
                      &middot; {formatTimeAgo(sos.acceptedDonor.respondedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isRequester && (
                  <>
                    <a
                      href={`tel:${sos.acceptedDonor.donorPhone}`}
                      className="btn-primary text-sm"
                    >
                      <Phone className="h-4 w-4" />
                      Call Donor
                    </a>
                    <Link
                      to={`/donors/${sos.acceptedDonor.donorId}`}
                      className="btn-secondary text-sm"
                    >
                      View Donor
                    </Link>
                  </>
                )}
                {isAcceptedDonor && (
                  <span className="badge bg-success-50 text-success-700">
                    <CheckCircle className="h-3 w-3" />
                    You accepted this SOS
                  </span>
                )}
              </div>
            </div>
            {sos.acceptedDonor.matchScore !== undefined && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary-50 p-3">
                <Brain className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">
                  Smart Match Score: {sos.acceptedDonor.matchScore}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Matched Donors */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
              <Brain className="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">AI-Assisted Donor Prioritization</h2>
              <p className="text-xs text-gray-500">Ranked by compatibility, distance, availability, and reliability</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-success-50 px-3 py-1 text-xs font-semibold text-success-700">
            <Zap className="h-3 w-3" />
            {matchedDonors.length} matches
          </span>
        </div>

        {matchedDonors.length === 0 ? (
          <div className="card p-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No compatible donors available right now.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedDonors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} showMatchScore />
            ))}
          </div>
        )}
      </div>

      {/* Donor Responses */}
      <div className="mt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Donor Responses</h2>
        {sos.responses.length === 0 ? (
          <div className="card p-8 text-center">
            <Clock className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">
              {sos.stage === 'searching' || sos.stage === 'created'
                ? 'Waiting for donor responses...'
                : 'No responses yet.'}
            </p>
          </div>
        ) : (
          <div className="card divide-y divide-gray-100">
            {sos.responses.map((response: DonorResponse) => {
              const config = responseStatusConfig[response.status] ?? responseStatusConfig.pending;
              const Icon = config.icon;
              return (
                <div key={response.id} className="flex items-start gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                    {response.donorName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{response.donorName}</p>
                        <p className="text-xs text-gray-400">
                          {formatTimeAgo(response.respondedAt)} &middot; {response.donorBloodGroup}
                          {response.donorDistance > 0 && ` &middot; ${response.donorDistance} km`}
                        </p>
                      </div>
                      <span className={classNames('badge', config.classes)}>
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>
                    {response.message && (
                      <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                        "{response.message}"
                      </p>
                    )}
                  </div>
                  {isRequester && response.status === 'accepted' && (
                    <div className="flex gap-1">
                      <a href={`tel:${response.donorPhone}`} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600">
                        <Phone className="h-4 w-4" />
                      </a>
                      <Link to={`/donors/${response.donorId}`} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600">
                        <Mail className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

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
