# Avenix Core

> **Ideas into Digital Experiences.**

Avenix Core is a modern creative digital studio website designed to help businesses, creators, and individuals build their digital presence through websites, visual design, digital experiences, and creative solutions.

## Project Overview

Avenix Core provides a responsive and interactive digital experience with sections for services, portfolio projects, customer feedback, contact enquiries, and future admin management.

### Main Objectives

- Professional digital presence
- Modern responsive UI
- Interactive portfolio presentation
- Service showcase
- Customer feedback
- Contact enquiries
- Smooth navigation
- Responsive mobile experience
- Future admin management
- Cloud-based portfolio image management

## Features

### Hero
- Avenix Core branding
- Hero introduction
- Primary call-to-action
- Responsive design
- Smooth navigation
- Modern visual animations

### About
- About Avenix Core
- Company description
- Supporting content
- Responsive layout

### Services
1. Website Development
2. Poster Making
3. Web Invitation
4. Digital Marketing

### Portfolio / Work
- Project showcase
- Portfolio cards
- Category filtering
- Project technologies
- Project descriptions
- Project links
- Interactive hover effects
- Responsive layout

### Feedback
- Customer feedback form
- Rating support
- Customer review content
- Future admin approval workflow
- Future database storage

### Contact
- Contact Form
- Customer enquiry submission
- Email contact
- Phone contact
- WhatsApp contact
- Instagram contact
- Responsive contact layout

### Back-to-Hero
- Circular button
- Green glow effect
- Upward arrow
- Appears only in the Contact section
- Smoothly scrolls back to Hero
- Desktop and mobile support

## Project Architecture

```text
avenix-core/
├── frontend/
│   └── React Frontend
├── backend/
│   └── Node.js + Express.js Backend
├── .gitignore
└── README.md
```

## Frontend

### Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript / JavaScript | Application logic |
| Vite | Development and build tool |
| Tailwind CSS / CSS | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |

### Recommended Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── config/
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Backend

### Planned Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Cloudinary | Image management |
| CORS | Cross-origin requests |
| dotenv | Environment variables |
| Rate Limiting | API protection |

### Recommended Structure

```text
backend/
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
├── utils/
├── uploads/
├── .env
├── package.json
└── server.js
```

## Portfolio Module

### Categories

```text
ALL
WEBSITES
POSTERS
WEB INVITATIONS
DIGITAL MARKETING
```

### Project Data

```text
title
slug
description
shortDescription
category
thumbnail
gallery
technologies
projectUrl
featured
published
createdAt
updatedAt
```

### Public APIs

```text
GET /api/projects
GET /api/projects/:slug
```

### Admin APIs

```text
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id
PATCH /api/projects/:id/publish
PATCH /api/projects/:id/featured
```

## Cloudinary Image Workflow

```text
Admin Panel
     ↓
Select Image
     ↓
Backend
     ↓
Cloudinary
     ↓
Image URL
     ↓
MongoDB
     ↓
Public Portfolio
     ↓
Display Image
```

Only the hosted image URL should normally be stored in MongoDB. Cloudinary credentials must remain on the backend.

## Feedback Module

### Feedback Data

```text
name
email
rating
service
message
approved
createdAt
updatedAt
```

### APIs

```text
POST /api/feedback
GET /api/feedback
DELETE /api/feedback/:id
PATCH /api/feedback/:id/approve
PATCH /api/feedback/:id/reject
```

### Workflow

```text
Customer
    ↓
Feedback Form
    ↓
POST /api/feedback
    ↓
Validation
    ↓
MongoDB
    ↓
Admin Review / Approval
    ↓
Public Review
```

## Contact Module

### Contact Data

```text
name
email
phone
service
message
status
createdAt
updatedAt
```

### APIs

```text
POST /api/contact
GET /api/contact
PATCH /api/contact/:id/status
```

### Contact Status

```text
new
contacted
closed
archived
```

### Workflow

```text
Customer
    ↓
Contact Form
    ↓
POST /api/contact
    ↓
Validation
    ↓
MongoDB
    ↓
Admin Dashboard
```

## Admin Authentication

The future admin system will use JWT authentication and bcrypt password hashing.

```text
Admin Login
     ↓
POST /api/auth/login
     ↓
Verify Credentials
     ↓
bcrypt Password Verification
     ↓
JWT Token
     ↓
Protected Admin APIs
```

### Authentication APIs

```text
POST /api/auth/login
POST /api/auth/logout
```

## Database

**Database:** MongoDB Atlas  
**ODM:** Mongoose

### Recommended Collections

```text
admins
projects
feedbacks
contacts
services
```

## API Architecture

### Public APIs

```text
GET  /api/projects
GET  /api/projects/:slug
GET  /api/services
POST /api/feedback
POST /api/contact
```

### Admin APIs

```text
POST   /api/auth/login

POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
PATCH  /api/projects/:id/publish
PATCH  /api/projects/:id/featured

GET    /api/feedback
DELETE /api/feedback/:id

GET    /api/contact
PATCH  /api/contact/:id/status

POST   /api/services
PUT    /api/services/:id
DELETE /api/services/:id
```

