import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplet,
  Building2,
  MapPin,
  Phone,
  AlertCircle,
  ArrowRight,
  Siren,
  Brain,
  CheckCircle,
  Zap,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DonorCard from '@/components/DonorCard';
import { useAuth } from '@/context/AuthContext';
import { useSOS } from '@/context/SOSContext';
import { bloodGroups } from '@/data/mockData';
import { classNames } from '@/utils/helpers';
import type { BloodGroup, UrgencyLevel, Donor, SOSRequest } from '@/types';

const urgencyOptions: { value: UrgencyLevel; label: string; description: string }[] = [
  { value: 'critical', label: 'Critical', description: 'Life-threatening, need blood immediately' },
  { value: 'urgent', label: 'Urgent', description: 'Needed within hours' },
  { value: 'moderate', label: 'Moderate', description: 'Scheduled procedure, needed soon' },
];

export default function CreateSOSPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createSOS } = useSOS();
  const [form, setForm] = useState({
    bloodGroup: '',
    unitsRequired: '1',
    hospital: '',
    location: '',
    contactNumber: '',
    description: '',
    urgency: '' as UrgencyLevel | '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [createdSOS, setCreatedSOS] = useState<SOSRequest | null>(null);
  const [matchedDonors, setMatchedDonors] = useState<Donor[]>([]);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.bloodGroup) e.bloodGroup = 'Select blood group required';
    if (!form.unitsRequired || Number(form.unitsRequired) < 1) e.unitsRequired = 'At least 1 unit required';
    if (!form.hospital.trim()) e.hospital = 'Hospital name is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.contactNumber.trim()) e.contactNumber = 'Contact number is required';
    else if (!/^[+\d\s()-]{10,}$/.test(form.contactNumber)) e.contactNumber = 'Enter a valid phone number';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.urgency) e.urgency = 'Select urgency level';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const sos = createSOS({
        requesterName: user?.name ?? 'Unknown Requester',
        requesterId: user?.id ?? 'u1',
        bloodGroup: form.bloodGroup as BloodGroup,
        unitsRequired: Number(form.unitsRequired),
        hospital: form.hospital,
        location: form.location,
        contactNumber: form.contactNumber,
        description: form.description,
        urgency: form.urgency as UrgencyLevel,
      });
      setCreatedSOS(sos);
      setMatchedDonors(sos.matchedDonors ?? []);
    } finally {
      setSubmitting(false);
    }
  };

  if (createdSOS) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-4xl">
          {/* Success Banner */}
          <div className="card border-success-200 bg-success-50 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-100">
              <CheckCircle className="h-7 w-7 text-success-600" />
            </div>
            <h1 className="mt-4 font-display text-xl font-bold text-gray-900">SOS Request Created!</h1>
            <p className="mt-1 text-sm text-gray-600">
              Your emergency request has been broadcast. Our AI found {matchedDonors.length} matching donors.
            </p>
          </div>

          {/* AI Match Results */}
          <div className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
                <Brain className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">AI Matched Donors</h2>
                <p className="text-xs text-gray-500">Ranked by distance, availability, reliability, and eligibility</p>
              </div>
              <span className="ml-auto flex items-center gap-1 rounded-full bg-success-50 px-3 py-1 text-xs font-semibold text-success-700">
                <Zap className="h-3 w-3" />
                {matchedDonors.length} matches found
              </span>
            </div>

            {matchedDonors.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-sm text-gray-500">No compatible donors available right now. We'll keep searching.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {matchedDonors.map((donor) => (
                  <DonorCard key={donor.id} donor={donor} showMatchScore />
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => navigate(`/sos/${createdSOS.id}`)} className="btn-primary">
              View SOS Details
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => { setCreatedSOS(null); setMatchedDonors([]); }} className="btn-secondary">
              Create Another
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900">Create Emergency SOS</h1>
          <p className="mt-1 text-sm text-gray-600">
            Broadcast a blood request to nearby donors. Our AI will match the best donors instantly.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-xl border border-accent-200 bg-accent-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-600">
            <Siren className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-accent-900">Emergency Request</p>
            <p className="text-xs text-accent-700">All fields are required for immediate matching.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Blood Group Required</label>
              <select
                value={form.bloodGroup}
                onChange={(e) => update('bloodGroup', e.target.value)}
                className={classNames('input-field', errors.bloodGroup && 'border-accent-400')}
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.bloodGroup && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.bloodGroup}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Units Required</label>
              <input
                type="number"
                min="1"
                value={form.unitsRequired}
                onChange={(e) => update('unitsRequired', e.target.value)}
                className={classNames('input-field', errors.unitsRequired && 'border-accent-400')}
              />
              {errors.unitsRequired && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.unitsRequired}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Hospital Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.hospital}
                onChange={(e) => update('hospital', e.target.value)}
                placeholder="e.g. Apollo Hospitals, Greams Road"
                className={classNames('input-field pl-10', errors.hospital && 'border-accent-400')}
              />
            </div>
            {errors.hospital && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.hospital}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="e.g. Greams Road, Chennai"
                className={classNames('input-field pl-10', errors.location && 'border-accent-400')}
              />
            </div>
            {errors.location && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.location}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Contact Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={form.contactNumber}
                onChange={(e) => update('contactNumber', e.target.value)}
                placeholder="+91 98765 43210"
                className={classNames('input-field pl-10', errors.contactNumber && 'border-accent-400')}
              />
            </div>
            {errors.contactNumber && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.contactNumber}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              placeholder="Describe the emergency situation and patient condition..."
              className={classNames('input-field resize-none', errors.description && 'border-accent-400')}
            />
            {errors.description && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.description}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Urgency Level</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {urgencyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update('urgency', option.value)}
                  className={classNames(
                    'rounded-lg border-2 p-3 text-left transition-all',
                    form.urgency === option.value
                      ? option.value === 'critical'
                        ? 'border-accent-500 bg-accent-50'
                        : option.value === 'urgent'
                        ? 'border-warning-500 bg-warning-50'
                        : 'border-info-500 bg-info-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{option.description}</p>
                </button>
              ))}
            </div>
            {errors.urgency && <p className="mt-1 flex items-center gap-1 text-xs text-accent-600"><AlertCircle className="h-3 w-3" />{errors.urgency}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-danger w-full">
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating SOS & Matching Donors...
              </>
            ) : (
              <>
                <Siren className="h-4 w-4" />
                Broadcast Emergency SOS
              </>
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
