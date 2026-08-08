"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Question {
  id: string;
  questionText: string;
  questionType: string;
}

interface EventSummary {
  id: string;
  title: string;
  venue: string;
  date: string;
  eventType: string;
}

export default function PublicFeedbackPage() {
  const params = useParams();
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [studentName, setStudentName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [eventRes, qRes] = await Promise.all([
          fetch(`/api/events/${params.id}`),
          fetch(`/api/feedback-questions`),
        ]);

        if (eventRes.ok) {
          const eventData = await eventRes.json();
          setEvent(eventData);
        }

        if (qRes.ok) {
          const qData = await qRes.json();
          setQuestions(qData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadData();
    }
  }, [params.id]);

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formattedResponses = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    if (formattedResponses.length === 0) {
      setError("Please answer at least one question before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/events/${params.id}/feedback-responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: studentName || "Anonymous Student",
          responses: formattedResponses,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white border border-emerald-200 rounded-3xl p-8 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          ✓
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Thank You for Your Feedback!</h1>
        <p className="text-sm text-slate-600">
          Your feedback for <strong className="text-slate-900">{event?.title}</strong> has been successfully recorded and will help improve future campus events.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Event Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <span className="text-xs font-semibold px-3 py-1 bg-indigo-700/60 rounded-full uppercase tracking-wider text-indigo-200">
          Student Feedback Survey
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
          {event?.title || "Campus Event Feedback"}
        </h1>
        <p className="text-xs text-indigo-200 mt-1">
          📍 {event?.venue} | 📅 {event?.date ? new Date(event.date).toLocaleDateString() : ""}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Your Name (Optional / Leave blank for Anonymous)
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="e.g. Alex Rivera or leave blank"
            className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <hr className="border-slate-100" />

        {/* Dynamic Standard Questions */}
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                {idx + 1}. {q.questionText}
              </label>

              {q.questionType === "rating" ? (
                <div className="flex items-center space-x-3 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleAnswerChange(q.id, String(star))}
                      className={`w-11 h-11 rounded-xl font-bold text-sm transition-all ${
                        answers[q.id] === String(star)
                          ? "bg-amber-500 text-white shadow-md scale-105"
                          : "bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800"
                      }`}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  rows={3}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md transform hover:-translate-y-0.5"
          >
            {submitting ? "Submitting Feedback..." : "Submit Feedback Response"}
          </button>
        </div>
      </form>
    </div>
  );
}
