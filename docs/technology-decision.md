# Technology & Architecture Decisions

This document outlines key technical decisions made for the 8-hour hackathon MVP of the Event Proposal to Post-Event Reporting Portal.

## 1. Prisma + SQLite
- **Decision:** Use SQLite as the database engine paired with Prisma as the ORM.
- **Rationale:** Fast, zero-configuration setup that avoids external database server overhead during hackathon development while providing strict relational integrity, type safety, and seamless migrations.

## 2. Role-Switcher Dropdown vs. Full Authentication
- **Decision:** Implement a simple client-side role-switcher dropdown instead of a complete authentication system (e.g., NextAuth, OAuth, JWT).
- **Rationale:** Building full authentication is out of scope for an 8-hour MVP. The primary focus of the MVP is demonstrating the event lifecycle and approval workflow logic across different personas (Students, Faculty, Admins).

## 3. Geo-Tagged Photos as Latitude/Longitude Fields
- **Decision:** Store geo-location data for post-event verification as numerical `latitude` and `longitude` fields in the database rather than integrating interactive map APIs (e.g., Google Maps, Leaflet).
- **Rationale:** Keeps the MVP simple and reliable within the hackathon timeframe while fulfilling the core data requirement for location-verifiable post-event reporting.
