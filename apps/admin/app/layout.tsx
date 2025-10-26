// apps/admin/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NHLS Admin Portal",
  description: "National Health Laboratory Service - Administrative Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        {/* NHLS Header */}
        <header className="bg-white border-b-4 border-green-600 shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-4">
                <img
                  src="https://www.nhls.ac.za/wp-content/uploads/2018/08/Logo_NHLS.png"
                  alt="National Health Laboratory Service Logo"
                  className="h-16 w-auto hidden md:block"
                />
                <img
                  src="https://www.nhls.ac.za/wp-content/uploads/2018/10/favicon-32x32.png"
                  alt="NHLS Logo"
                  className="h-8 w-auto md:hidden"
                />
                <div>
                  <h1 className="text-xl font-bold text-green-700">
                    Admin Portal
                  </h1>
                  <p className="text-sm text-gray-600">
                    Waste Management System
                  </p>
                </div>
              </Link>
              
              <nav className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="px-4 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/docs"
                  className="px-4 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium text-sm"
                >
                  API Docs
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <img
                  src="https://www.nhls.ac.za/wp-content/uploads/2018/08/Logo_NHLS.png"
                  alt="NHLS Logo"
                  className="h-12 w-auto mb-4 brightness-0 invert"
                />
                <p className="text-sm text-gray-400">
                  National Health Laboratory Service
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="/admin" className="hover:text-white">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/docs" className="hover:text-white">
                      API Documentation
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="https://www.nhls.ac.za" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      NHLS Website
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Admin Portal</h3>
                <p className="text-sm text-gray-400">
                  For administrative access and system management.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} National Health Laboratory Service. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}