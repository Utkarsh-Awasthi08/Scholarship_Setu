import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Award } from 'lucide-react';

const ScholarshipCard = ({ scholarship, compact = false }) => {
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border bg-[#fffdfa] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${(scholarship.unlockedBy || scholarship.unlocked_by) ? 'border-[#f1c65b]' : 'border-[#e6e3dc]'}`}>
      {(scholarship.unlockedBy || scholarship.unlocked_by) && (
        <div className="flex items-center bg-gradient-to-r from-[#f8d66c] to-[#f4bf4e] px-4 py-2 text-xs font-bold text-[#60470d]">
          <Award className="w-3.5 h-3.5 mr-1" /> Unlocked by {scholarship.unlockedBy || scholarship.unlocked_by}
        </div>
      )}
      
      <div className={`flex-1 p-5 ${compact ? 'pb-4' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            (scholarship.type || scholarship.level) === 'State' || (scholarship.type || scholarship.level) === 'state' ? 'bg-[#e3f3f1] text-[#11766e]' : 'bg-[#eeeaff] text-[#5544d3]'
          }`}>
            {(scholarship.type || scholarship.level)} Scheme
          </span>
          {(scholarship.matchScore || scholarship.match_score) && (
            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-500 mr-2">Match</span>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getScoreColor(scholarship.matchScore || scholarship.match_score)}`} 
                  style={{ width: `${scholarship.matchScore || scholarship.match_score}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold ml-2">{scholarship.matchScore || scholarship.match_score}%</span>
            </div>
          )}
        </div>
        
        <h3 className={`${compact ? 'text-lg' : 'text-xl'} mb-1 font-bold text-[#19263a]`}>{scholarship.name}</h3>
        <p className="mb-4 text-sm text-slate-500">By {scholarship.provider || scholarship.department}</p>
        
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Amount</p>
            <p className="text-xl font-bold text-[#168279]">{scholarship.amount || scholarship.amount_description}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500">Deadline</p>
            <p className="text-sm font-medium text-[#344158]">{scholarship.deadline || 'Check portal'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {(() => {
            const tags = scholarship.eligibility || [];
            if (!scholarship.eligibility) {
              if (scholarship.eligibility_category && scholarship.eligibility_category !== 'All') tags.push(scholarship.eligibility_category);
              if (scholarship.eligibility_gender && scholarship.eligibility_gender !== 'All') tags.push(scholarship.eligibility_gender);
              if (scholarship.min_12th_percentage) tags.push(`${scholarship.min_12th_percentage}% in 12th`);
              if (scholarship.max_family_income) tags.push(`Income < ${(scholarship.max_family_income/100000).toFixed(1)}L`);
              if (scholarship.is_for_mp_only) tags.push('MP Domicile');
            }
            return (
              <>
                {tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="rounded-md bg-[#f0eee8] px-2 py-1 text-xs text-[#596579]">
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="rounded-md bg-[#f0eee8] px-2 py-1 text-xs text-[#596579]">+{tags.length - 3}</span>
                )}
              </>
            );
          })()}
        </div>

        {expanded && (
          <div className="mt-2 border-t border-[#ebe8e0] pt-3 text-sm text-slate-600">
            <p>{scholarship.description}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#ebe8e0] bg-[#faf9f5] px-5 py-3">
        {compact ? (
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="flex items-center text-sm font-semibold text-[#5d4ee4] hover:text-[#4334bc]"
          >
            {expanded ? (
              <>Less details <ChevronUp className="w-4 h-4 ml-1" /></>
            ) : (
              <>More details <ChevronDown className="w-4 h-4 ml-1" /></>
            )}
          </button>
        ) : (
          <button onClick={() => setExpanded(!expanded)} className="bg-transparent text-sm font-semibold text-[#5d4ee4] hover:text-[#4334bc]">
            {expanded ? 'Hide Details' : 'View Details'}
          </button>
        )}
        <a href={scholarship.application_url} target="_blank" rel="noreferrer" className="flex items-center rounded-lg bg-[#5d4ee4] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4d3ed2]">
          Official portal <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
        </a>
      </div>
    </div>
  );
};

export default ScholarshipCard;
