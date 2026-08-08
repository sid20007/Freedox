-- CreateTable
CREATE TABLE "FeedbackQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL DEFAULT 'text',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FeedbackResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "studentName" TEXT,
    "answer" TEXT NOT NULL,
    "ratingValue" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeedbackResponse_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FeedbackResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FeedbackQuestion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
