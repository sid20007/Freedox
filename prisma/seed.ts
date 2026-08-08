import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.pressClipping.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.report.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.event.deleteMany();

  // 1. Draft Event
  const draftEvent = await prisma.event.create({
    data: {
      title: "Cybersecurity & Ethical Hacking Bootcamp",
      date: new Date("2026-09-15T10:00:00Z"),
      venue: "Lab 3, CS Department",
      budget: 500.0,
      eventType: "Workshop",
      status: "draft",
    },
  });

  // 2. Pending Approval Event
  const pendingEvent = await prisma.event.create({
    data: {
      title: "Guest Lecture on Robotics & Autonomous Systems",
      date: new Date("2026-09-20T14:00:00Z"),
      venue: "Auditorium B",
      budget: 1200.0,
      eventType: "Lecture",
      status: "pending_approval",
      approvals: {
        create: [
          {
            approverName: "Dr. Sarah Jenkins",
            role: "Faculty Advisor",
            comment: "Recommended for departmental approval. Good topic.",
            timestamp: new Date("2026-08-01T09:30:00Z"),
          },
        ],
      },
    },
  });

  // 3. Approved Event
  const approvedEvent = await prisma.event.create({
    data: {
      title: "Inter-College Hackathon 2026",
      date: new Date("2026-10-05T09:00:00Z"),
      venue: "Main Campus Student Center",
      budget: 5000.0,
      eventType: "Hackathon",
      status: "approved",
      approvals: {
        create: [
          {
            approverName: "Dr. Sarah Jenkins",
            role: "Faculty Advisor",
            comment: "Strong proposal, budget and venue arrangement look realistic.",
            timestamp: new Date("2026-07-25T11:00:00Z"),
          },
          {
            approverName: "Prof. Michael Vance",
            role: "Dean of Student Affairs",
            comment: "Approved. Ensure all overnight safety protocols are enforced.",
            timestamp: new Date("2026-07-27T16:15:00Z"),
          },
        ],
      },
    },
  });

  // 4. Completed Event 1 (AI Workshop)
  const completedEvent1 = await prisma.event.create({
    data: {
      title: "AI & Deep Learning Hands-on Workshop",
      date: new Date("2026-05-12T10:00:00Z"),
      venue: "Engineering Hall Auditorium",
      budget: 2500.0,
      eventType: "Workshop",
      status: "completed",
      approvals: {
        create: [
          {
            approverName: "Dr. Sarah Jenkins",
            role: "Faculty Advisor",
            comment: "Approved.",
            timestamp: new Date("2026-04-10T10:00:00Z"),
          },
          {
            approverName: "Prof. Michael Vance",
            role: "Dean of Student Affairs",
            comment: "Approved.",
            timestamp: new Date("2026-04-12T14:00:00Z"),
          },
        ],
      },
      reports: {
        create: [
          {
            description:
              "A intensive full-day practical workshop covering PyTorch, transformer architectures, and LLM fine-tuning techniques.",
            outcomes:
              "Over 150 students built and deployed working sentiment classification models. 95% completion rate for hands-on lab sessions.",
            participantCount: 150,
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
            latitude: 37.7749,
            longitude: -122.4194,
          },
          {
            url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
            type: "geo_tagged",
            latitude: 37.7751,
            longitude: -122.4189,
          },
        ],
      },
      feedbacks: {
        create: [
          {
            summary:
              "Participants rated the event 4.8 out of 5 stars. Strong demand expressed for advanced follow-up modules on computer vision.",
          },
        ],
      },
      pressClippings: {
        create: [
          {
            linkOrReference:
              "Campus Tech Chronicle - 'AI Workshop Equips Engineering Students with Cutting-Edge Skills'",
          },
        ],
      },
    },
  });

  // 5. Completed Event 2 (Cultural Fest)
  const completedEvent2 = await prisma.event.create({
    data: {
      title: "Annual Campus Cultural Fest 2026",
      date: new Date("2026-06-01T16:00:00Z"),
      venue: "University Open Air Theatre",
      budget: 8500.0,
      eventType: "Cultural Fest",
      status: "completed",
      approvals: {
        create: [
          {
            approverName: "Dr. Sarah Jenkins",
            role: "Faculty Advisor",
            comment: "Budget and event lineup approved.",
            timestamp: new Date("2026-05-01T11:00:00Z"),
          },
          {
            approverName: "Prof. Michael Vance",
            role: "Dean of Student Affairs",
            comment: "Approved for evening slot.",
            timestamp: new Date("2026-05-03T15:00:00Z"),
          },
        ],
      },
      reports: {
        create: [
          {
            description:
              "Annual flagship campus festival showcasing live music performances, inter-departmental dance battles, theatrical plays, and food pop-ups.",
            outcomes:
              "Welcomed participants and attendees from 12 neighboring colleges. High campus engagement and zero security incidents.",
            participantCount: 650,
          },
        ],
      },
      photos: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
            type: "geo_tagged",
            latitude: 34.0522,
            longitude: -118.2437,
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
            latitude: 34.0525,
            longitude: -118.244,
          },
        ],
      },
      feedbacks: {
        create: [
          {
            summary:
              "Extremely positive feedback from students, faculty guests, and external participants. High praise for stage sound and logistics.",
          },
        ],
      },
      pressClippings: {
        create: [
          {
            linkOrReference:
              "https://universitynews.edu/culture/fest-2026-highlights",
          },
        ],
      },
    },
  });

  console.log("Seeded events successfully:");
  console.log(` - Draft: ${draftEvent.title}`);
  console.log(` - Pending: ${pendingEvent.title}`);
  console.log(` - Approved: ${approvedEvent.title}`);
  console.log(` - Completed 1: ${completedEvent1.title}`);
  console.log(` - Completed 2: ${completedEvent2.title}`);
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
