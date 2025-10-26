// apps/client/app/checklist/[id]/ChecklistClient.tsx
"use client";

import useSWR from "swr";
import { useState } from "react";
import { QuestionEditor } from "@ui/components/QuestionEditor";

const fetcher = (u: string) => fetch(u).then(r => r.json());

interface AnswerData {
  answer: "Y" | "N" | "NA";
  comment?: string;
  dueDate?: string;
}

export default function ChecklistClient({ checklistId }: { checklistId: string }) {
  const { data, mutate } = useSWR(`/api/checklists/${checklistId}`, fetcher);
  const [answers, setAnswers] = useState<Record<string, AnswerData>>({});
  const [saving, setSaving] = useState(false);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading checklist...</p>
        </div>
      </div>
    );
  }

  const { definition, version, status, labName, labId } = data;

  function updateAnswer(code: string, field: keyof AnswerData, value: any) {
    setAnswers(prev => ({
      ...prev,
      [code]: { ...prev[code], [field]: value }
    }));
  }

  async function saveSection(sectionCode: "A" | "B" | "C") {
    setSaving(true);
    
    const items = Object.entries(answers)
      .filter(([k]) => k.startsWith(sectionCode))
      .map(([q, data]) => ({ 
        sectionCode, 
        questionCode: q, 
        answer: data.answer,
        comment: data.comment || null,
        dueDate: data.dueDate || null
      }));

    const invalidNAnswers = items.filter(
      item => item.answer === "N" && (!item.comment || !item.dueDate)
    );

    if (invalidNAnswers.length > 0) {
      alert("⚠️ Please provide comments and due dates for all non-compliant (N) answers.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/checklists/${checklistId}/answers`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ 
          checklistId: checklistId, 
          expectedVersion: version, 
          items 
        })
      });
      
      if (res.status === 409) { 
        alert("⚠️ Version conflict. The checklist was modified by someone else. Refreshing..."); 
        location.reload(); 
        return; 
      }

      // Try to get error details
      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Save failed:", responseData);
        alert(`❌ Failed to save section: ${responseData.error || responseData.details || 'Unknown error'}`);
        setSaving(false);
        return;
      }
      
      await mutate();
      setSaving(false);
      alert(`✅ Section ${sectionCode} saved successfully!`);
    } catch (error) {
      console.error("Network error:", error);
      alert("❌ Network error. Please check your connection and try again.");
      setSaving(false);
    }
  }

  const answeredCount = (sectionCode: string) => {
    return Object.keys(answers).filter(k => k.startsWith(sectionCode) && answers[k]?.answer).length;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      DRAFT: "nhls-badge-draft",
      REVIEW: "nhls-badge-review",
      FINAL: "nhls-badge-final",
      LOCKED: "nhls-badge-final"
    };
    return badges[status as keyof typeof badges] || "nhls-badge-draft";
  };

  return (
    <div className="nhls-container py-8 mb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="nhls-card mb-8">
          <div className="nhls-section-header">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-4 rounded-lg">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">
                  {definition.title}
                </h1>
                <p className="text-green-100 mt-1">NHLS Waste Management Compliance Assessment</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Laboratory</p>
                    <p className="font-semibold text-gray-900">{labName || "Unknown Lab"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Lab ID</p>
                    <p className="font-mono text-xs text-gray-700">{labId}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={getStatusBadge(status)}>{status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Version</p>
                    <p className="font-semibold text-gray-900">{version}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Purpose:</span> To assess the health care waste management system
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Compliance Standards:</span> {definition.policies.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="nhls-card mb-8 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Answer Key
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <span className="px-4 py-2 bg-green-600 text-white rounded font-bold">Y</span>
              <span className="text-gray-700"><strong>Yes</strong> = Compliant with GPS0061</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <span className="px-4 py-2 bg-red-600 text-white rounded font-bold">N</span>
              <span className="text-gray-700"><strong>No</strong> = Not-Compliant (requires action)</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="px-4 py-2 bg-gray-600 text-white rounded font-bold">NA</span>
              <span className="text-gray-700"><strong>Not Applicable</strong> to facility</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        {definition.sections.map((s: any) => {
          const answered = answeredCount(s.code);
          const total = s.items.length;
          const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

          return (
            <section key={s.code} className="nhls-card mb-8">
              {/* Section Header */}
              <div className="bg-green-50 border-b-2 border-green-600 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-bold text-green-700">
                    {s.code}. {s.title}
                  </h2>
                  <div className="text-sm text-gray-600 text-right">
                    <div className="font-semibold text-lg text-green-700">
                      {answered} / {total}
                    </div>
                    <div className="text-xs text-gray-500">questions answered</div>
                  </div>
                </div>
                {progress > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-green-700">{progress}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Questions */}
              <div className="p-6">
                <div className="space-y-1">
                  {s.items.map((q: any) => (
                    <QuestionEditor
                      key={q.code}
                      q={q}
                      value={answers[q.code]?.answer}
                      comment={answers[q.code]?.comment}
                      dueDate={answers[q.code]?.dueDate}
                      onChange={(v) => updateAnswer(q.code, 'answer', v)}
                      onCommentChange={(c) => updateAnswer(q.code, 'comment', c)}
                      onDueDateChange={(d) => updateAnswer(q.code, 'dueDate', d)}
                    />
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="bg-gray-50 border-t border-gray-200 p-6">
                <button
                  onClick={() => saveSection(s.code)}
                  disabled={saving || answered === 0}
                  className="nhls-button-primary w-full md:w-auto px-12 py-4 text-lg"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    `Save Section ${s.code}`
                  )}
                </button>
                {answered === 0 && (
                  <p className="text-sm text-gray-500 mt-3">
                    Answer at least one question to enable saving
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}