"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole, Role } from "@/context/RoleContext";

export default function Navbar() {
  const { userName, role, isSet, setIdentity, switchIdentity } = useRole();
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<Role>("Faculty");

  useEffect(() => {
    if (userName) setEditName(userName);
    if (role) setEditRole(role);
  }, [userName, role]);

  const isActive = (path: string) => pathname === path;

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setIdentity(editName, editRole);
    setIsEditing(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Nav links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-900 flex items-center justify-center text-amber-400 font-extrabold text-lg shadow-sm border border-indigo-800">
              ST
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                St Aloysius
              </span>
              <span className="text-[10px] font-semibold text-indigo-700 block tracking-wide">
                School of Engineering
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isActive("/")
                  ? "bg-slate-100 text-indigo-900 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/events"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isActive("/events")
                  ? "bg-slate-100 text-indigo-900 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              All Events
            </Link>
            <Link
              href="/events/new"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isActive("/events/new")
                  ? "bg-indigo-50 text-indigo-900 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              + Propose Event
            </Link>
          </nav>
        </div>

        {/* Identity Bar */}
        <div className="flex items-center space-x-3">
          {isEditing || !isSet ? (
            <form onSubmit={handleSaveIdentity} className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your Name"
                className="w-28 sm:w-36 bg-white px-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as Role)}
                className="bg-white text-xs font-semibold rounded-md px-2 py-1 border border-slate-300 focus:outline-none"
              >
                <option value="Faculty">Faculty</option>
                <option value="Dean">Dean</option>
              </select>
              <button
                type="submit"
                className="bg-indigo-900 text-amber-400 font-bold text-xs px-2.5 py-1 rounded-md hover:bg-indigo-800 transition-colors"
              >
                Set
              </button>
            </form>
          ) : (
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <div className="text-right">
                <span className="text-[11px] font-medium text-slate-500 block">
                  Viewing as:
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {userName} <span className="text-indigo-700 font-semibold">({role})</span>
                </span>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors border border-indigo-100"
              >
                Switch Role
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
