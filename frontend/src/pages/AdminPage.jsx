import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, FileText, Search } from 'lucide-react';
import api from '../api';


const STATUSES = ['submitted', 'under_review', 'approved', 'rejected', 'disbursed'];

const AdminPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      setApplications(await api.getAdminApplications());
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Could not load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const filteredApps = useMemo(() => applications.filter((application) => (
    application.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || application.scheme_name.toLowerCase().includes(searchTerm.toLowerCase())
  )), [applications, searchTerm]);

  const verifyDocument = async (applicationId, documentId) => {
    try {
      await api.verifyDocument(documentId);
      await fetchApplications();
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Could not verify the document.');
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await api.updateApplicationStatus(applicationId, status);
      await fetchApplications();
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Could not update application status.');
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><h1 className="text-3xl font-bold text-gray-900">Admin portal</h1><p className="mt-1 text-gray-500">Review saved scholarship applications and their document verification status.</p></div>
          <div className="relative"><Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input type="search" placeholder="Search applications…" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 md:w-72" /></div>
        </div>
        {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {loading ? <div className="grid h-64 place-items-center text-gray-500">Loading applications…</div> : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600"><tr><th className="px-5 py-4">Applicant</th><th className="px-5 py-4">Scholarship</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Documents</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.map((application) => (
                  <tr key={application.id} className="align-top">
                    <td className="px-5 py-4"><p className="font-medium text-gray-900">{application.student_name}</p><p className="mt-1 text-xs text-gray-500">{application.student_email}</p></td>
                    <td className="px-5 py-4"><p className="font-medium text-indigo-700">{application.scheme_name}</p><p className="mt-1 text-xs text-gray-500">Match: {application.match_score}%</p></td>
                    <td className="px-5 py-4"><select value={application.status === 'recommended' ? 'submitted' : application.status} onChange={(event) => updateStatus(application.id, event.target.value)} disabled={application.status === 'recommended'} className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50">{STATUSES.map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select></td>
                    <td className="space-y-2 px-5 py-4">{application.documents.length ? application.documents.map((document) => <div key={document.id} className="flex min-w-64 items-center justify-between rounded border bg-gray-50 p-2"><span className="flex items-center text-gray-700"><FileText className="mr-2 h-4 w-4 text-gray-400" />{document.doc_type.replaceAll('_', ' ')}</span>{document.is_verified ? <span className="flex items-center text-xs font-medium text-green-700"><CheckCircle className="mr-1 h-3.5 w-3.5" />Verified</span> : <button onClick={() => verifyDocument(application.id, document.id)} className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100">Verify</button>}</div>) : <span className="text-xs text-gray-500">No uploaded documents</span>}</td>
                  </tr>
                ))}
                {filteredApps.length === 0 && <tr><td colSpan="4" className="px-5 py-12 text-center text-gray-500">No applications found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
