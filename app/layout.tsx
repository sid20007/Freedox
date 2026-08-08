import "./globals.css";
import { RoleProvider } from "@/context/RoleContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Event Proposal to Post-Event Reporting Portal",
  description:
    "University event lifecycle management portal for proposal, approval, execution, and post-event reporting.",
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
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-sm text-slate-500">
            Event Management Portal &copy; {new Date().getFullYear()} — University Hackathon MVP
          </footer>
        </RoleProvider>
      </body>
    </html>
  );
}
