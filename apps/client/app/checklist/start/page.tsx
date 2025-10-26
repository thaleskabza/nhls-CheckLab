// apps/client/app/checklist/start/page.tsx
"use client";

import { useState, useEffect } from "react";

export default function StartChecklist() {
  const [creating, setCreating] = useState(false);
  const [labId, setLabId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [labs, setLabs] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingLabs, setLoadingLabs] = useState(true);

  useEffect(() => {
    async function loadLabs() {
      try {
        const res = await fetch("/api/labs");
        if (res.ok) {
          const data = await res.json();
          setLabs(data);
          if (data.length > 0 && !labId) {
            setLabId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load labs:", err);
      } finally {
        setLoadingLabs(false);
      }
    }
    loadLabs();
  }, []);

  async function onStart() {
    if (!labId) {
      setError("Please select a laboratory");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/checklists", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ labId })
      });

      const data = await res.json();

      if (data.ok && data.checklistId) {
        window.location.href = `/checklist/${data.checklistId}`;
      } else if (data.reason === "ActiveChecklistExists") {
        window.location.href = `/checklist/${data.checklistId}`;
      } else {
        setError("Unable to create checklist. Please try again.");
        setCreating(false);
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setCreating(false);
    }
  }

  return (
    <div className="nhls-container py-12">
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Waste Generator Site Inspection
          </h1>
          <p className="text-xl text-gray-600">
            NHLS Waste Management Compliance Assessment
          </p>
        </div>

        {/* Main Card */}
        <div className="nhls-card">
          {/* Notice Banner */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">Important Notice</h3>
                <div className="text-sm text-yellow-700 space-y-1">
                  <p>• You can work on <strong>one checklist per laboratory</strong> at a time</p>
                  <p>• If you have an existing draft, you will continue from where you left off</p>
                  <p>• All progress is automatically saved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Laboratory <span className="text-red-500">*</span>
                </label>
                {loadingLabs ? (
                  <div className="flex items-center justify-center gap-3 py-8 text-gray-500">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading laboratories...</span>
                  </div>
                ) : labs.length > 0 ? (
                  <select
                    value={labId}
                    onChange={(e) => setLabId(e.target.value)}
                    className="nhls-input text-base"
                    disabled={creating}
                  >
                    <option value="">-- Select a laboratory --</option>
                    {labs.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-sm text-red-800 font-semibold mb-3">
                      No laboratories available
                    </p>
                    <p className="text-sm text-red-700 mb-4">
                      Please contact your system administrator to add laboratories.
                    </p>
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900 mb-2">
                        Manual Entry (Testing Only)
                      </summary>
                      <input
                        type="text"
                        value={labId}
                        onChange={(e) => setLabId(e.target.value)}
                        className="nhls-input text-sm"
                        placeholder="Enter Lab UUID"
                        disabled={creating}
                      />
                    </details>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={onStart}
                disabled={creating || !labId}
                className="nhls-button-primary w-full text-lg py-4"
              >
                {creating ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Checklist...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Start Checklist
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-gray-50 border-t border-gray-200 p-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About This Checklist
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Compliance assessment for NHLS Waste Management Policy (GPS0061) and GPS0055</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>49 comprehensive questions across 3 key sections</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Progress saved automatically - work at your own pace</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Non-compliance items require corrective actions and due dates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}