import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, MapPin, Image, Download } from 'lucide-react';
import { auditDestinations, getAuditSummary, generateMissingImagesReport } from '@/utils/destinationAudit';

export const DestinationAuditPanel = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [auditResults, setAuditResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const runAudit = () => {
    const results = auditDestinations();
    const summaryData = getAuditSummary();
    setAuditResults(results);
    setSummary(summaryData);
    setShowPanel(true);
  };

  const downloadReport = () => {
    const report = generateMissingImagesReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'destination-audit-report.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const missingImages = auditResults.filter(r => !r.hasImage);

  if (!showPanel) {
    return (
      <button
        onClick={runAudit}
        className="fixed bottom-20 right-6 bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-full shadow-lg transition-colors z-50"
        title="Run Destination Audit"
      >
        <AlertTriangle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Image className="w-6 h-6 text-orange-400" />
              Destination Image Audit
            </h2>
            <button
              onClick={() => setShowPanel(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="p-6 border-b border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-800 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-white">{summary.total}</div>
                <div className="text-slate-400 text-sm">Total Destinations</div>
              </div>
              <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-400">{summary.missingImages}</div>
                <div className="text-slate-400 text-sm">Missing Images</div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-500/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-400">{summary.missingCoordinates}</div>
                <div className="text-slate-400 text-sm">Missing Coordinates</div>
              </div>
              <div className="bg-green-900/20 border border-green-500/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">{summary.completionRate}%</div>
                <div className="text-slate-400 text-sm">Completion Rate</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          </div>
        )}

        {/* Missing Images List */}
        <div className="p-6 overflow-y-auto max-h-96">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Destinations Missing Images ({missingImages.length})
          </h3>
          
          <div className="space-y-3">
            {missingImages.map((dest, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{dest.destination}</h4>
                  <div className="flex gap-2">
                    {dest.hasCoordinates ? (
                      <div title="Has coordinates">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                    ) : (
                      <div title="Missing coordinates">
                        <MapPin className="w-4 h-4 text-red-400" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-slate-400 mb-2">
                  Current: <code className="bg-slate-700 px-2 py-1 rounded">{dest.currentImage}</code>
                </div>
                
                {dest.hasCoordinates && (
                  <div className="text-sm text-slate-400 mb-2">
                    <div className="mb-1">Suggested static map:</div>
                    <code className="bg-slate-700 px-2 py-1 rounded text-xs break-all block">
                      {dest.suggestedStaticMap}
                    </code>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {dest.issues.map((issue, i) => (
                    <span key={i} className="bg-red-900/20 text-red-300 text-xs px-2 py-1 rounded-full">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};