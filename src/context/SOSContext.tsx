import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  SOSRequest,
  Notification,
  DonorResponse,
  DonorResponseType,
  SOSStage,
  AvailabilityStatus,
  BloodGroup,
  UrgencyLevel,
} from '@/types';
import { mockDonors, mockSOSRequests, mockNotifications } from '@/data/mockData';
import {
  isCompatibleDonor,
  calculateMatchScore,
  getMatchTier,
  rankDonorsForSOS,
  getMatchReasons,
} from '@/utils/helpers';

const STORAGE_KEY = 'bloodsos_sos_requests';
const NOTIF_KEY = 'bloodsos_notifications';
const AVAIL_KEY = 'bloodsos_donor_availability';

interface SOSContextType {
  sosRequests: SOSRequest[];
  notifications: Notification[];
  donorAvailability: Record<string, AvailabilityStatus>;
  createSOS: (data: {
    requesterName: string;
    requesterId: string;
    bloodGroup: BloodGroup;
    unitsRequired: number;
    hospital: string;
    location: string;
    contactNumber: string;
    description: string;
    urgency: UrgencyLevel;
  }) => SOSRequest;
  getSOSById: (id: string) => SOSRequest | undefined;
  acceptSOS: (sosId: string, donorId: string) => void;
  declineSOS: (sosId: string, donorId: string) => void;
  updateSOSStage: (sosId: string, stage: SOSStage) => void;
  toggleAvailability: (donorId: string, status: AvailabilityStatus) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role?: string) => void;
  unreadCount: (role?: string) => number;
}

