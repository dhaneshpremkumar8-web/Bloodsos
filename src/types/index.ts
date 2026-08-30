export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'donor' | 'recipient';

export type UrgencyLevel = 'critical' | 'urgent' | 'moderate';

/**
 * Full SOS lifecycle stages.
 * Valid transition order:
 *   created → searching → donor_notified → donor_accepted → on_the_way → arrived → in_progress → completed
 * Any stage before donor_accepted can transition to cancelled.
 * A declined donor does NOT change the global SOS stage.
 */
export type SOSStage =
  | 'created'
  | 'searching'
  | 'donor_notified'
  | 'donor_accepted'
  | 'on_the_way'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

/** Legacy compatibility — maps to whether the SOS is still open or done */
export type SOSStatus = 'active' | 'fulfilled' | 'expired' | 'cancelled';

export type AvailabilityStatus = 'available' | 'unavailable' | 'limited';

export type MatchTier = 'excellent' | 'good' | 'average';

export type NotificationType = 'sos_alert' | 'response' | 'system' | 'match' | 'match_found';

export type DonorResponseType = 'accepted' | 'declined' | 'pending' | 'completed' | 'no_show';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  role: UserRole;
  location: string;
  avatar?: string;
}

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  distance: number;
  availability: AvailabilityStatus;
  reliabilityScore: number;
  donationEligibility: boolean;
  lastDonationDate: string | null;
  totalDonations: number;
  responseHistory: ResponseRecord[];
  location: string;
  phone: string;
  email: string;
  matchScore?: number;
  matchTier?: MatchTier;
  matchReasons?: string[];
}

export interface ResponseRecord {
  id: string;
  sosRequestId: string;
  respondedAt: string;
  status: 'accepted' | 'declined' | 'completed' | 'no_show';
  notes?: string;
}

export interface DonorResponse {
  id: string;
  donorId: string;
  donorName: string;
  donorBloodGroup: BloodGroup;
  donorPhone: string;
  donorDistance: number;
  status: DonorResponseType;
  respondedAt: string;
  message?: string;
  matchScore?: number;
}

export interface SOSRequest {
  id: string;
  requesterName: string;
  requesterId: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  hospital: string;
  location: string;
  contactNumber: string;
  description: string;
  urgency: UrgencyLevel;
  status: SOSStatus;
  stage: SOSStage;
  createdAt: string;
  updatedAt: string;
  matchedDonors?: Donor[];
  responses: DonorResponse[];
  acceptedDonor?: DonorResponse | null;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  targetRole?: UserRole | 'all';
}

export interface Activity {
  id: string;
  type: 'sos_created' | 'donor_responded' | 'sos_fulfilled' | 'donor_registered' | 'match_found';
  description: string;
  timestamp: string;
}
