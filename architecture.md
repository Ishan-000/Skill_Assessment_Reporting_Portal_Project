# System Architecture & Flow Diagrams

This document provides a visual overview of the Skill Assessment Portal's architecture and key data flows using Mermaid diagrams.

## 1. High-Level System Architecture

This diagram illustrates the overall structure of the application. It shows the main services, their hosting environments, and how they communicate with each other and the end-user.

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

    User -- "Interacts via HTTPS" --> ReactApp;
    ReactApp -- "HTTPS API Calls" --> BackendAPI;
    BackendAPI -- "SQL Queries (Private Network)" --> DB;
    
    Repo -- "CI/CD: Triggers Deploy" --> ReactApp;
    Repo -- "CI/CD: Triggers Deploy" --> BackendAPI;
