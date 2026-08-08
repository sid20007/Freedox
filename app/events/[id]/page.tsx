"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";

interface Approval {
  id: string;
  approverName: string;
  role: string;
  comment: string | null;
  timestamp: string;
}

interface Report {
  id: string;
  description: string;
  outcomes: string;
  participantCount: number;
  createdAt: string;
}

interface Photo {
  id: string;
  url: string;
  type: string;
  latitude: number | null;
  longitude: number | null;
}

interface Feedback {
  id: string;
  summary: string;
}

interface PressClipping {
  id: string;
  linkOrReference: string;
}

interface EventDetail {
  id: string;
  title: string;
  date: string;
  venue: string;
  budget: number;
  eventType: string;
  status: string;
  createdAt: string;
  approvals: Approval[];
  reports: Report[];
  photos: Photo[];
  feedbacks: Feedback[];
  pressClippings: PressClipping[];
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { role } = useRole();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states for Dean approval
  const [approvalComment, setApprovalComment] = useState("");
  const [approvalSubmitting, setApprovalSubmitting] = useState(false);

  // Form states for Faculty post-event entry
  const [reportData, setReportData] = useState({
    description: "",
    outcomes: "",
    participantCount: "",
  });
  const [photoData, setPhotoData] = useState({
    url: "",
    type: "normal",
    latitude: "",
    longitude: "",
  });
  const [feedbackSummary, setFeedbackSummary] = useState("");
  const [pressLink, setPressLink] = useState("");

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  // Handle Dean Approval / Rejection
  const handleApproval = async (action: "approve" | "reject") => {
    setApprovalSubmitting(true);
    try {
      const res = await fetch(`/api/events/${params.id}/approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          approverName: "Prof. Michael Vance",
          role: "Dean of Student Affairs",
          comment: approvalComment,
        }),
      });
      if (res.ok) {
        setApprovalComment("");
        fetchEvent();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApprovalSubmitting(false);
    }
  };

  // Submissions for Post-Event Reports/Photos/Feedback/Press
  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/events/${params.id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });
      if (res.ok) {
        setReportData({ description: "", outcomes: "", participantCount: "" });
        fetchEvent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/events/${params.id}/photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photoData),
      });
      if (res.ok) {
        setPhotoData({ url: "", type: "normal", latitude: "", longitude: "" });
        fetchEvent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/events/${params.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: feedbackSummary }),
      });
      if (res.ok) {
        setFeedbackSummary("");
        fetchEvent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/events/${params.id}/press`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkOrReference: pressLink }),
      });
      if (res.ok) {
        setPressLink("");
        fetchEvent();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkCompleted = async () => {
    try {
      const res = await fetch(`/api/events/${params.id}/complete`, {
        method: "POST",
      });
      if (res.ok) {
        fetchEvent();
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

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
        <button
          onClick={() => router.push("/events")}
          className="mt-4 text-sm text-indigo-600 hover:underline font-semibold"
        >
          &larr; Back to Events List
        </button>
      </div>
    );
  }

  const isCompleted = event.status === "completed";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={() => router.back()}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          &larr; Back
        </button>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-500">Current Status:</span>
          <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
            {event.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {event.eventType}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {event.title}
            </h1>
          </div>
          {isCompleted && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 self-start md:self-auto">
              <span>✓ Official Event Dossier</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block">
              Venue
            </span>
            <span className="font-semibold text-slate-800">{event.venue}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block">
              Date & Time
            </span>
            <span className="font-semibold text-slate-800">
              {new Date(event.date).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block">
              Budget
            </span>
            <span className="font-semibold text-slate-800">
              ${event.budget.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block">
              Event ID
            </span>
            <span className="font-mono text-xs text-slate-500">{event.id.slice(0, 8)}...</span>
          </div>
        </div>
      </div>

      {/* DEAN ROLE ACTION BLOCK: Approve / Reject Pending Event */}
      {role === "Dean" && event.status === "pending_approval" && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-amber-900 flex items-center space-x-2">
            <span>Dean Review & Approval Action</span>
          </h2>
          <p className="text-sm text-amber-800">
            As Dean of Student Affairs, you can review this proposal and either approve or reject it with comments.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
              Approver Remarks / Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              placeholder="e.g. Approved. Ensure safety guidelines and budget caps are adhered to."
              className="w-full px-3 py-2 border border-amber-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              disabled={approvalSubmitting}
              onClick={() => handleApproval("approve")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
            >
              ✓ Approve Event
            </button>
            <button
              disabled={approvalSubmitting}
              onClick={() => handleApproval("reject")}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
            >
              ✕ Reject Event
            </button>
          </div>
        </div>
      )}

      {/* FACULTY ROLE ACTION BLOCK: Submit Post-Event Reporting for Approved Event */}
      {role === "Faculty" && event.status === "approved" && (
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-indigo-950">
                Post-Event Documentation Entry
              </h2>
              <p className="text-xs text-indigo-700 mt-1">
                Upload reports, photos, feedback, and press clippings before marking completed.
              </p>
            </div>
            <button
              onClick={handleMarkCompleted}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md transform hover:-translate-y-0.5"
            >
              ✓ Finalize & Mark Completed
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Form */}
            <form onSubmit={handleAddReport} className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">1. Post-Event Summary & Report</h3>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={reportData.description}
                  onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                  placeholder="Summary of event execution..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Outcomes & Highlights</label>
                <input
                  type="text"
                  required
                  value={reportData.outcomes}
                  onChange={(e) => setReportData({ ...reportData, outcomes: e.target.value })}
                  placeholder="e.g. 150 students trained"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Participant Count</label>
                <input
                  type="number"
                  required
                  value={reportData.participantCount}
                  onChange={(e) => setReportData({ ...reportData, participantCount: e.target.value })}
                  placeholder="e.g. 150"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs">
                Save Report Entry
              </button>
            </form>

            {/* Photo Entry Form */}
            <form onSubmit={handleAddPhoto} className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">2. Add Event Photo</h3>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Photo Image URL</label>
                <input
                  type="url"
                  required
                  value={photoData.url}
                  onChange={(e) => setPhotoData({ ...photoData, url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Type</label>
                  <select
                    value={photoData.type}
                    onChange={(e) => setPhotoData({ ...photoData, type: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="geo_tagged">Geo-Tagged</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={photoData.latitude}
                    onChange={(e) => setPhotoData({ ...photoData, latitude: e.target.value })}
                    placeholder="37.7749"
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={photoData.longitude}
                    onChange={(e) => setPhotoData({ ...photoData, longitude: e.target.value })}
                    placeholder="-122.4194"
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs">
                Add Photo
              </button>
            </form>

            {/* Feedback Form */}
            <form onSubmit={handleAddFeedback} className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">3. Add Feedback Summary</h3>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Summary</label>
                <textarea
                  rows={2}
                  required
                  value={feedbackSummary}
                  onChange={(e) => setFeedbackSummary(e.target.value)}
                  placeholder="e.g. Rated 4.8/5 by attendees."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs">
                Save Feedback
              </button>
            </form>

            {/* Press Clipping Form */}
            <form onSubmit={handleAddPress} className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">4. Add Press / Media Link</h3>
              <div>
                <label className="text-xs text-slate-600 block mb-1">Link or Reference</label>
                <input
                  type="text"
                  required
                  value={pressLink}
                  onChange={(e) => setPressLink(e.target.value)}
                  placeholder="e.g. Campus Gazette Article Link"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs">
                Save Press Reference
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COMPLETED STATUS: CONSOLIDATED EVENT DOSSIER VIEW */}
      {isCompleted ? (
        <div className="space-y-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Official Post-Event Dossier
            </h2>
            <p className="text-sm text-slate-500">
              Complete archival record including approvals, post-event reporting, verification photos, and feedback.
            </p>
          </div>

          {/* Section 1: Approval Trail */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Approval & Governance Audit Trail
            </h3>
            <div className="space-y-2">
              {event.approvals.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No formal approval records found.</p>
              ) : (
                event.approvals.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{app.approverName}</span>
                        <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {app.role}
                        </span>
                      </div>
                      {app.comment && (
                        <p className="text-xs text-slate-600 mt-1 italic">&ldquo;{app.comment}&rdquo;</p>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(app.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 2: Post-Event Report & Metrics */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Post-Event Executive Report & Outcomes
            </h3>
            {event.reports.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No report submitted.</p>
            ) : (
              event.reports.map((rep) => (
                <div key={rep.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Event Description & Execution</h4>
                    <p className="text-sm text-slate-800 mt-1 leading-relaxed">{rep.description}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase">Key Outcomes</h4>
                      <p className="text-sm font-semibold text-indigo-900 mt-1">{rep.outcomes}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase">Verified Attendance</h4>
                      <p className="text-lg font-extrabold text-slate-900 mt-1">{rep.participantCount} Participants</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Section 3: Geo-Tagged & Verification Photos */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              3. Verification & Event Media ({event.photos.length} Photos)
            </h3>
            {event.photos.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No photos uploaded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {event.photos.map((photo) => (
                  <div key={photo.id} className="group relative bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                    <img
                      src={photo.url}
                      alt="Event verification photo"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent text-white text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          photo.type === "geo_tagged" ? "bg-emerald-500 text-white" : "bg-slate-600 text-white"
                        }`}>
                          {photo.type === "geo_tagged" ? "Geo-Tagged" : "Standard"}
                        </span>
                      </div>
                      {photo.latitude !== null && photo.longitude !== null && (
                        <p className="font-mono text-[11px] text-emerald-300">
                          📍 Lat: {photo.latitude.toFixed(4)}, Long: {photo.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Feedback & Press Clippings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            {/* Feedback */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                4. Attendee & Faculty Feedback
              </h3>
              {event.feedbacks.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No feedback recorded.</p>
              ) : (
                event.feedbacks.map((f) => (
                  <div key={f.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 italic">
                    &ldquo;{f.summary}&rdquo;
                  </div>
                ))
              )}
            </div>

            {/* Press Clippings */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                5. Media Coverage & Press Clippings
              </h3>
              {event.pressClippings.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No press links recorded.</p>
              ) : (
                event.pressClippings.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-indigo-700">
                    📰 {p.linkOrReference}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD EVENT DETAILS (NON-COMPLETED STAGES) */
        <div className="space-y-6">
          {/* Approval History */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Governance & Approvals</h2>
            {event.approvals.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No approval records submitted yet.</p>
            ) : (
              <div className="space-y-2">
                {event.approvals.map((app) => (
                  <div key={app.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center font-semibold text-slate-800">
                      <span>{app.approverName} ({app.role})</span>
                      <span className="text-slate-400 font-normal">{new Date(app.timestamp).toLocaleDateString()}</span>
                    </div>
                    {app.comment && <p className="text-slate-600 italic">{app.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Attached Post-Event Details (if any before completed) */}
          {(event.reports.length > 0 || event.photos.length > 0 || event.feedbacks.length > 0) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900">Uploaded Post-Event Items</h2>
              {event.reports.length > 0 && (
                <div className="p-3 bg-indigo-50/50 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-indigo-900">Report Summary:</span>
                  <p className="text-slate-700">{event.reports[0].description}</p>
                </div>
              )}
              {event.photos.length > 0 && (
                <div className="flex space-x-3 overflow-x-auto py-2">
                  {event.photos.map((p) => (
                    <img key={p.id} src={p.url} alt="photo" className="w-24 h-24 object-cover rounded-lg border border-slate-200" />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