const SOSContext = createContext<SOSContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch {
    // ignore
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

/** Seed SOS requests with the new stage/responses fields on first load */
function seedSOSRequests(): SOSRequest[] {
  const stored = loadFromStorage<SOSRequest[] | null>(STORAGE_KEY, null);
  if (stored && stored.length > 0) return stored;

  return mockSOSRequests.map((s) => ({
    ...s,
    stage: s.status === 'fulfilled' ? 'completed' : 'searching',
    updatedAt: s.createdAt,
    responses: [],
    acceptedDonor: null,
  }));
}

function seedNotifications(): Notification[] {
  const stored = loadFromStorage<Notification[] | null>(NOTIF_KEY, null);
  if (stored && stored.length > 0) return stored;
  return [...mockNotifications];
}

function seedAvailability(): Record<string, AvailabilityStatus> {
  const stored = loadFromStorage<Record<string, AvailabilityStatus> | null>(AVAIL_KEY, null);
  if (stored) return stored;
  const map: Record<string, AvailabilityStatus> = {};
  mockDonors.forEach((d) => {
    map[d.id] = d.availability;
  });
  return map;
}

export function SOSProvider({ children }: { children: ReactNode }) {
  const [sosRequests, setSosRequests] = useState<SOSRequest[]>(seedSOSRequests);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [donorAvailability, setDonorAvailability] = useState<Record<string, AvailabilityStatus>>(seedAvailability);

  useEffect(() => {
    saveToStorage(STORAGE_KEY, sosRequests);
  }, [sosRequests]);

  useEffect(() => {
    saveToStorage(NOTIF_KEY, notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage(AVAIL_KEY, donorAvailability);
  }, [donorAvailability]);

  const addNotification = useCallback(
    (n: Omit<Notification, 'id' | 'createdAt' | 'read'> & { targetRole?: string }) => {
      const notif: Notification = {
        ...n,
        id: 'n' + Date.now() + Math.random().toString(36).slice(2, 6),
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    },
    []
  );

  const createSOS = useCallback<SOSContextType['createSOS']>(
    (data) => {
      const now = new Date().toISOString();
      const id = 'sos' + Date.now();
      const sos: SOSRequest = {
        ...data,
        id,
        status: 'active',
        stage: 'created',
        createdAt: now,
        updatedAt: now,
        responses: [],
        acceptedDonor: null,
      };

      // Find compatible available donors and rank them
      const ranked = rankDonorsForSOS(mockDonors, sos).filter(
        (d) => donorAvailability[d.id] === 'available' || donorAvailability[d.id] === 'limited'
      );

      setSosRequests((prev) => [{ ...sos, matchedDonors: ranked }, ...prev]);

      // Notify compatible donors
      ranked.forEach((donor) => {
        addNotification({
          type: 'sos_alert',
          title: 'Emergency Blood Request',
          message: `${data.bloodGroup} blood needed at ${data.hospital}. ${data.unitsRequired} unit(s). Urgency: ${data.urgency}.`,
          actionUrl: `/donor`,
          targetRole: 'donor',
        });
      });

      // Transition to searching after creation
      setTimeout(() => {
        setSosRequests((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, stage: 'searching', updatedAt: new Date().toISOString() } : s
          )
        );
      }, 100);

      return { ...sos, matchedDonors: ranked };
    },
    [donorAvailability, addNotification]
  );

  const getSOSById = useCallback(
    (id: string) => sosRequests.find((s) => s.id === id),
    [sosRequests]
  );

  const acceptSOS = useCallback<SOSContextType['acceptSOS']>(
    (sosId, donorId) => {
      const donor = mockDonors.find((d) => d.id === donorId);
      if (!donor) return;

      setSosRequests((prev) =>
        prev.map((s) => {
          if (s.id !== sosId) return s;
          // Don't allow accepting if already accepted by another donor
          if (s.acceptedDonor && s.acceptedDonor.donorId !== donorId) return s;

          const response: DonorResponse = {
            id: 'resp' + Date.now(),
            donorId: donor.id,
            donorName: donor.name,
            donorBloodGroup: donor.bloodGroup,
            donorPhone: donor.phone,
            donorDistance: donor.distance,
            status: 'accepted',
            respondedAt: new Date().toISOString(),
            matchScore: calculateMatchScore(donor, s),
          };

          return {
            ...s,
            stage: 'donor_accepted',
            status: 'active',
            updatedAt: new Date().toISOString(),
            acceptedDonor: response,
            responses: [
              ...s.responses.map((r) =>
                r.donorId === donorId ? { ...r, status: 'accepted' as DonorResponseType } : r
              ),
              ...(s.responses.some((r) => r.donorId === donorId) ? [] : [response]),
            ],
          };
        })
      );

      // Notify the requester
      addNotification({
        type: 'response',
        title: 'Donor Accepted Your SOS',
        message: `${donor.name} (${donor.bloodGroup}) accepted your emergency request and is ready to donate.`,
        actionUrl: `/sos/${sosId}`,
        targetRole: 'recipient',
      });
    },
    [addNotification]
  );

  const declineSOS = useCallback<SOSContextType['declineSOS']>(
    (sosId, donorId) => {
      const donor = mockDonors.find((d) => d.id === donorId);

      setSosRequests((prev) =>
        prev.map((s) => {
          if (s.id !== sosId) return s;
          const response: DonorResponse = {
            id: 'resp' + Date.now(),
            donorId,
            donorName: donor?.name ?? 'Unknown',
            donorBloodGroup: donor?.bloodGroup ?? ('O+' as BloodGroup),
            donorPhone: donor?.phone ?? '',
            donorDistance: donor?.distance ?? 0,
            status: 'declined',
            respondedAt: new Date().toISOString(),
            message: 'Donor declined this request.',
          };

          return {
            ...s,
            updatedAt: new Date().toISOString(),
            responses: [
              ...s.responses.map((r) =>
                r.donorId === donorId ? { ...r, status: 'declined' as DonorResponseType } : r
              ),
              ...(s.responses.some((r) => r.donorId === donorId) ? [] : [response]),
            ],
          };
        })
      );
      // Do NOT notify requester about a decline — keep searching
    },
    []
  );

  const updateSOSStage = useCallback<SOSContextType['updateSOSStage']>(
    (sosId, stage) => {
      const now = new Date().toISOString();
      setSosRequests((prev) =>
        prev.map((s) => {
          if (s.id !== sosId) return s;

          let status = s.status;
          if (stage === 'completed') status = 'fulfilled';
          else if (stage === 'cancelled') status = 'cancelled';
          else status = 'active';

          let acceptedDonor = s.acceptedDonor;
          let responses = s.responses;

          if (stage === 'completed' && acceptedDonor) {
            acceptedDonor = { ...acceptedDonor, status: 'completed' as DonorResponseType };
            responses = responses.map((r) =>
              r.donorId === acceptedDonor!.donorId
                ? { ...r, status: 'completed' as DonorResponseType }
                : r
            );
          }

          return {
            ...s,
            stage,
            status,
            updatedAt: now,
            acceptedDonor,
            responses,
          };
        })
      );

      // Generate notifications for stage transitions
      const sos = sosRequests.find((s) => s.id === sosId);
      if (!sos) return;

      if (stage === 'on_the_way' && sos.acceptedDonor) {
        addNotification({
          type: 'response',
          title: 'Donor is on the way',
          message: `${sos.acceptedDonor.donorName} is heading to ${sos.hospital}.`,
          actionUrl: `/sos/${sosId}`,
          targetRole: 'recipient',
        });
      } else if (stage === 'arrived') {
        addNotification({
          type: 'response',
          title: 'Donor arrived at hospital',
          message: `${sos.acceptedDonor?.donorName ?? 'The donor'} has arrived at ${sos.hospital}.`,
          actionUrl: `/sos/${sosId}`,
          targetRole: 'recipient',
        });
      } else if (stage === 'completed') {
        addNotification({
          type: 'response',
          title: 'Blood Donation Completed',
          message: `The SOS request at ${sos.hospital} has been completed. Thank you to all donors!`,
          actionUrl: `/sos/${sosId}`,
          targetRole: 'recipient',
        });
      }
    },
    [sosRequests, addNotification]
  );

  const toggleAvailability = useCallback<SOSContextType['toggleAvailability']>(
    (donorId, status) => {
      setDonorAvailability((prev) => ({ ...prev, [donorId]: status }));
    },
    []
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback((role?: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (!role || n.targetRole === 'all' || !n.targetRole || n.targetRole === role) {
          return { ...n, read: true };
        }
        return n;
      })
    );
  }, []);

  const unreadCount = useCallback(
    (role?: string) =>
      notifications.filter(
        (n) => !n.read && (!role || n.targetRole === 'all' || !n.targetRole || n.targetRole === role)
      ).length,
    [notifications]
  );

  return (
    <SOSContext.Provider
      value={{
        sosRequests,
        notifications,
        donorAvailability,
        createSOS,
        getSOSById,
        acceptSOS,
        declineSOS,
        updateSOSStage,
        toggleAvailability,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
      }}
    >
      {children}
    </SOSContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSOS() {
  const context = useContext(SOSContext);
  if (!context) throw new Error('useSOS must be used within SOSProvider');
  return context;
}
