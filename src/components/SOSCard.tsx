import { Link } from 'react-router-dom';
import { MapPin, Building2, Clock, Droplet } from 'lucide-react';
import type { SOSRequest } from '@/types';
import { getUrgencyConfig, getStatusConfig, formatTimeAgo, classNames } from '@/utils/helpers';

interface SOSCardProps {
  sos: SOSRequest;
}

export default function SOSCard({ sos }: SOSCardProps) {
  const urgency = getUrgencyConfig(sos.urgency);
  const status = getStatusConfig(sos.status);

  return (
    <Link to={`/sos/${sos.id}`} className="block">
      <div className="card card-hover group relative overflow-hidden p-5 animate-slide-up">
        {sos.urgency === 'critical' && (
          <div className="absolute left-0 top-0 h-full w-1 bg-accent-500" />
        )}
        {sos.urgency === 'urgent' && (
          <div className="absolute left-0 top-0 h-full w-1 bg-warning-500" />
        )}

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
              <Droplet className="h-6 w-6 text-primary-600" fill="currentColor" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge border border-primary-200 bg-primary-50 text-primary-700">
                  {sos.bloodGroup}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {sos.unitsRequired} {sos.unitsRequired === 1 ? 'unit' : 'units'}
                </span>
              </div>
              <h3 className="mt-1 font-semibold text-gray-900 group-hover:text-primary-600">
                {sos.hospital}
              </h3>
            </div>
          </div>
          <span className={classNames('badge border', urgency.classes)}>
            <span className={classNames('h-1.5 w-1.5 rounded-full', urgency.dot)} />
            {urgency.label}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-gray-600">{sos.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            {sos.requesterName}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {sos.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {formatTimeAgo(sos.createdAt)}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className={classNames('badge', status.classes)}>{status.label}</span>
          <span className="text-xs font-medium text-primary-600 group-hover:underline">
            View Details &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
