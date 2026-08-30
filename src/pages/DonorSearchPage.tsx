import { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import DonorCard from '@/components/DonorCard';
import Spinner from '@/components/Spinner';
import { mockDonors } from '@/data/mockData';
import { bloodGroups } from '@/data/mockData';
import { classNames } from '@/utils/helpers';
import type { Donor } from '@/types';

export default function DonorSearchPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    bloodGroup: 'all',
    availability: 'all',
    maxDistance: 50,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setDonors(mockDonors);
    setLoading(false);
  }, []);

  const filteredDonors = useMemo(() => {
    let result = donors;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) => d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q)
      );
    }
    if (filters.bloodGroup !== 'all') {
      result = result.filter((d) => d.bloodGroup === filters.bloodGroup);
    }
    if (filters.availability !== 'all') {
      result = result.filter((d) => d.availability === filters.availability);
    }
    result = result.filter((d) => d.distance <= filters.maxDistance);
    return result;
  }, [donors, search, filters]);

  const activeFilterCount =
    (filters.bloodGroup !== 'all' ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.maxDistance < 50 ? 1 : 0);

  const clearFilters = () => {
    setFilters({ bloodGroup: 'all', availability: 'all', maxDistance: 50 });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Donor Search</h1>
        <p className="mt-1 text-sm text-gray-600">
          Find compatible blood donors near you with AI-powered matching.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or location..."
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={classNames(
              'btn-secondary relative',
              showFilters && 'border-primary-400 bg-primary-50 text-primary-700'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Blood Group</label>
              <select
                value={filters.bloodGroup}
                onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                className="input-field text-sm"
              >
                <option value="all">All Groups</option>
                {bloodGroups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="input-field text-sm"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Max Distance: {filters.maxDistance} km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={filters.maxDistance}
                onChange={(e) => setFilters({ ...filters, maxDistance: Number(e.target.value) })}
                className="w-full accent-primary-600"
              />
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary-600">
                <X className="h-3 w-3" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{filteredDonors.length}</span> donors found
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" label="Finding donors..." />
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-12 text-center">
          <Search className="h-12 w-12 text-gray-300" />
          <p className="mt-4 text-sm font-medium text-gray-600">No donors match your filters</p>
          <p className="mt-1 text-xs text-gray-400">Try adjusting your search criteria.</p>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="btn-secondary mt-4 text-xs">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDonors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} showMatchScore={false} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