### Upload API

```text
POST /api/uploads/image
```

## Data Flow

### Portfolio

```text
React Frontend
      ↓
API Service
      ↓
Express Route
      ↓
Controller
      ↓
Project Model
      ↓
MongoDB Atlas
      ↓
JSON Response
      ↓
Portfolio UI
```

### Feedback

```text
Customer
      ↓
Feedback Form
      ↓
API
      ↓
Validation
      ↓
MongoDB
      ↓
Admin Approval
      ↓
Public Review
```

### Contact

```text
Customer
      ↓
Contact Form
      ↓
API
      ↓
Validation
      ↓
MongoDB
      ↓
Admin Dashboard
```

## Responsive Design

The website is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

Mobile considerations include responsive navigation, compact portfolio filters, responsive forms and cards, mobile-friendly buttons, proper section spacing, and no horizontal overflow.

## Animation

The project uses modern and purposeful animations, including:

- Hero animations
- Section text animations
- Card hover effects
- Edge glow effects
- Portfolio interactions
- Form animations
- Input hover effects
- Button hover effects
- Back-to-Hero glow

## Security

The backend should implement:

- JWT authentication
- bcrypt password hashing
- Protected admin routes
- Input validation
- Input sanitization
- Rate limiting
- CORS configuration
- Secure environment variables
- MongoDB credential protection
- Cloudinary credential protection
- Error handling

Never expose secrets in frontend code.

## Environment Variables

### Frontend

```env
VITE_API_BASE_URL=
```

### Backend

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=
```

Never commit `.env` files to GitHub.

## Cloud Configuration

Recommended cloud configuration for deployment targeting Chennai, India:

```text
Cloud Provider: AWS
Region: Asia Pacific (Mumbai)
Region Code: ap-south-1
```

## MongoDB Atlas

Recommended cluster name:

```text
avenix-core-cluster
```

Architecture:

```text
React Frontend
      ↓
Node.js + Express.js
      ↓
Mongoose
      ↓
MongoDB Atlas
```

## GitHub Repository Structure

```text
avenix-core/
├── frontend/
├── backend/
├── .gitignore
└── README.md
```

## Installation & Running

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Development Roadmap

### Phase 1 — Frontend
- Complete UI
- Responsive testing
- Navigation testing
- Portfolio testing
- Contact testing
- Feedback testing
- Animation testing

### Phase 2 — Backend
- Node.js setup
- Express.js setup
- Environment configuration
- API architecture

### Phase 3 — Database
- MongoDB Atlas
- Mongoose connection
- Database models

### Phase 4 — Authentication
- Admin login
- bcrypt
- JWT
- Protected routes

### Phase 5 — Portfolio
- Portfolio CRUD
- Project APIs
- Admin management

### Phase 6 — Cloudinary
- Image upload
- Image URL storage
- Portfolio image management

### Phase 7 — Feedback
- Feedback API
- Database storage
- Admin management
- Approval workflow

### Phase 8 — Contact
- Contact API
- Enquiry storage
- Admin management
- Status tracking

### Phase 9 — Integration
- Connect frontend to APIs
- Error handling
- Loading states
- API validation

### Phase 10 — Deployment
- Production configuration
- Security testing
- API testing
- Responsive testing
- Deployment

## Final Architecture

```text
                       AVENIX CORE
                            │
              ┌─────────────┴─────────────┐
              │                           │
          FRONTEND                     BACKEND
              │                           │
       React + Vite               Node.js + Express
              │                           │
      TypeScript / CSS                REST APIs
              │                           │
              └─────────────┬─────────────┘
                            │
                         Mongoose
                            │
                     MongoDB Atlas
                            │
              ┌─────────────┴─────────────┐
              │                           │
         Portfolio                    Feedback
              │
          Cloudinary
              │
        Admin Management
              │
        JWT + bcrypt
```

## Project Status

| Module | Status |
|---|---|
| Hero | ✅ Frontend |
| About | ✅ Frontend |
| Services | ✅ Frontend |
| Portfolio | ✅ Frontend |
| Portfolio Filtering | ✅ Frontend |
| Feedback UI | ✅ Frontend |
| Contact UI | ✅ Frontend |
| Footer | ✅ Frontend |
| Responsive Design | ✅ Frontend |
| Backend API | 🔄 Planned |
| MongoDB Atlas | 🔄 Planned |
| Admin Authentication | 🔄 Planned |
| Portfolio CRUD | 🔄 Planned |
| Cloudinary | 🔄 Planned |
| Feedback Database | 🔄 Planned |
| Contact Database | 🔄 Planned |
| Admin Dashboard | 🔄 Planned |

## Project Development

**Project:** Avenix Core  
**Type:** Creative Digital Studio Website  
**Architecture:** Frontend + Backend  
**Frontend:** React / Vite  
**Backend:** Node.js / Express.js  
**Database:** MongoDB Atlas  
**Image Management:** Cloudinary  
**Authentication:** JWT + bcrypt

---

## Avenix Core

**Ideas into Digital Experiences.**
