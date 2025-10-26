// apps/admin/app/admin/docs/page.tsx
"use client";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function DocsPage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <SwaggerUI 
        url="/api/docs"
        docExpansion="list"
        defaultModelsExpandDepth={1}
      />
    </div>
  );
}