"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  budget: number;
  eventType: string;
  status: string;
  createdAt: string;
}

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter((evt) => {
    const matchesSearch = evt.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || evt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-slate-100 text-slate-700 border-slate-300";
      case "pending_approval":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "rejected":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">All Events</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse and filter through all event proposals, approvals, and completed dossiers.
          </p>
        </div>
        <Link
          href="/events/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          + Propose Event
        </Link>
      </div>

      {/* Controls / Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search events by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-auto flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Status Filter:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-sm font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Loading event records...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No events match your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Event Title</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Venue</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Budget</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((evt) => (
                  <tr
                    key={evt.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <Link
                        href={`/events/${evt.id}`}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        {evt.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{evt.eventType}</td>
                    <td className="py-3.5 px-4 text-slate-600">{evt.venue}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(evt.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      ${evt.budget.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(
                          evt.status
                        )}`}
                      >
                        {evt.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/events/${evt.id}`}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Details &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
