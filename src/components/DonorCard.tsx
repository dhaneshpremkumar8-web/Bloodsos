import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Star, Clock, Activity } from 'lucide-react';
import type { Donor } from '@/types';
import {
  getAvailabilityConfig,
  getMatchTierConfig,
  getInitials,
  classNames,
} from '@/utils/helpers';

interface DonorCardProps {
  donor: Donor;
  showMatchScore?: boolean;
}

export default function DonorCard({ donor, showMatchScore = true }: DonorCardProps) {
  const availability = getAvailabilityConfig(donor.availability);
  const tierConfig = donor.matchTier ? getMatchTierConfig(donor.matchTier) : null;

  return (
    <div className="card card-hover group flex flex-col p-5 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-base font-bold text-primary-700">
            {getInitials(donor.name)}
          </div>
          <div>
            <Link to={`/donors/${donor.id}`} className="font-semibold text-gray-900 hover:text-primary-600">
              {donor.name}
            </Link>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="badge border border-primary-200 bg-primary-50 text-primary-700">
                {donor.bloodGroup}
              </span>
              <span className="badge bg-gray-100 text-gray-600">{donor.totalDonations} donations</span>
            </div>
          </div>
        </div>
        {showMatchScore && donor.matchScore !== undefined && tierConfig && (
          <div className="flex flex-col items-end">
            <span className={classNames('badge border', tierConfig.classes)}>
              {donor.matchScore}%
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              {tierConfig.label}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-gray-400" />
          {donor.distance} km away
        </span>
        <span className="flex items-center gap-1.5">
          <Star className="h-4 w-4 text-warning-500" fill="currentColor" />
          {donor.reliabilityScore}% reliability
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
        <MapPin className="h-3.5 w-3.5 text-gray-400" />
        {donor.location}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={classNames('badge', availability.classes)}>
          <span className={classNames('h-1.5 w-1.5 rounded-full', availability.dot)} />
          {availability.label}
        </span>
        {donor.donationEligibility ? (
          <span className="badge bg-success-50 text-success-700">
            <Activity className="h-3 w-3" />
            Eligible
          </span>
        ) : (
          <span className="badge bg-gray-100 text-gray-600">
            <Clock className="h-3 w-3" />
            Not Eligible
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
        <a
          href={`tel:${donor.phone}`}
          className="btn-primary flex-1 text-xs"
        >
          <Phone className="h-3.5 w-3.5" />
          Call
        </a>
        <a
          href={`mailto:${donor.email}`}
          className="btn-secondary flex-1 text-xs"
        >
          <Mail className="h-3.5 w-3.5" />
          Email
        </a>
        <Link
          to={`/donors/${donor.id}`}
          className="btn-secondary text-xs"
        >
          Profile
        </Link>
      </div>
    </div>
  );
}
