"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { formatINR } from "@/lib/utils";

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

interface PressClipping {
  id: string;
  linkOrReference: string;
}

interface FeedbackResponseItem {
  id: string;
  studentName: string | null;
  answer: string;
  ratingValue: number | null;
  question: {
    questionText: string;
    questionType: string;
  };
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
  pressClippings: PressClipping[];
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { userName, role } = useRole();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Feedback Responses state
  const [feedbackResponses, setFeedbackResponses] = useState<FeedbackResponseItem[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);

  // Copy Feedback Link Toast state
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Upload Tab state for Faculty
  const [activeUploadTab, setActiveUploadTab] = useState<"report" | "photo" | "press" | null>(null);

  // Dean approval state
  const [approvalComment, setApprovalComment] = useState("");
  const [approvalSubmitting, setApprovalSubmitting] = useState(false);

  // Dossier View Modal / Drawer State
  const [showDossierModal, setShowDossierModal] = useState(false);

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

  const [pressLink, setPressLink] = useState("");
  const [deanConflict, setDeanConflict] = useState<{ id: string; title: string } | null>(null);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data);

        // Check venue conflict for Dean review
        if (data.status === "pending_approval") {
          const conflictRes = await fetch(
            `/api/events/check-conflict?venue=${encodeURIComponent(
              data.venue
            )}&date=${encodeURIComponent(data.date)}&excludeEventId=${data.id}`
          );
          if (conflictRes.ok) {
            const conflictData = await conflictRes.json();
            if (conflictData.hasConflict && conflictData.conflictingEvent) {
              setDeanConflict(conflictData.conflictingEvent);
            } else {
              setDeanConflict(null);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbackResponses = async () => {
    try {
      const res = await fetch(`/api/events/${params.id}/feedback-responses`);
      if (res.ok) {
        const data = await res.json();
        setFeedbackResponses(data.responses || []);
        setAverageRating(data.averageRating);
        setRatingCount(data.ratingCount || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchEvent();
      fetchFeedbackResponses();
    }
  }, [params.id]);

  const handleCopyFeedbackLink = () => {
    const link = `${window.location.origin}/events/${params.id}/feedback`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Handle Dean Approval / Rejection
  const handleApproval = async (action: "approve" | "reject") => {
    setApprovalSubmitting(true);
    try {
      const res = await fetch(`/api/events/${params.id}/approval`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "Dean",
        },
        body: JSON.stringify({
          action,
          approverName: userName || "Dean, SOE",
          role: "Dean",
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
        setActiveUploadTab(null);
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
        setActiveUploadTab(null);
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
        setActiveUploadTab(null);
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

  const isApprovedOrCompleted = event.status === "approved" || event.status === "completed";

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
          {/* Generate Event Dossier Button */}
          <button
            onClick={() => setShowDossierModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
          >
            📋 Generate Event Dossier
          </button>

          <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
            {event.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                {event.eventType}
              </span>

              {/* Live Auto-Calculated Average Rating */}
              {averageRating !== null ? (
                <span className="inline-flex items-center space-x-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md">
                  <span>★ {averageRating}</span>
                  <span className="text-amber-600 font-normal">({ratingCount} ratings)</span>
                </span>
              ) : (
                <span className="text-xs text-slate-400 italic">No feedback ratings yet</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {event.title}
            </h1>
          </div>

          {/* Copy Feedback Link Button (Visible if approved or completed) */}
          {isApprovedOrCompleted && (
            <div className="relative self-start md:self-auto">
              <button
                onClick={handleCopyFeedbackLink}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-sm transition-all"
              >
                <span>🔗 Copy Feedback Link</span>
              </button>
              {copiedLink && (
                <div className="absolute right-0 top-10 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md z-10 whitespace-nowrap">
                  Copied to Clipboard! ✓
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block">Venue</span>
            <span className="font-semibold text-slate-800">{event.venue}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block">Date & Time</span>
            <span className="font-semibold text-slate-800">{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block">Budget</span>
            <span className="font-semibold text-slate-800">{formatINR(event.budget)}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block">Event ID</span>
            <span className="font-mono text-xs text-slate-500">{event.id.slice(0, 8)}...</span>
          </div>
        </div>
      </div>

      {/* DEAN ROLE ACTION BLOCK: Approve / Reject Pending Event */}
      {role === "Dean" && event.status === "pending_approval" && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-4">
          {deanConflict && (
            <div className="bg-rose-50 border-2 border-rose-300 text-rose-900 p-4 rounded-2xl text-xs space-y-1 mb-2">
              <p className="font-bold text-sm">
                ⚠️ {event.venue} is already booked for &quot;{deanConflict.title}&quot; on this date.
              </p>
              <p className="text-rose-800">
                Please review this venue conflict before approving the event.
              </p>
            </div>
          )}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-amber-900">Dean Review & Approval Action</h2>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Approving as: {userName || "Dean, SOE"}
            </span>
          </div>
          <p className="text-sm text-amber-800">
            Review this event proposal and either approve or reject it with remarks.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
              Approver Remarks / Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              placeholder="e.g. Approved. Budget and safety guidelines confirmed."
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

      {/* FACULTY ACTION BUTTONS FOR UPLOADING REPORT / PHOTOS / PRESS */}
      {role === "Faculty" && isApprovedOrCompleted && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Post-Event Actions & Documentation Uploads</h2>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveUploadTab(activeUploadTab === "report" ? null : "report")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${
                activeUploadTab === "report"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200"
              }`}
            >
              📝 Upload Report
            </button>
            <button
              onClick={() => setActiveUploadTab(activeUploadTab === "photo" ? null : "photo")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${
                activeUploadTab === "photo"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200"
              }`}
            >
              📷 Upload Photos
            </button>
            <button
              onClick={() => setActiveUploadTab(activeUploadTab === "press" ? null : "press")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${
                activeUploadTab === "press"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200"
              }`}
            >
              📰 Upload Press Clipping
            </button>
          </div>

          {/* Inline Upload Forms */}
          {activeUploadTab === "report" && (
            <form onSubmit={handleAddReport} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 pt-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Add Post-Event Summary Report</h3>
              <textarea
                rows={2}
                required
                value={reportData.description}
                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                placeholder="Description of event execution..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={reportData.outcomes}
                  onChange={(e) => setReportData({ ...reportData, outcomes: e.target.value })}
                  placeholder="Key outcomes..."
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
                />
                <input
                  type="number"
                  required
                  value={reportData.participantCount}
                  onChange={(e) => setReportData({ ...reportData, participantCount: e.target.value })}
                  placeholder="Participant count..."
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                Submit Report Entry
              </button>
            </form>
          )}

          {activeUploadTab === "photo" && (
            <form onSubmit={handleAddPhoto} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 pt-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Add Event Photo</h3>
              <input
                type="url"
                required
                value={photoData.url}
                onChange={(e) => setPhotoData({ ...photoData, url: e.target.value })}
                placeholder="Photo URL (e.g. https://images.unsplash.com/photo-...)"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
              />
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={photoData.type}
                  onChange={(e) => setPhotoData({ ...photoData, type: e.target.value })}
                  className="px-2 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
                >
                  <option value="normal">Normal Photo</option>
                  <option value="geo_tagged">Geo-Tagged Photo</option>
                </select>
                <input
                  type="number"
                  step="any"
                  value={photoData.latitude}
                  onChange={(e) => setPhotoData({ ...photoData, latitude: e.target.value })}
                  placeholder="Latitude (e.g. 37.7749)"
                  className="px-2 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
                />
                <input
                  type="number"
                  step="any"
                  value={photoData.longitude}
                  onChange={(e) => setPhotoData({ ...photoData, longitude: e.target.value })}
                  placeholder="Longitude (e.g. -122.4194)"
                  className="px-2 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                Submit Photo
              </button>
            </form>
          )}

          {activeUploadTab === "press" && (
            <form onSubmit={handleAddPress} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 pt-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Add Press Clipping Reference</h3>
              <input
                type="text"
                required
                value={pressLink}
                onChange={(e) => setPressLink(e.target.value)}
                placeholder="e.g. https://universitynews.edu/culture/fest-highlights"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                Submit Press Clipping
              </button>
            </form>
          )}
        </div>
      )}

      {/* EXISTING ATTACHED RECORDS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Governance & Approvals */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Governance & Approvals</h2>
          {event.approvals.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No formal approvals recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {event.approvals.map((app) => (
                <div key={app.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                  <div className="flex justify-between items-center font-semibold text-slate-800">
                    <span>{app.approverName} ({app.role})</span>
                    <span className="text-slate-400 font-normal">{new Date(app.timestamp).toLocaleDateString()}</span>
                  </div>
                  {app.comment && <p className="text-slate-600 italic">&ldquo;{app.comment}&rdquo;</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Feedback Responses */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Student Feedback Responses</h2>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
              {feedbackResponses.length} Submissions
            </span>
          </div>

          {feedbackResponses.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No feedback responses submitted yet.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {feedbackResponses.map((res) => (
                <div key={res.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{res.studentName || "Anonymous"}</span>
                    <span className="text-[10px] text-slate-400">{res.question.questionText}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{res.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CONSOLIDATED READ-ONLY EVENT DOSSIER MODAL / VIEW */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl space-y-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                  Consolidated Dossier Record
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Event Dossier: {event.title}
                </h2>
              </div>
              <button
                onClick={() => setShowDossierModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Dossier Content */}
            <div className="space-y-6 text-sm">
              {/* Proposal Summary */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">I. Proposal Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 font-medium text-slate-800">
                  <div><span className="text-xs text-slate-400 block">Type</span>{event.eventType}</div>
                  <div><span className="text-xs text-slate-400 block">Venue</span>{event.venue}</div>
                  <div><span className="text-xs text-slate-400 block">Date</span>{new Date(event.date).toLocaleDateString()}</div>
                  <div><span className="text-xs text-slate-400 block">Budget</span>{formatINR(event.budget)}</div>
                </div>
              </div>

              {/* Governance Approvals */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">II. Approval Trail</h3>
                {event.approvals.map((app) => (
                  <div key={app.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold">{app.approverName} ({app.role})</span>: {app.comment || "Approved"}
                  </div>
                ))}
              </div>

              {/* Reports */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">III. Post-Event Report</h3>
                {event.reports.map((rep) => (
                  <div key={rep.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <p><strong>Description:</strong> {rep.description}</p>
                    <p><strong>Outcomes:</strong> {rep.outcomes}</p>
                    <p><strong>Participants:</strong> {rep.participantCount}</p>
                  </div>
                ))}
              </div>

              {/* Photos */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">IV. Verification Photos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {event.photos.map((p) => (
                    <div key={p.id} className="bg-slate-900 rounded-xl overflow-hidden text-white text-[10px] p-2 space-y-1">
                      <img src={p.url} alt="photo" className="w-full h-24 object-cover rounded-lg" />
                      <div className="flex justify-between items-center">
                        <span className="font-bold uppercase text-emerald-400">{p.type}</span>
                        {p.latitude && <span>📍 {p.latitude.toFixed(2)}, {p.longitude?.toFixed(2)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Average */}
              <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">V. Student Feedback Summary</h3>
                <p className="text-base font-extrabold text-amber-950">
                  {averageRating !== null ? `Average Rating: ${averageRating} ★ (${ratingCount} student responses)` : "No ratings submitted yet"}
                </p>
              </div>

              {/* Press Links */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">VI. Media & Press Clippings</h3>
                {event.pressClippings.map((pr) => (
                  <div key={pr.id} className="p-3 bg-slate-50 rounded-xl text-xs font-semibold text-indigo-700 border border-slate-200">
                    📰 {pr.linkOrReference}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowDossierModal(false)}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
              >
                Close Dossier View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
