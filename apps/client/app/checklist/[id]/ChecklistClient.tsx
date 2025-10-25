"use client";

import useSWR from "swr";
import { useState } from "react";
import { QuestionEditor } from "@ui/components/QuestionEditor";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function ChecklistClient({ checklistId }: { checklistId: string }) {
  const { data, mutate } = useSWR(`/api/checklists/${checklistId}`, fetcher);
  const [answers, setAnswers] = useState<Record<string, "Y"|"N"|"NA">>({});
  const [saving, setSaving] = useState(false);

  if (!data) return <div>Loading...</div>;
  const { definition, version, status } = data;

  async function saveSection(sectionCode: "A"|"B"|"C") {
    setSaving(true);
    const items = Object.entries(answers)
      .filter(([k]) => k.startsWith(sectionCode))
      .map(([q, a]) => ({ sectionCode, questionCode: q, answer: a }));
    const res = await fetch(`/api/checklists/${checklistId}/answers`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ checklistId: checklistId, expectedVersion: version, items })
    });
    if (res.status === 409) { alert("Version conflict. Refreshing..."); location.reload(); return; }
    await mutate();
    setSaving(false);
    alert("Saved.");
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-lg font-semibold">{definition.title}</h2>
      <div className="text-sm mb-4">Status: {status} · Version: {version}</div>
      {definition.sections.map((s: any) => (
        <section key={s.code} className="mb-8">
          <h3 className="font-semibold mb-2">{s.code}. {s.title}</h3>
          {s.items.map((q: any) => (
            <QuestionEditor
              key={q.code}
              q={q}
              value={answers[q.code]}
              onChange={(v) => setAnswers(prev => ({ ...prev, [q.code]: v }))}
            />
          ))}
          <button
            onClick={() => saveSection(s.code)}
            disabled={saving}
            className="px-4 py-2 rounded text-white"
            style={{ background: "var(--nhls-accent)" }}
          >
            Save {s.code}
          </button>
        </section>
      ))}
    </div>
  );
}
