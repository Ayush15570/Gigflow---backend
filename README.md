# GigFlow – Mini Freelance Marketplace Platform

## Overview
GigFlow is a full-stack freelance marketplace where users can act as both clients and freelancers.
Clients can post gigs, freelancers can bid on them, and clients can hire freelancers.

## Tech Stack
- Frontend: React (Vite), Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT with HttpOnly cookies
- Real-time: Socket.io

## Core Features
- User authentication (login/signup)
- Create and browse gigs
- Search gigs by title
- Freelancers can place bids on gigs
- Clients can view bids on their gigs
- Clients can hire one freelancer per gig

## Hiring Logic
- Only the gig owner can hire a freelancer
- Once a freelancer is hired:
  - The selected bid is marked as hired
  - All other bids are marked as rejected
  - The gig status is changed to assigned

## Bonus Features
- Transaction-safe hiring logic using MongoDB sessions to prevent race conditions
- Real-time notification using Socket.io when a freelancer is hired

## How to Run Locally

### Backend
```bash
cd backend
npm install
npm run dev
