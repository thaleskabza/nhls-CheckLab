// apps/client/app/layout.tsx
import "./globals.css";
import "@ui/theme/nhls.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="p-4 border-b bg-white">
          <h1 className="text-xl font-semibold">NHLS Waste Generator Inspection</h1>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
