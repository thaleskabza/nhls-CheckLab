"use client";
import { useState } from "react";
const seedDef = { title:"Waste Generator Site Inspection", policies:["GPS0061","GPS0055"],
  sections:[
    { code:"A", title:"MANAGEMENT, POLICY AND TRAINING", items:[{code:"A1",prompt:"HCWO appointed in writing?"},{code:"A2",prompt:"HCWO trained?"}]},
    { code:"B", title:"PRACTICE AND PROCEDURES IN MANAGEMENT OF HCW", items:[{code:"B1",prompt:"Segregation at point of generation?"}]},
    { code:"C", title:"WASTE STORAGE AREAS", items:[{code:"C1",prompt:"Separate storage areas for general waste?"}]}
  ]};
export default function StartChecklist(){
  const [creating,setCreating]=useState(false);
  const [labId,setLabId]=useState("264e3577-7708-4a0c-bbd9-c909d9f4edfb");
  async function onStart(){
    setCreating(true);
    const res = await fetch("/api/checklists", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ labId }) });
    const data = await res.json(); setCreating(false);
    if (data.ok && data.checklistId) location.href=`/checklist/${data.checklistId}`;
    else if (data.reason==="ActiveChecklistExists") location.href=`/checklist/${data.checklistId}`;
    else alert("Unable to create checklist");
  }
  return <div className="max-w-xl space-y-4">
    <p className="text-sm">You can only work on <b>one checklist at a time</b>.</p>
    <label className="block">Lab ID<input value={labId} onChange={e=>setLabId(e.target.value)} className="border p-2 w-full" /></label>
    <button onClick={onStart} disabled={creating} className="px-4 py-2 rounded text-white" style={{ background:"var(--nhls-primary)" }}>{creating?"Creating...":"Start Checklist"}</button>
  </div>;
}
