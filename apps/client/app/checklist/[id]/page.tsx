import ChecklistClient from "./ChecklistClient";

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // 👈 Next 16: params is a Promise
  return <ChecklistClient checklistId={id} />;
}
