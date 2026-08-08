  import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import Navbar from "@/components/Navbar";
import IdentityGuard from "@/components/IdentityGuard";

export const metadata = {
  title: "Event Management Portal | St Aloysius (Deemed to be University) — School of Engineering",
  description:
    "Event Management Portal for St Aloysius (Deemed to be University) — School of Engineering, Mangaluru — supporting the newly launched School's event lifecycle from proposal to accreditation-ready documentation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <RoleProvider>
          <Navbar />
          <IdentityGuard>
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </IdentityGuard>
          <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">
              St Aloysius (Deemed to be University) — School of Engineering, Mangaluru
            </p>
            <p>
              Supporting event lifecycles from proposal to accreditation-ready documentation. &copy; {new Date().getFullYear()}
            </p>
          </footer>
        </RoleProvider>
      </body>
    </html>
  );
}
