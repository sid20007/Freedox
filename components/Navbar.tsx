"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole, Role } from "@/context/RoleContext";

export default function Navbar() {
  const { role, setRole } = useRole();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-900 flex items-center justify-center text-amber-400 font-extrabold text-xl shadow-sm border border-indigo-800">
              ST
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                St Aloysius (Deemed to be University)
              </span>
              <span className="text-[11px] font-semibold text-indigo-700 block tracking-wide">
                School of Engineering, Mangaluru
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-slate-100 text-indigo-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/events"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/events")
                  ? "bg-slate-100 text-indigo-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              All Events
            </Link>
            <Link
              href="/events/new"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/events/new")
                  ? "bg-indigo-50 text-indigo-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              + Propose Event
            </Link>
          </nav>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1 hidden sm:inline">
              Role:
            </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="bg-white text-slate-800 text-xs sm:text-sm font-semibold rounded-lg px-2.5 py-1 border border-slate-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Faculty">Faculty Advisor</option>
              <option value="Dean">Dean, SOE</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
