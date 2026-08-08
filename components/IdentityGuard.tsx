"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRole, Role } from "@/context/RoleContext";

export default function IdentityGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userName, role, isSet, setIdentity } = useRole();

  const [inputName, setInputName] = useState("");
  const [inputRole, setInputRole] = useState<Role>("Faculty");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (userName) setInputName(userName);
    if (role) setInputRole(role);
  }, [userName, role]);

  // Bypass identity check for student public feedback forms
  const isPublicFeedbackPage = pathname.includes("/feedback");

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-900"></div>
      </div>
    );
  }

  if (isPublicFeedbackPage || isSet) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!inputName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setIdentity(inputName, inputRole);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-amber-400 font-extrabold text-2xl flex items-center justify-center mx-auto border border-indigo-800 shadow-sm">
          ST
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Welcome to SOE Portal
        </h1>
        <p className="text-xs text-slate-500">
          St Aloysius (Deemed to be University) — School of Engineering, Mangaluru
        </p>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-xs font-semibold text-indigo-900 text-center">
        Enter your name and role to access the event management workspace.
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-medium text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Your Full Name *
          </label>
          <input
            type="text"
            required
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="e.g. Dr. Rio D'Souza or Priya Nair"
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Role *
          </label>
          <select
            value={inputRole}
            onChange={(e) => setInputRole(e.target.value as Role)}
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="Faculty">Faculty Advisor</option>
            <option value="Dean">Dean, SOE</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-amber-400 font-extrabold rounded-xl text-sm transition-all shadow-md transform hover:-translate-y-0.5"
        >
          Set Identity &amp; Continue &rarr;
        </button>
      </form>
    </div>
  );
}
