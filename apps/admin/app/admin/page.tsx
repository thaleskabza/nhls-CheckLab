// apps/admin/app/admin/page.tsx
export default function AdminHome(){
  return (
    <div>
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <ul className="list-disc pl-6">
        <li><a className="text-blue-700 underline" href="/api/check">Ping API</a></li>
        <li><a className="text-blue-700 underline" href="/admin/docs">API Docs</a></li>
        <li><a className="text-blue-700 underline" href="/api/stats">Admin Stats</a></li>
        <li><a className="text-blue-700 underline" href="/api/reports/executive">Executive Report</a></li>
      </ul>
    </div>
  );
}