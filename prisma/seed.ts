import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding St Aloysius (Deemed to be University), School of Engineering (Mangaluru) events...");

  // Clean existing records
  await prisma.feedbackResponse.deleteMany();
  await prisma.feedbackQuestion.deleteMany();
  await prisma.pressClipping.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.report.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.event.deleteMany();

  // Seed fixed Feedback Questions template
  const q1 = await prisma.feedbackQuestion.create({
    data: {
      questionText: "Overall, how would you rate this event (1 to 5 stars)?",
      questionType: "rating",
    },
  });

  const q2 = await prisma.feedbackQuestion.create({
    data: {
      questionText: "What did you like most about this event?",
      questionType: "text",
    },
  });

  const q3 = await prisma.feedbackQuestion.create({
    data: {
      questionText: "What suggestions do you have for future improvements?",
      questionType: "text",
    },
  });

  const q4 = await prisma.feedbackQuestion.create({
    data: {
      questionText: "Would you recommend similar events to fellow students?",
      questionType: "text",
    },
  });

  // 1. Draft Event
  const draftEvent = await prisma.event.create({
    data: {
      title: "Coding Bootcamp for First Years",
      date: new Date("2026-09-10T09:30:00Z"),
      venue: "Lab 201, SOE Block, St Aloysius Campus, Mangaluru",
      budget: 8000.0,
      eventType: "Workshop",
      status: "draft",
    },
  });

  // 2. Pending Approval Event
  const pendingEvent = await prisma.event.create({
    data: {
      title: "Guest Lecture on Robotics & Autonomous Systems",
      date: new Date("2026-09-18T14:00:00Z"),
      venue: "AILC Seminar Hall, School of Engineering, Mangaluru",
      budget: 15000.0,
      eventType: "Lecture",
      status: "pending_approval",
      approvals: {
        create: [
          {
            approverName: "Dr. Rio D'Souza",
            role: "Faculty Advisor",
            comment: "Recommended for departmental approval. High industry relevance.",
            timestamp: new Date("2026-08-01T09:30:00Z"),
          },
        ],
      },
    },
  });

  // 3. Approved Event
  const approvedEvent = await prisma.event.create({
    data: {
      title: "Internal Smart India Hackathon 2026",
      date: new Date("2026-10-02T08:00:00Z"),
      venue: "Main Auditorium, St Aloysius Campus, Mangaluru",
      budget: 45000.0,
      eventType: "Hackathon",
      status: "approved",
      approvals: {
        create: [
          {
            approverName: "Dr. Rio D'Souza",
            role: "Faculty Advisor",
            comment: "Strong proposal and problem statements evaluated.",
            timestamp: new Date("2026-07-25T11:00:00Z"),
          },
          {
            approverName: "Dr. Praveen J.",
            role: "Dean, School of Engineering",
            comment: "Approved. Ensure high-speed connectivity and lab access.",
            timestamp: new Date("2026-07-27T16:15:00Z"),
          },
        ],
      },
    },
  });

  // 4. Completed Event 1 (AI & Machine Learning Workshop)
  const completedEvent1 = await prisma.event.create({
    data: {
      title: "AI & Machine Learning Workshop",
      date: new Date("2026-05-15T09:30:00Z"),
      venue: "Computer Center, School of Engineering, Mangaluru",
      budget: 25000.0,
      eventType: "Workshop",
      status: "completed",
      approvals: {
        create: [
          {
            approverName: "Dr. Rio D'Souza",
            role: "Faculty Advisor",
            comment: "Approved for execution.",
            timestamp: new Date("2026-04-10T10:00:00Z"),
          },
          {
            approverName: "Dr. Praveen J.",
            role: "Dean, School of Engineering",
            comment: "Approved.",
            timestamp: new Date("2026-04-12T14:00:00Z"),
          },
        ],
      },
      reports: {
        create: [
          {
            description:
              "A comprehensive 2-day hands-on workshop covering PyTorch, Scikit-Learn, and Neural Network architectures tailored for SOE engineering students.",
            outcomes:
              "180 engineering students built and evaluated machine learning models. 96% completed practical assignments successfully.",
            participantCount: 180,
          },
        ],
      },
      photos: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
            type: "normal",
            latitude: null,
            longitude: null,
          },
          {
            url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
            type: "geo_tagged",
            latitude: 12.8715,
            longitude: 74.8431,
          },
          {
            url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
            type: "geo_tagged",
            latitude: 12.8718,
            longitude: 74.8435,
          },
        ],
      },
      feedbacks: {
        create: [
          {
            summary:
              "Overwhelmingly positive response from SOE students. Average rating 4.9/5 stars with strong interest in advanced NLP sessions.",
          },
        ],
      },
      pressClippings: {
        create: [
          {
            linkOrReference:
              "Deccan Herald - 'St Aloysius SOE Hosts National Workshop on Artificial Intelligence'",
          },
        ],
      },
    },
  });

  // Seed Feedback Responses for Completed Event 1
  await prisma.feedbackResponse.createMany({
    data: [
      {
        eventId: completedEvent1.id,
        questionId: q1.id,
        studentName: "Rohan D'Souza",
        answer: "5",
        ratingValue: 5,
      },
      {
        eventId: completedEvent1.id,
        questionId: q2.id,
        studentName: "Rohan D'Souza",
        answer: "Hands-on PyTorch coding and model deployment guidance.",
      },
      {
        eventId: completedEvent1.id,
        questionId: q3.id,
        studentName: "Rohan D'Souza",
        answer: "Provide pre-installed GPU lab environments.",
      },
      {
        eventId: completedEvent1.id,
        questionId: q1.id,
        studentName: "Ananya Rao",
        answer: "4.8",
        ratingValue: 4.8,
      },
      {
        eventId: completedEvent1.id,
        questionId: q2.id,
        studentName: "Ananya Rao",
        answer: "Excellent faculty interaction and practical assignments.",
      },
    ],
  });

  // 5. Completed Event 2 (Resonance Technical Fest)
  const completedEvent2 = await prisma.event.create({
    data: {
      title: "Resonance Technical Fest",
      date: new Date("2026-06-05T09:00:00Z"),
      venue: "Open Air Quadrangle, St Aloysius Campus, Mangaluru",
      budget: 120000.0,
      eventType: "Cultural Fest",
      status: "completed",
      approvals: {
        create: [
          {
            approverName: "Dr. Rio D'Souza",
            role: "Faculty Advisor",
            comment: "Fest schedule and budget allocation approved.",
            timestamp: new Date("2026-05-01T11:00:00Z"),
          },
          {
            approverName: "Dr. Praveen J.",
            role: "Dean, School of Engineering",
            comment: "Approved for multi-college participation.",
            timestamp: new Date("2026-05-03T15:00:00Z"),
          },
        ],
      },
      reports: {
        create: [
          {
            description:
              "Annual flagship technical festival of St Aloysius School of Engineering featuring robo-wars, paper presentations, coding marathons, and drone racing.",
            outcomes:
              "Over 750 participants from 15 regional engineering institutions across Karnataka. High media coverage and industry sponsorship.",
            participantCount: 750,
          },
        ],
      },
      photos: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
            type: "geo_tagged",
            latitude: 12.8722,
            longitude: 74.8428,
          },
          {
            url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
            type: "normal",
            latitude: null,
            longitude: null,
          },
          {
            url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
            type: "geo_tagged",
            latitude: 12.8725,
            longitude: 74.843,
          },
        ],
      },
      feedbacks: {
        create: [
          {
            summary:
              "Highly praised by visiting dignitaries and students. Rated 5/5 stars for event organization and robotics arena setup.",
          },
        ],
      },
      pressClippings: {
        create: [
          {
            linkOrReference:
              "The Hindu - 'Resonance 2026 Inaugurated at St Aloysius School of Engineering, Mangaluru'",
          },
        ],
      },
    },
  });

  // Seed Feedback Responses for Completed Event 2
  await prisma.feedbackResponse.createMany({
    data: [
      {
        eventId: completedEvent2.id,
        questionId: q1.id,
        studentName: "Karthik Shetty",
        answer: "5",
        ratingValue: 5,
      },
      {
        eventId: completedEvent2.id,
        questionId: q2.id,
        studentName: "Karthik Shetty",
        answer: "Robo-wars arena and drone competition track.",
      },
      {
        eventId: completedEvent2.id,
        questionId: q1.id,
        studentName: "Nisha Fernandes",
        answer: "5",
        ratingValue: 5,
      },
    ],
  });

  console.log("Seeded St Aloysius SOE events successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
