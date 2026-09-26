import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import ScholarshipCard from '../components/ScholarshipCard';
import api from '../api';

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    'All', 'MP Only', 'Central', 'SC/ST', 'OBC', 'General', 'Female Only',
    'NTSE Eligible', 'KVPY Eligible', 'INSPIRE Eligible', 'Sports Quota'
  ];

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.getScholarships();
        setScholarships(res || []);
      } catch (err) {
        console.error('Error fetching scholarships', err);
        setScholarships([]);
        setError('Scholarships could not be loaded. Start the backend and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  const filteredScholarships = scholarships.filter(s => {
    const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (activeFilter === 'All') return true;
    if (activeFilter === 'MP Only') return s.is_for_mp_only;
    if (activeFilter === 'Central') return s.level === 'central';
    if (activeFilter === 'Female Only') return s.eligibility_gender === 'Female';
    if (activeFilter === 'SC/ST') return s.eligibility_category?.includes('SC') || s.eligibility_category?.includes('ST');
    if (activeFilter === 'OBC') return s.eligibility_category?.includes('OBC');
    if (activeFilter === 'General') return s.eligibility_category === 'General' || s.eligibility_category === 'All';
    
    // Achievement filters (check name/description since unlockedBy might not be present on raw schemes list)
    if (activeFilter === 'NTSE Eligible') return s.name?.includes('NTSE') || s.description?.includes('NTSE');
    if (activeFilter === 'KVPY Eligible') return s.name?.includes('KVPY') || s.description?.includes('KVPY');
    if (activeFilter === 'INSPIRE Eligible') return s.name?.includes('INSPIRE') || s.description?.includes('INSPIRE');
    if (activeFilter === 'Sports Quota') return s.name?.includes('Sports') || s.description?.includes('Sports');
    
    return true;
  });

  return (
    <div className="w-full bg-[#f8f7f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
      <div className="mb-8 rounded-[2rem] bg-[#19263a] px-6 py-8 text-white shadow-xl shadow-[#19263a]/10 sm:px-9">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#f7c85b]">Scholarship directory</p>
        <h1 className="font-display text-4xl leading-none sm:text-5xl">Find the right opportunity.</h1>
        <p className="mt-4 max-w-2xl text-slate-300">Explore verified schemes and focus on the ones that make sense for your next step.</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#e6e3dc] bg-[#fffdfa] p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-[#dcd9d1] bg-white py-3 pl-10 pr-3 text-[#19263a] outline-none transition placeholder:text-slate-400 focus:border-[#6858e8] focus:ring-4 focus:ring-[#6858e8]/10"
            placeholder="Search scholarships by name or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2">
          <Filter className="mr-2 h-5 w-5 shrink-0 text-[#5d4ee4]" />
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter 
                  ? 'bg-[#5d4ee4] text-white shadow-md shadow-[#5d4ee4]/20'
                  : 'bg-[#f0eee8] text-[#4f5b6d] hover:bg-[#e6e3dc]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredScholarships.map(scholarship => (
              <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
            ))}
            {filteredScholarships.length === 0 && !error && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No scholarships found matching your criteria.
              </div>
            )}
            {error && <div className="col-span-full py-12 text-center text-gray-500">No verified scholarship records are available while the service is offline.</div>}
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default ScholarshipsPage;
