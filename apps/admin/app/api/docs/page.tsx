"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function Docs() {
  return <div className="bg-white"><SwaggerUI url="/api/docs" /></div>;
}
