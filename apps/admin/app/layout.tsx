// apps/admin/app/layout.tsx
import "./globals.css";            
import "@ui/theme/nhls.css";         // keep if alias is set (see step 2)

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="p-4 border-b bg-white">
          <h1 className="text-xl font-semibold">NHLS Admin</h1>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
