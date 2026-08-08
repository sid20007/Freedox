"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole, Role } from "@/context/RoleContext";

export default function Navbar() {
  const { role, setRole } = useRole();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              E
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Campus Events Portal
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-slate-100 text-indigo-600 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/events"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/events")
                  ? "bg-slate-100 text-indigo-600 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              All Events
            </Link>
            <Link
              href="/events/new"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/events/new")
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              + Propose Event
            </Link>
          </nav>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
              Active Role:
            </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="bg-white text-slate-800 text-sm font-medium rounded-md px-2.5 py-1 border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Faculty">Faculty Advisor</option>
              <option value="Dean">Dean of Student Affairs</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
