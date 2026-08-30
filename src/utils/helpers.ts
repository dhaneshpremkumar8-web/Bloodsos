import type {
  BloodGroup,
  Donor,
  MatchTier,
  SOSRequest,
  UrgencyLevel,
  AvailabilityStatus,
  SOSStatus,
  SOSStage,
} from '@/types';

export function classNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const urgencyConfig: Record<UrgencyLevel, { label: string; classes: string; dot: string }> = {
  critical: {
    label: 'Critical',
    classes: 'bg-accent-50 text-accent-700 border-accent-200',
    dot: 'bg-accent-500',
  },
  urgent: {
    label: 'Urgent',
    classes: 'bg-warning-50 text-warning-700 border-warning-200',
    dot: 'bg-warning-500',
  },
  moderate: {
    label: 'Moderate',
    classes: 'bg-info-50 text-info-700 border-info-200',
    dot: 'bg-info-500',
  },
};

export function getUrgencyConfig(urgency: UrgencyLevel) {
  return urgencyConfig[urgency];
}

const statusConfig: Record<SOSStatus, { label: string; classes: string }> = {
  active: { label: 'Active', classes: 'bg-success-50 text-success-700' },
  fulfilled: { label: 'Fulfilled', classes: 'bg-info-50 text-info-700' },
  expired: { label: 'Expired', classes: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Cancelled', classes: 'bg-gray-100 text-gray-500' },
};

export function getStatusConfig(status: SOSStatus) {
  return statusConfig[status];
}

const availabilityConfig: Record<AvailabilityStatus, { label: string; classes: string; dot: string }> = {
  available: { label: 'Available', classes: 'bg-success-50 text-success-700', dot: 'bg-success-500' },
  unavailable: { label: 'Unavailable', classes: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  limited: { label: 'Limited', classes: 'bg-warning-50 text-warning-700', dot: 'bg-warning-500' },
};

export function getAvailabilityConfig(status: AvailabilityStatus) {
  return availabilityConfig[status];
}

const matchTierConfig: Record<MatchTier, { label: string; classes: string; icon: string }> = {
  excellent: { label: 'Excellent Match', classes: 'bg-success-50 text-success-700 border-success-200', icon: 'text-success-600' },
  good: { label: 'Good Match', classes: 'bg-info-50 text-info-700 border-info-200', icon: 'text-info-600' },
  average: { label: 'Average Match', classes: 'bg-warning-50 text-warning-700 border-warning-200', icon: 'text-warning-600' },
};

export function getMatchTierConfig(tier: MatchTier) {
  return matchTierConfig[tier];
}

export function getMatchTier(score: number): MatchTier {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  return 'average';
}

export function getMatchTierColor(score: number): string {
  if (score >= 85) return 'text-success-600';
  if (score >= 70) return 'text-info-600';
  return 'text-warning-600';
}

export function getReliabilityColor(score: number): string {
  if (score >= 90) return 'text-success-600';
  if (score >= 75) return 'text-info-600';
  return 'text-warning-600';
}

export function getBloodGroupColor(group: BloodGroup): string {
  return 'bg-primary-50 text-primary-700 border-primary-200';
}

export function isCompatibleDonor(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const compatibility: Record<BloodGroup, BloodGroup[]> = {
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'O+': ['A+', 'B+', 'AB+', 'O+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'A+': ['A+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB+', 'AB-'],
    'AB+': ['AB+'],
  };
  return compatibility[donorGroup]?.includes(recipientGroup) ?? false;
}

export function calculateMatchScore(donor: Donor, sos: SOSRequest): number {
  let score = 0;

  const bloodCompatible = isCompatibleDonor(donor.bloodGroup, sos.bloodGroup);
  if (!bloodCompatible) return 0;
  score += 30;

  if (donor.availability === 'available') score += 25;
  else if (donor.availability === 'limited') score += 10;

  if (donor.donationEligibility) score += 20;
  else return 0;

  score += Math.round((donor.reliabilityScore / 100) * 15);

  if (donor.distance <= 2) score += 10;
  else if (donor.distance <= 5) score += 7;
  else if (donor.distance <= 10) score += 4;
  else score += 1;

  if (sos.urgency === 'critical' && donor.reliabilityScore >= 90) score += 2;

  return Math.min(score, 100);
}

export function rankDonorsForSOS(donors: Donor[], sos: SOSRequest): Donor[] {
  return donors
    .map((d) => ({
      ...d,
      matchScore: calculateMatchScore(d, sos),
      matchTier: getMatchTier(calculateMatchScore(d, sos)),
    }))
    .filter((d) => (d.matchScore ?? 0) > 0)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
}

export function parseVoiceCommand(text: string): {
  bloodGroup?: BloodGroup;
  location?: string;
  urgency?: UrgencyLevel;
} {
  const result: { bloodGroup?: BloodGroup; location?: string; urgency?: UrgencyLevel } = {};
  const lower = text.toLowerCase();

  const groups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  for (const g of groups) {
    const gLower = g.toLowerCase().replace('+', ' positive').replace('-', ' negative');
    const gAlt = g.toLowerCase().replace('+', ' pos').replace('-', ' neg');
    if (lower.includes(gLower) || lower.includes(gAlt) || lower.includes(g.toLowerCase())) {
      result.bloodGroup = g;
      break;
    }
  }

  if (lower.includes('critical') || lower.includes('emergency') || lower.includes('dying') || lower.includes('life or death')) {
    result.urgency = 'critical';
  } else if (lower.includes('urgent') || lower.includes('asap') || lower.includes('quickly')) {
    result.urgency = 'urgent';
  } else if (lower.includes('moderate') || lower.includes('scheduled') || lower.includes('planned')) {
    result.urgency = 'moderate';
  }

  const nearMatch = lower.match(/near\s+([a-z\s,]+)/);
  if (nearMatch) {
    result.location = nearMatch[1].trim().replace(/\.$/, '').replace(/^(in|at|around)\s+/i, '');
  }
  const inMatch = lower.match(/in\s+([a-z\s,]+)/);
  if (inMatch && !result.location) {
    const loc = inMatch[1].trim().replace(/\.$/, '');
    if (loc.length > 2 && !['need', 'want', 'require', 'have'].includes(loc)) {
      result.location = loc;
    }
  }
  const atMatch = lower.match(/at\s+([a-z\s,]+)/);
  if (atMatch && !result.location) {
    result.location = atMatch[1].trim().replace(/\.$/, '');
  }

  return result;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// ── SOS lifecycle stage config ──
const stageConfig: Record<SOSStage, { label: string; classes: string; dot: string }> = {
  created: { label: 'SOS Created', classes: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  searching: { label: 'Searching for Donors', classes: 'bg-warning-50 text-warning-700', dot: 'bg-warning-500' },
  donor_notified: { label: 'Donor Notified', classes: 'bg-info-50 text-info-700', dot: 'bg-info-500' },
  donor_accepted: { label: 'Donor Accepted', classes: 'bg-success-50 text-success-700', dot: 'bg-success-500' },
  on_the_way: { label: 'Donor on the Way', classes: 'bg-success-50 text-success-700', dot: 'bg-success-500' },
  arrived: { label: 'Arrived at Hospital', classes: 'bg-success-50 text-success-700', dot: 'bg-success-500' },
  in_progress: { label: 'Donation in Progress', classes: 'bg-primary-50 text-primary-700', dot: 'bg-primary-500' },
  completed: { label: 'Completed', classes: 'bg-success-100 text-success-800', dot: 'bg-success-600' },
  cancelled: { label: 'Cancelled', classes: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
};

export function getStageConfig(stage: SOSStage) {
  return stageConfig[stage];
}

/** Ordered list of stages for progress indicators */
export const STAGE_ORDER: SOSStage[] = [
  'created',
  'searching',
  'donor_notified',
  'donor_accepted',
  'on_the_way',
  'arrived',
  'in_progress',
  'completed',
];

/** Valid next stages from a given stage */
export function getValidNextStages(stage: SOSStage): SOSStage[] {
  switch (stage) {
    case 'created': return ['searching', 'cancelled'];
    case 'searching': return ['donor_notified', 'donor_accepted', 'cancelled'];
    case 'donor_notified': return ['donor_accepted', 'cancelled'];
    case 'donor_accepted': return ['on_the_way', 'cancelled'];
    case 'on_the_way': return ['arrived'];
    case 'arrived': return ['in_progress'];
    case 'in_progress': return ['completed'];
    case 'completed': return [];
    case 'cancelled': return [];
    default: return [];
  }
}

/** Human-readable reasons explaining why a donor is ranked */
export function getMatchReasons(donor: Donor, sos: SOSRequest): string[] {
  const reasons: string[] = [];
  if (isCompatibleDonor(donor.bloodGroup, sos.bloodGroup)) {
    reasons.push(`Blood group compatible (${donor.bloodGroup} → ${sos.bloodGroup})`);
  }
  if (donor.distance <= 2) {
    reasons.push(`${donor.distance} km away — very close`);
  } else if (donor.distance <= 5) {
    reasons.push(`${donor.distance} km away — nearby`);
  } else {
    reasons.push(`${donor.distance} km away`);
  }
  if (donor.availability === 'available') {
    reasons.push('Available now');
  } else if (donor.availability === 'limited') {
    reasons.push('Limited availability');
  }
  if (donor.reliabilityScore >= 90) {
    reasons.push(`High response rate (${donor.reliabilityScore}%)`);
  } else if (donor.reliabilityScore >= 75) {
    reasons.push(`Good response rate (${donor.reliabilityScore}%)`);
  }
  if (donor.donationEligibility) {
    reasons.push('Eligible to donate');
  }
  return reasons;
}

/** Enhanced rankDonors that includes match reasons */
export function rankDonorsWithReasons(donors: Donor[], sos: SOSRequest): Donor[] {
  return donors
    .map((d) => {
      const score = calculateMatchScore(d, sos);
      return {
        ...d,
        matchScore: score,
        matchTier: getMatchTier(score),
        matchReasons: getMatchReasons(d, sos),
      };
    })
    .filter((d) => (d.matchScore ?? 0) > 0)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
}
