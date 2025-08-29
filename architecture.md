# System Architecture & Flow Diagrams

This document provides a visual overview of the Skill Assessment Portal's architecture and key data flows using Mermaid diagrams.

## 1. High-Level System Architecture

This diagram illustrates the overall structure of the application, following a C4 model (Container level). It shows the main services, their hosting environments, and how they communicate with each other and the end-user.

```mermaid
graph TD
    subgraph "User's Browser"
        User("👤 User")
    end

    subgraph "Vercel (Frontend Hosting)"
        ReactApp["⚛️ React SPA (Frontend)"]
    end

    subgraph "Railway (Backend Hosting)"
        BackendAPI["⚙️ Node.js / Express API"]
        DB["🗄️ MySQL Database"]
    end
    
    subgraph "GitHub"
        Repo["📦 GitHub Repository"]
    end

    User -- "Interacts via HTTPS" --> ReactApp
    ReactApp -- "HTTPS API Calls" --> BackendAPI
    BackendAPI -- "SQL Queries (Private Network)" --> DB
    
    Repo -- "CI/CD: Triggers Deploy" --> ReactApp
    Repo -- "CI/CD: Triggers Deploy" --> BackendAPI




sequenceDiagram
    participant User
    participant ReactFrontend as "React Frontend (Vercel)"
    participant NodeJS_Backend as "Node.js API (Railway)"
    participant MySQL_DB as "MySQL DB (Railway)"

    User->>ReactFrontend: Clicks 'Submit Quiz' with answers
    
    ReactFrontend->>NodeJS_Backend: POST /api/quizzes/submit (sends answers payload)
    
    NodeJS_Backend->>MySQL_DB: SELECT id, correct_option_index FROM questions WHERE id IN (...)
    note right of NodeJS_Backend: Fetches correct answers to score the quiz
    MySQL_DB-->>NodeJS_Backend: Returns correct answers data
    
    NodeJS_Backend->>NodeJS_Backend: Calculates final score based on comparison
    
    NodeJS_Backend->>MySQL_DB: START TRANSACTION
    note right of NodeJS_Backend: Ensures all writes succeed or none do
    NodeJS_Backend->>MySQL_DB: 1. INSERT INTO quiz_attempts (user_id, skill_id, score)
    NodeJS_Backend->>MySQL_DB: 2. INSERT INTO quiz_answers (attempt_id, question_id, ...)
    NodeJS_Backend->>MySQL_DB: COMMIT TRANSACTION
    
    NodeJS_Backend-->>ReactFrontend: Returns { success: true, score: 85.50 }
    
    ReactFrontend->>User: Displays 'Quiz Complete! Your score: 85.50%'