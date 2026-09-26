import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, FileText, RefreshCw } from 'lucide-react';
import api from '../api';


const LABELS = {
  recommended: 'Recommended',
  submitted: 'Submitted',
  under_review: 'Under review',
  approved: 'Approved',
  rejected: 'Rejected',
  disbursed: 'Disbursed',
};

function StatusBadge({ status }) {
  const color = {
    recommended: 'bg-slate-100 text-slate-700',
    submitted: 'bg-blue-100 text-blue-700',
    under_review: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    disbursed: 'bg-emerald-100 text-emerald-700',
  }[status] || 'bg-gray-100 text-gray-700';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{LABELS[status] || status}</span>;
}

const TrackPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await api.getApplications());
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Could not load your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadApplications(); }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your applications</h1>
          <p className="mt-2 text-gray-600">Review the scholarships you saved and their current processing status.</p>
        </div>
        <button onClick={loadApplications} disabled={loading} className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"><RefreshCw className="mr-2 h-4 w-4" />Refresh</button>
      </div>

      {loading && <div className="grid h-48 place-items-center text-gray-500">Loading applications…</div>}
      {!loading && error && <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>}
      {!loading && !error && data?.applications?.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <FileText className="mx-auto mb-3 h-9 w-9 text-gray-400" />
          <h2 className="font-semibold text-gray-900">No saved applications yet</h2>
          <p className="mt-2 text-sm text-gray-600">Complete the chat, then save a recommended scholarship to begin tracking it here.</p>
        </div>
      )}
      {!loading && !error && data?.applications?.length > 0 && (
        <div className="space-y-5">
          {data.applications.map((application) => (
            <article key={application.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="font-semibold text-indigo-800">{application.scheme}</h2><p className="mt-1 text-xs text-gray-500">Match score: {application.match_score}% · Last updated {new Date(application.updated_at).toLocaleString()}</p></div>
                <StatusBadge status={application.status} />
              </div>
              <div className="px-6 py-5">
                <div className="flex items-start gap-3 text-sm text-gray-700">
                  {['approved', 'disbursed'].includes(application.status) ? <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" /> : <Clock className="mt-0.5 h-5 w-5 text-amber-500" />}
                  <div>
                    <p className="font-medium">{application.status === 'recommended' ? 'Recommendation saved' : `Application ${LABELS[application.status]?.toLowerCase() || application.status}`}</p>
                    <p className="mt-1 text-gray-500">{application.status === 'recommended' ? 'Save this recommendation as an application when you are ready to submit it for review.' : application.status === 'submitted' ? 'Your application is waiting for document review.' : application.status === 'under_review' ? 'A nodal officer is reviewing your application.' : application.rejection_reason || 'We will notify you when the status changes.'}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackPage;
