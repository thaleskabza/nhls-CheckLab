// apps/packages/ui/components/QuestionEditor.tsx
"use client";

export function QuestionEditor({ 
  q, 
  value, 
  comment, 
  dueDate,
  onChange, 
  onCommentChange,
  onDueDateChange 
}: { 
  q: { code: string; prompt: string };
  value?: "Y" | "N" | "NA";
  comment?: string;
  dueDate?: string;
  onChange: (v: "Y" | "N" | "NA") => void;
  onCommentChange?: (c: string) => void;
  onDueDateChange?: (d: string) => void;
}) {
  const showCorrectiveAction = value === "N";

  return (
    <div className="border-b py-4">
      <div className="flex items-start gap-4">
        <span className="font-mono text-sm text-gray-600 min-w-[3rem] font-semibold">
          {q.code}
        </span>
        <div className="flex-1">
          <p className="text-sm mb-3 text-gray-800">{q.prompt}</p>
          
          {/* Answer Buttons */}
          <div className="flex gap-2 mb-2">
            {(["Y", "N", "NA"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
                  value === opt
                    ? opt === "Y"
                      ? "bg-green-600 text-white shadow-md"
                      : opt === "N"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-gray-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          
          {/* Corrective Action Section (only shows when answer is N) */}
          {showCorrectiveAction && (
            <div className="mt-3 space-y-3 bg-red-50 border border-red-200 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <svg 
                  className="w-5 h-5 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
                <span className="font-semibold text-red-800">
                  Non-Compliance Detected - Corrective Action Required
                </span>
              </div>
              
              <label className="block">
                <span className="text-sm font-medium text-red-800 mb-1 block">
                  Comments / Corrective Action: <span className="text-red-600">*</span>
                </span>
                <textarea
                  value={comment || ""}
                  onChange={(e) => onCommentChange?.(e.target.value)}
                  className="w-full p-3 border border-red-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Describe the non-compliance and required corrective action..."
                  required
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-red-800 mb-1 block">
                  Due Date for Corrective Action: <span className="text-red-600">*</span>
                </span>
                <input
                  type="date"
                  value={dueDate || ""}
                  onChange={(e) => onDueDateChange?.(e.target.value)}
                  className="p-2 border border-red-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}