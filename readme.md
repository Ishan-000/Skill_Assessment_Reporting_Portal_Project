# Skill Assessment & Reporting Portal

A full-stack web application built with Node.js, Express, MySQL, and React, designed for creating, taking, and analyzing skill-based quizzes. This project features a secure, role-based system for both regular users and administrators.

---

## 🚀 Live Demo

| Service  | Link                                                |
| :------- | :-------------------------------------------------- |
| **Frontend (Vercel)** | `https://skill-assessment-reporting-portal-p.vercel.app/` |
| **Backend API (Railway)** | `https://skillassessmentreportingportalproject-production.up.railway.app/api` |

---

## ✨ Key Features

### User Features
- **Secure Registration & Login:** JWT-based authentication ensures secure access.
- **User Dashboard:** A central hub to view available quizzes and past performance.
- **Take Quizzes:** Select a skill category and complete a multiple-choice quiz.
- **Performance History:** View a detailed table of all past quiz attempts with scores and completion dates.

### Admin Features
- **Role-Based Access:** A separate, protected admin panel for management tasks.
- **Content Management:**
  - Create new skill categories (e.g., JavaScript, Python).
  - Create detailed questions with multiple-choice options and assign them to a skill.
  - Delete existing questions.
- **Reporting & Analytics:**
  - View a "Skill Gap" report, visualized as a bar chart, showing the average score across all users for each skill. This helps identify areas where users are struggling the most.

---

## 💻 Tech Stack

| Area        | Technologies                                       |
| :---------- | :------------------------------------------------- |
| **Frontend**  | React (Vite), React Router, Axios, Chart.js        |
| **Backend**   | Node.js, Express.js, JWT, Bcrypt.js, Joi           |
| **Database**  | MySQL                                              |
| **Deployment**| Vercel (Frontend), Railway (Backend & Database)    |

---

## 🛠️ Getting Started: Local Setup

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

- Node.js (v18 or later)
- MySQL Server
- Git
- Docker & Docker Compose (Optional, for containerized setup)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd skill-assessment-portal
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    npm install
    ```
    - Create a `.env` file in the `backend` directory. Copy the contents of `.env.example` (if provided) or use the template below.
    - Update the `.env` file with your MySQL database credentials and a strong JWT secret.

    ```env
    # .env in /backend
    PORT=5000
    DB_HOST=localhost
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=skill_assessment
    JWT_SECRET=your_super_strong_and_long_secret_key
    ```

3.  **Setup the Frontend:**
    ```bash
    cd frontend
    npm install
    ```

4.  **Database Migration:**
    - Connect to your MySQL server.
    - Create a database named `skill_assessment`.
    - Run the SQL script located at `backend/db_schema.sql` to create all the necessary tables and indexes.

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    # From the /backend directory
    npm run dev
    ```
    The backend will be running on `http://localhost:5000`.

2.  **Start the Frontend Development Server:**
    ```bash
    # From the /frontend directory (in a new terminal)
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy).

---

## 🗄️ Database Schema Design

The database is designed with normalization and performance in mind, using foreign key constraints to maintain data integrity.

```sql
-- users: Stores user credentials and roles.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- skills: Stores skill categories.
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- questions: Stores all quiz questions linked to a skill.
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_id INT NOT NULL,
    question_text TEXT NOT NULL,
    options JSON NOT NULL,
    correct_option_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- quiz_attempts: A summary record for each quiz taken by a user.
CREATE TABLE quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- quiz_answers: Detailed log of each answer within an attempt.
CREATE TABLE quiz_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option_index INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);