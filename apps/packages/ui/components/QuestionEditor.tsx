"use client";
type Props = { q:{code:string; prompt:string}; value?: "Y"|"N"|"NA"; onChange:(v:"Y"|"N"|"NA")=>void };
export function QuestionEditor({ q, value, onChange }: Props) {
  return (
    <div className="rounded-md border p-3 mb-3 bg-white" style={{ borderColor: "var(--nhls-line)" }}>
      <div className="font-medium">{q.code}. {q.prompt}</div>
      <div className="mt-2 flex gap-2">
        {(["Y","N","NA"] as const).map(a => (
          <button key={a} className="px-3 py-1 border rounded"
            style={{ borderColor:"var(--nhls-line)", background: value===a?"var(--nhls-accent)":"#fff", color: value===a?"#fff":"var(--nhls-ink)" }}
            onClick={()=>onChange(a)} type="button">{a}</button>
        ))}
      </div>
    </div>
  );
}
