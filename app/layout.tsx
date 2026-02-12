import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tasks Generator – Mini Planning Tool",
  description: "AI-powered feature planning tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-black text-white min-h-screen">

          {/* Navigation */}
          <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
            <Link href="/" className="text-lg font-bold hover:text-gray-300">
              Tasks Generator
            </Link>

            <div className="flex gap-6 text-sm">
              <Link href="/" className="hover:text-gray-400">
                Home
              </Link>
              <Link href="/status" className="hover:text-gray-400">
                System Status
              </Link>
            </div>
          </nav>

          {/* Page Content */}
          <div className="py-8">
            {children}
          </div>

        </div>
      </body>
    </html>
  );
}
