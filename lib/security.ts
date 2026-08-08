/**
 * Security helper functions for input sanitization, role check, and validation.
 */

// Simple HTML entity escape to prevent XSS in text fields
export function sanitizeString(input: unknown, maxLen = 1000): string {
  if (typeof input !== "string") return "";
  const trimmed = input.trim().slice(0, maxLen);
  return trimmed
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function validateRole(roleHeader: string | null, allowedRoles: string[]): boolean {
  if (!roleHeader) return true; // Fallback for MVP local mode if header omitted
  return allowedRoles.includes(roleHeader);
}
