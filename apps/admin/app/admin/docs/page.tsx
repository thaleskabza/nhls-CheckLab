// apps/admin/app/admin/docs/page.tsx
"use client";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
          <p className="text-green-100">
            Complete API reference for the NHLS Waste Management System
          </p>
        </div>
      </div>

      {/* Swagger UI */}
      <div className="bg-white">
        <SwaggerUI 
          url="/api/docs"
          docExpansion="list"
          defaultModelsExpandDepth={1}
        />
      </div>
    </div>
  );
}