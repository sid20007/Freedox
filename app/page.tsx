"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import { formatINR } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  budget: number;
  eventType: string;
  status: string;
  approvals: any[];
  reports: any[];
  photos: any[];
}

export default function Dashboard() {
  const { role } = useRole();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmitDraft = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "pending_approval" }),
      });
      if (res.ok) {
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const pendingEvents = events.filter((e) => e.status === "pending_approval");
  const draftEvents = events.filter((e) => e.status === "draft");
  const approvedEvents = events.filter((e) => e.status === "approved");
  const completedEvents = events.filter((e) => e.status === "completed");
  const rejectedEvents = events.filter((e) => e.status === "rejected");

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-800">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center space-x-3">
            <span className="bg-amber-400 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              St Aloysius (Deemed to be University)
            </span>
            <span className="bg-indigo-800/80 text-indigo-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-700">
              {role === "Dean" ? "Dean View" : "Faculty Advisor View"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            School of Engineering — Event Management Portal
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
            Supporting the newly launched School&apos;s event lifecycle from proposal submission to accreditation-ready documentation.
          </p>
        </div>

        <Link
          href="/events/new"
          className="bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold px-5 py-2.5 rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 whitespace-nowrap self-start md:self-auto text-sm"
        >
          + Propose New Event
        </Link>
      </div>

      {/* Role-Specific Banner Sections */}
      {role === "Dean" && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                !
              </div>
              <h2 className="text-xl font-bold text-amber-900">
                Awaiting My Approval ({pendingEvents.length})
              </h2>
            </div>
            <span className="text-xs font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Action Needed (Dean Review)
            </span>
          </div>

          {pendingEvents.length === 0 ? (
            <p className="text-sm text-amber-700 italic">
              No pending event proposals requiring approval at this time.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {evt.eventType}
                      </span>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Pending
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      📍 {evt.venue} | 📅 {new Date(evt.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-semibold text-slate-700 mt-2">
                      Budget: {formatINR(evt.budget)}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Dean Review Needed</span>
                    <Link
                      href={`/events/${evt.id}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Review Proposal &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {role === "Faculty" && (
        <div className="space-y-6">
          {/* Action Required: Draft Events */}
          {draftEvents.length > 0 && (
            <div className="bg-slate-100 border border-slate-300 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-slate-600"></span>
                <h2 className="text-xl font-bold text-slate-900">
                  My Events — Action Required: Draft Events ({draftEvents.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {draftEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {evt.eventType}
                        </span>
                        <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                          Draft
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900">{evt.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        📍 {evt.venue} | 📅 {new Date(evt.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleSubmitDraft(evt.id)}
                        className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Submit for Approval
                      </button>
                      <Link
                        href={`/events/${evt.id}`}
                        className="text-xs text-slate-500 hover:text-slate-900"
                      >
                        View &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Events Overview Grouped by Status */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center justify-between">
          <span>School of Engineering Events Overview</span>
          <span className="text-xs font-normal text-slate-500">
            Total: {events.length} Events
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pending Column */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-800 text-base">Pending Approval</h3>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {pendingEvents.length}
              </span>
            </div>
            <div className="space-y-3 flex-1">
              {pendingEvents.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No pending events</p>
              ) : (
                pendingEvents.map((evt) => (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.id}`}
                    className="block p-3.5 rounded-2xl border border-slate-100 hover:border-indigo-200 bg-slate-50 hover:bg-indigo-50/50 transition-colors"
                  >
                    <p className="font-semibold text-slate-900 text-sm line-clamp-1">
                      {evt.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatINR(evt.budget)} • {evt.venue}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Approved Column */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-800 text-base">Approved</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {approvedEvents.length}
              </span>
            </div>
            <div className="space-y-3 flex-1">
              {approvedEvents.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No approved events</p>
              ) : (
                approvedEvents.map((evt) => (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.id}`}
                    className="block p-3.5 rounded-2xl border border-slate-100 hover:border-indigo-200 bg-slate-50 hover:bg-indigo-50/50 transition-colors"
                  >
                    <p className="font-semibold text-slate-900 text-sm line-clamp-1">
                      {evt.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatINR(evt.budget)} • {evt.venue}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-800 text-base">Completed</h3>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {completedEvents.length}
              </span>
            </div>
            <div className="space-y-3 flex-1">
              {completedEvents.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No completed events</p>
              ) : (
                completedEvents.map((evt) => (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.id}`}
                    className="block p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-200 bg-slate-50 hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-slate-900 text-sm line-clamp-1">
                        {evt.title}
                      </p>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Dossier
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatINR(evt.budget)} • {evt.venue}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Draft & Rejected Column */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-800 text-base">Draft / Rejected</h3>
              <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {draftEvents.length + rejectedEvents.length}
              </span>
            </div>
            <div className="space-y-3 flex-1">
              {draftEvents.length === 0 && rejectedEvents.length === 0 ? (
                <p className="text-xs text-slate-400 italic">None</p>
              ) : (
                <>
                  {draftEvents.map((evt) => (
                    <Link
                      key={evt.id}
                      href={`/events/${evt.id}`}
                      className="block p-3.5 rounded-2xl border border-slate-100 hover:border-slate-300 bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-slate-900 text-sm line-clamp-1">
                          {evt.title}
                        </p>
                        <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                          Draft
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatINR(evt.budget)} • {evt.venue}
                      </p>
                    </Link>
                  ))}
                  {rejectedEvents.map((evt) => (
                    <Link
                      key={evt.id}
                      href={`/events/${evt.id}`}
                      className="block p-3.5 rounded-2xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-rose-900 text-sm line-clamp-1">
                          {evt.title}
                        </p>
                        <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                          Rejected
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatINR(evt.budget)} • {evt.venue}
                      </p>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
