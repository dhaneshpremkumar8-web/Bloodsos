import { useMemo, useState } from 'react';
import { Siren, Filter, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import SOSCard from '@/components/SOSCard';
import { useSOS } from '@/context/SOSContext';
import { bloodGroups } from '@/data/mockData';
import { classNames } from '@/utils/helpers';
import type { UrgencyLevel } from '@/types';

type FilterStatus = 'all' | 'active' | 'fulfilled';

export default function SOSBoardPage() {
  const { sosRequests } = useSOS();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'all'>('all');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all');

  const filteredRequests = useMemo(() => {
    let result = sosRequests;
    if (statusFilter !== 'all') {
      result = result.filter((s) => s.status === statusFilter);
    }
    if (urgencyFilter !== 'all') {
      result = result.filter((s) => s.urgency === urgencyFilter);
    }
    if (bloodGroupFilter !== 'all') {
      result = result.filter((s) => s.bloodGroup === bloodGroupFilter);
    }
    return result;
  }, [sosRequests, statusFilter, urgencyFilter, bloodGroupFilter]);

  const activeCount = sosRequests.filter((s) => s.status === 'active').length;

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">SOS Board</h1>
          <p className="mt-1 text-sm text-gray-600">
            All active and recent emergency blood requests.
          </p>
        </div>
        <Link to="/sos/create" className="btn-danger">
          <PlusCircle className="h-4 w-4" />
          Create SOS
        </Link>
      </div>

      {/* Summary Banner */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-accent-200 bg-accent-50 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-600">
          <Siren className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-accent-900">
            {activeCount} active emergency request{activeCount !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-accent-700">Monitor and respond to SOS alerts in real-time.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6 p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="input-field text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Urgency</label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value as UrgencyLevel | 'all')}
              className="input-field text-sm"
            >
              <option value="all">All Urgency</option>
              <option value="critical">Critical</option>
              <option value="urgent">Urgent</option>
              <option value="moderate">Moderate</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Blood Group</label>
            <select
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
              className="input-field text-sm"
            >
              <option value="all">All Groups</option>
              {bloodGroups.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <p className="mb-4 text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{filteredRequests.length}</span> request{filteredRequests.length !== 1 ? 's' : ''}
      </p>

      {filteredRequests.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-12 text-center">
          <Siren className="h-12 w-12 text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-600">No SOS requests found</p>
          <p className="mt-1 text-xs text-gray-400">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((sos) => (
            <SOSCard key={sos.id} sos={sos} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
