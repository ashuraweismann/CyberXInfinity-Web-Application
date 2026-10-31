# CyberXInfinity

**CyberXInfinity** is a gamified cybersecurity learning platform developed as a mini project for **EC4307 – Web Application Development**. It helps students learn cybersecurity through structured labs, theory content, multiple-choice quizzes, points, a student leaderboard, and AI-generated learning suggestions.

The application also includes an administrator area for managing lab content and the questions associated with each lab. Lab and quiz data are stored persistently in MongoDB.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Configure MongoDB Atlas](#2-configure-mongodb-atlas)
  - [3. Configure the backend](#3-configure-the-backend)
  - [4. Install backend dependencies](#4-install-backend-dependencies)
  - [5. Prepare the database](#5-prepare-the-database)
  - [6. Create an administrator account](#6-create-an-administrator-account)
  - [7. Configure the frontend](#7-configure-the-frontend)
  - [8. Run the application](#8-run-the-application)
- [User Roles](#user-roles)
- [Lab Management — Full CRUD](#lab-management--full-crud)
- [Quiz Management](#quiz-management)
- [Points and Leaderboard](#points-and-leaderboard)
- [AI Learning Suggestions](#ai-learning-suggestions)
- [Main API Endpoints](#main-api-endpoints)
- [Database Collections](#database-collections)
- [Security and Validation](#security-and-validation)
- [Troubleshooting](#troubleshooting)
- [Academic Project Information](#academic-project-information)

---

## Features

### Student features

- Student registration and login.
- JWT-protected student pages and API endpoints.
- Four cybersecurity learning labs:
  1. Introduction to Cybersecurity
  2. Network Security
  3. Web Security
  4. Cryptography
- Theory sections and key concepts within each lab.
- Multiple-choice quizzes associated with individual labs.
- Automatic quiz evaluation on the backend.
- Quiz attempt history stored in MongoDB.
- Points for correct answers and first-time lab completion.
- Student-only leaderboard with ranking by points.
- AI-generated feedback based on quiz performance, including strengths, weak topics, study recommendations, and a suggested next step.
- Dashboard showing points, rank, lab progress, recent quiz attempts, and the latest available AI feedback.

### Administrator features

- Role-based administrator access.
- Create, view, search, filter, sort, update, and delete lab records.
- Manage the theory sections and key concepts belonging to a lab.
- Create and view multiple-choice questions for each lab.
- Edit or delete questions that have not been used in student attempts.
- Archive questions and labs when student history needs to be preserved.
- Published and archived lab status management.

---

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | React, Vite, React Router |
| HTTP client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password hashing | bcryptjs |
| AI integration | Groq API (`groq-sdk`) |
| API security | Helmet, CORS configuration, express-rate-limit |
| Development | Nodemon, Git |

---

## Application Architecture

```text
                       CyberXInfinity
                              |
                  +-----------+-----------+
                  |                       |
             React + Vite             Express API
                  |                       |
             React Router        +--------+---------+
                  |              |        |         |
               Axios           Auth     Labs     Quizzes
                  |              |        |         |
                  +--------------+--------+---------+
                                 |
                          MongoDB Atlas
                                 |
                         Quiz Attempts
                                 |
                        Groq AI Service
                    (learning suggestions)
```

The frontend communicates with the Express API. The backend validates requests, verifies authentication and authorization, performs business logic, and reads or writes persistent records in MongoDB. The Groq API is called from the backend; the Groq API key must never be exposed in the frontend.

---

## Project Structure

The project is organized into separate frontend and backend applications.

```text
CyberXInfinity/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── seedLabs.js
│   │   ├── seedQuizzes.js
│   │   ├── migrateUserRoles.js
│   │   └── createAdmin.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

The exact files may evolve as the application is developed. The backend is separated into models, controllers, routes, middleware, configuration, and services to keep responsibilities organized.

---

## Prerequisites

Install the following before setting up the project:

- **Node.js** (Node.js 20 or later is recommended).
- **npm**, which is included with Node.js.
- A **MongoDB Atlas** account and database connection string, or a compatible MongoDB instance.
- A **Groq API key** for AI learning suggestions. The application can still be used for core learning and quiz functionality when AI feedback is unavailable, provided the backend handles the missing key as configured.
- **Git**.
- A browser such as Chrome, Firefox, or Edge.

Check the installed versions:

```bash
node --version
npm --version
git --version
```

---

## Setup and Installation

### 1. Clone the repository

Replace the URL below with the actual GitHub repository URL:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd CyberXInfinity
```

### 2. Configure MongoDB Atlas

1. Create a MongoDB Atlas cluster, or use an existing cluster.
2. Create a database user with a strong password.
3. Configure the network access/IP allowlist for the machine running the backend.
4. Copy the application's MongoDB connection string.
5. Replace the username, password, and database name in the connection string as required.

The connection string will be used as `MONGODB_URI` in the backend environment file. Do not commit database credentials to GitHub.

### 3. Configure the backend

Open a terminal in the backend directory:

```bash
cd server
```

Create a local environment file by copying the example:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**Linux/macOS:**

```bash
cp .env.example .env
```

Edit `server/.env` and provide the required values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=<long_random_secret>
GROQ_API_KEY=<your_groq_api_key>
GROQ_MODEL=openai/gpt-oss-20b
CLIENT_URL=http://localhost:5173
```

Generate a strong JWT secret rather than using a sample value. One option is:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value into `JWT_SECRET`.

`GROQ_API_KEY` is the secret key issued by Groq. Keep it in the backend `.env` file only. Never create a `VITE_` variable for this key.

### 4. Install backend dependencies

From the `server` directory:

```bash
npm install
```

### 5. Prepare the database

Run the lab seeder to insert the four initial learning labs:

```bash
npm run seed:labs
```

Run the quiz seeder to insert the initial questions associated with those labs:

```bash
npm run seed:quizzes
```

The initial dataset contains **four labs with ten multiple-choice questions per lab** (40 questions in total).

If the database contains user accounts created before role-based access was introduced, run the user-role migration:

```bash
npm run migrate:user-roles
```

This assigns the `student` role to existing accounts that do not yet have a role. Review the seeder implementation before running seed commands on a database containing data you need to preserve. Seed scripts should not be treated as a backup or migration strategy.

### 6. Create an administrator account

The administrator account is created through a backend script, not through public registration.

Temporarily add the following configuration to `server/.env`:

```env
ADMIN_NAME=Project Administrator
ADMIN_USERNAME=cx_admin
ADMIN_EMAIL=<administrator_email>
ADMIN_PASSWORD=<strong_password_of_at_least_12_characters>
```

Run:

```bash
npm run admin:create
```

The script creates a new administrator account or promotes the existing account matching `ADMIN_EMAIL`. When promoting an existing account, the script does not change its password.

After the administrator has been created, remove the temporary `ADMIN_PASSWORD` value from `server/.env`. Keep the real `.env` file out of version control.

### 7. Configure the frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd client
```

Create the frontend environment file:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**Linux/macOS:**

```bash
cp .env.example .env
```

Set the API base URL in `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Install frontend dependencies:

```bash
npm install
```

### 8. Run the application

Start the backend in the `server` terminal:

```bash
npm run dev
```

The backend should be available at:

```text
http://localhost:5000
```

Start the frontend in the `client` terminal:

```bash
npm run dev
```

Vite will display the frontend development URL, normally:

```text
http://localhost:5173
```

Open that URL in a browser. Register a student account to use the learning features, or log in with the administrator account to access management features.

---

## User Roles

CyberXInfinity has two roles:

| Role | Permissions |
|---|---|
| `student` | View published labs, read theory, take quizzes, view personal progress, earn points, and view the student leaderboard. |
| `admin` | Access administrator lab management and manage quiz questions associated with labs. Administrators are excluded from the student leaderboard. |

Public registration always creates a `student` account. Administrator permissions are assigned through the controlled backend administrator setup process.

Authorization is enforced by backend middleware. Hiding administrator links in the React interface is only a user-interface measure and is not the security boundary.

---

## Lab Management — Full CRUD

The main CRUD entity for the project is **Lab**. Administrators manage lab records through the Admin Lab Management interface. Changes are stored persistently in MongoDB and are reflected in the student-facing lab pages.

### Create

Administrators can create a lab using a form containing:

- Lab title and slug.
- Description.
- Difficulty level (Beginner, Intermediate, or Advanced).
- Estimated completion time.
- Display order.
- Key concepts.
- One or more theory sections, each with a title and content.
- Publication status.

The backend validates the submitted data and saves the new lab document in MongoDB.

### Read

Administrators can:

- View the lab collection.
- Open an individual lab record.
- Search by title, description, slug, or key concept.
- Filter by difficulty and publication status.
- Sort by display order, title, difficulty, estimated time, or creation date.

Students can read published lab details and their theory content through the student interface.

### Update

Administrators can open an existing lab, edit its metadata or theory sections, and save the changes. The update is persisted in MongoDB and is used by the student-facing lab pages.

### Delete and archive behavior

The delete operation checks for historical student data before permanently removing a lab:

- **No quiz attempts or student completion references:** the lab and its associated quiz questions can be permanently deleted.
- **Student quiz attempts or completion history exists:** the lab is unpublished/archived instead of being permanently deleted. This preserves historical records and prevents broken references.

Archived labs are excluded from the published student lab listing but remain available to administrators for management and historical reference.

### Lab CRUD API

All endpoints below are protected by JWT authentication and administrator-role authorization.

| Operation | HTTP method | Endpoint |
|---|---|---|
| List, search, filter, sort labs | `GET` | `/api/admin/labs` |
| Create a lab | `POST` | `/api/admin/labs` |
| Read one lab | `GET` | `/api/admin/labs/:id` |
| Update a lab | `PUT` | `/api/admin/labs/:id` |
| Delete or archive a lab | `DELETE` | `/api/admin/labs/:id` |

Supported list query parameters include `q`, `difficulty`, `status`, `sortBy`, and `sortOrder`.

Example:

```text
GET /api/admin/labs?q=security&difficulty=Beginner&status=published&sortBy=title&sortOrder=asc
```

---

## Quiz Management

Each lab has its own set of multiple-choice questions. Administrators can manage these questions from the lab's **Manage Quiz** page.

A question contains:

- Question text.
- Four answer options.
- The correct option index.
- An explanation for the correct answer.
- Topic and difficulty.
- Display order.
- Active/archive status.

### Quiz management API

All endpoints require administrator authorization.

| Operation | HTTP method | Endpoint |
|---|---|---|
| List questions for a lab | `GET` | `/api/admin/labs/:labId/questions` |
| Create a question | `POST` | `/api/admin/labs/:labId/questions` |
| Update a question | `PUT` | `/api/admin/labs/:labId/questions/:questionId` |
| Delete or archive a question | `DELETE` | `/api/admin/labs/:labId/questions/:questionId` |

Questions that already have student attempts are not edited or permanently deleted. They are archived when appropriate so past attempts remain meaningful. Archived questions are excluded from new quizzes.

Students retrieve quiz questions without the correct answer field. The backend evaluates submitted answers and calculates the score; the frontend does not decide the score.

---

## Points and Leaderboard

The initial points policy is:

| Achievement | Points |
|---|---:|
| Each correct answer | +10 |
| First completion of a lab quiz | +25 |
| Perfect quiz score | +25 bonus |

For a ten-question quiz, the maximum first-completion reward is 150 points. Across the four initial labs, the maximum possible score is 600 points.

Lab completion rewards are awarded once per student per lab. Students may retake quizzes for practice, and each attempt is recorded, but repeated attempts do not award the same lab-completion reward again.

The leaderboard ranks **student** accounts by points. Administrator accounts are excluded from the leaderboard and from student rank calculations.

---

## AI Learning Suggestions

After a quiz submission, the backend can send the student's quiz performance data to the Groq API. The AI service generates structured learning feedback containing:

- An overall performance summary.
- Topics the student performed well on.
- Topics that need improvement.
- Study recommendations.
- A suggested next learning step.

The feedback is associated with the quiz attempt and can be displayed on the quiz result page and dashboard.

AI feedback is an additional learning feature. Quiz scoring and points are calculated by the backend independently of the AI response. If AI feedback is unavailable, the quiz result should still be saved and returned.

---

## Main API Endpoints

The following is a summary of the application's main API routes. Administrator endpoints require both a valid JWT and the `admin` role.

| Area | Method | Endpoint | Access |
|---|---|---|---|
| Health | `GET` | `/api/health` | Public |
| Register | `POST` | `/api/auth/register` | Public |
| Login | `POST` | `/api/auth/login` | Public |
| Current user | `GET` | `/api/users/me` | Authenticated |
| Dashboard data | `GET` | `/api/users/dashboard` | Authenticated |
| Published lab list | `GET` | `/api/labs` | Public or as configured by the application |
| Published lab detail | `GET` | `/api/labs/:slug` | Public or as configured by the application |
| Get a lab quiz | `GET` | `/api/quizzes/lab/:labId` | Authenticated |
| Submit a lab quiz | `POST` | `/api/quizzes/:labId/submit` | Authenticated |
| Student leaderboard | `GET` | `/api/leaderboard` | Authenticated |
| Admin lab CRUD | `GET`, `POST`, `PUT`, `DELETE` | `/api/admin/labs` and `/api/admin/labs/:id` | Admin |
| Admin quiz management | `GET`, `POST`, `PUT`, `DELETE` | `/api/admin/labs/:labId/questions...` | Admin |

For exact request and response formats, refer to the corresponding route and controller implementations in `server/src`.

---

## Database Collections

The main MongoDB collections are:

| Collection / Model | Purpose |
|---|---|
| `users` | Student and administrator account details, roles, points, and completed lab references. |
| `labs` | Lab metadata, theory sections, key concepts, difficulty, order, and publication status. |
| `quizquestions` | Questions associated with labs, answer options, correct option, explanations, topics, and active status. |
| `quizattempts` | Student quiz submissions, evaluated answers, scores, percentages, timestamps, and AI feedback. |

### Main relationships

```text
User
  |
  +----< QuizAttempt >---- Lab
              |
              +---- QuizQuestion (answered question references)

Lab
  |
  +----< QuizQuestion

User.completedLabIds
  |
  +---- references completed Lab records
```

A student can have multiple quiz attempts. Each quiz attempt belongs to one user and one lab. A lab can have multiple quiz questions. The `completedLabIds` field on a user tracks which lab-completion rewards have already been granted.

---

## Security and Validation

The application includes the following security measures:

- Passwords are hashed using bcryptjs; plaintext passwords are not stored.
- JWTs are used to authenticate protected API requests.
- Administrator routes check the user's current role in MongoDB.
- Public registration assigns the `student` role and does not accept an administrator role from the client.
- Quiz scores are calculated on the backend.
- Correct answers are not included in the quiz question response sent before submission.
- Lab and quiz management requests validate IDs and input fields.
- Duplicate lab slugs and display-order conflicts are handled by the backend.
- Helmet adds common HTTP security headers.
- CORS is configured for the frontend origin.
- API and authentication rate limiting are configured.
- Request body size is limited.
- Lab and question deletion preserves student history through archival behavior.
- Secret values are kept in environment variables and excluded from version control.

These controls are intended for the scope of an academic mini project and should not be interpreted as a complete production security audit.

---

## Troubleshooting

### MongoDB connection fails

- Check that `MONGODB_URI` is correct.
- Confirm the database username and password.
- Ensure the backend machine's IP address is allowed in MongoDB Atlas Network Access.
- Confirm that the database cluster is running.

### Frontend cannot reach the backend

- Confirm the backend is running on port `5000`, or update the configured URL.
- Check `VITE_API_URL` in `client/.env`.
- Check `CLIENT_URL` in `server/.env` and ensure it matches the frontend origin.
- Restart the Vite development server after changing frontend environment variables.

### JWT or authorization errors

- Log in again to obtain a valid token.
- Confirm `JWT_SECRET` is configured consistently.
- Confirm the account has the intended role in MongoDB.
- Run the role migration if legacy accounts do not have a role.
- Use an administrator account for `/api/admin` endpoints.

### AI suggestions are unavailable

- Confirm `GROQ_API_KEY` is set in `server/.env`.
- Check the selected `GROQ_MODEL` and API account availability.
- Review the backend terminal for Groq API errors.
- Core quiz scoring should remain independent of AI feedback.

### Quiz questions are missing

- Confirm the lab exists and is published.
- Run the lab seeder before the quiz seeder when preparing a fresh database.
- Check that the questions are associated with the correct lab ID and are active.
- Check that the student quiz endpoint filters out archived questions.

---

## Academic Project Information

- **Project:** CyberXInfinity
- **Module:** EC4307 – Web Application Development
- **Project type:** Mini Project
- **Application category:** Gamified cybersecurity learning platform
- **Database:** MongoDB Atlas
- **Primary CRUD entity:** Lab

### Project demonstration

The demonstration should show the working application, including student learning, quiz submission, points, AI suggestions, the student leaderboard, and administrator CRUD operations. In particular, demonstrate Create, Read, Update, and Delete against persistent MongoDB records.

### Screenshots

Add current screenshots of the actual running application to a `docs/screenshots/` directory and link them here before submission. Suggested screenshots:

1. Student dashboard.
2. Lab listing and lab theory page.
3. Quiz interface and quiz result with AI feedback.
4. Student leaderboard.
5. Admin lab listing and search/filter controls.
6. Create/edit lab forms.
7. Admin quiz question management.

### Academic integrity

Ensure the submitted implementation is understood by the project team and complies with the module's academic integrity requirements. Review, test, and appropriately acknowledge any third-party or AI-assisted material according to the lecturer's instructions.

---

**CyberXInfinity — Learn cybersecurity, test your knowledge, and keep improving.**
