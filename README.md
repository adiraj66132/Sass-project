# Study Planner: Project Analysis & Documentation

## Overview
This project (codenamed **low-sass** in the repository) is a high-performance, visually premium study planning application designed to help students organize their exam preparation. It features a sophisticated scheduling engine that dynamically distributes study topics based on difficulty and time constraints, wrapped in a modern "Liquid Glass" interface.

## Key Features

### 1. Dynamic Scheduling Engine
The heart of the application is a greedy scheduling algorithm that:
- **Calculates Effort**: Estimates study time based on topic difficulty (Easy, Medium, Hard).
- **Auto-Distribution**: Automatically spreads topics across available days until the exam date.
- **Buffer Management**: Reserves the final few days before an exam as "Buffer Days" for pure revision, ensuring no new topics are started at the last minute.
- **Priority Sorting**: Harder and longer topics are prioritized earlier in the plan to ensure they receive maximum focus.

### 2. Smart Review System (SRS-Lite)
The app implements a simplified Spaced Repetition System (SRS):
- Completing a **Hard** topic automatically schedules a review session in **2 days**.
- Completing a **Medium** topic schedules a review in **4 days**.
- Reviews appear in a dedicated "Review Due" section on the daily dashboard.

### 3. Real-time Rebalancing
The plan is never static. If a user marks a day as "Skipped," the engine instantly redistributes all remaining tasks across the updated timeline, ensuring the user stays on track without manual rescheduling.

### 4. High-Performance Focus Timer
Each task includes a built-in focus timer.
- **Track Interaction**: Users can launch a timer directly from their task list.
- **Analytics Integration**: Completed sessions are logged into an analytics engine that tracks total hours spent per subject.

### 5. Premium "Liquid Glass" UI
Built with React and Vanilla CSS, the UI prioritizes aesthetics:
- **Glassmorphism**: Use of semi-transparent cards, blurs, and subtle inner glows.
- **Micro-animations**: Smooth transitions, slide-up effects, and confetti celebrations upon task completion.
- **Responsive Navigation**: Seamless switching between Today, Upcoming, Stats, and Setup views.

---

## Use Cases & Occasions

### Use Case 1: Final Exam Preparation
**Occasion**: *Started 4-8 weeks before a major exam.*
- **How it helps**: The user inputs all subjects and topics. The engine ensures every topic is covered before the "Buffer Zone" begins, preventing the common "last-minute cramming" syndrome.

### Use Case 2: Daily Focus & Accountability
**Occasion**: *Day-to-day study routine.*
- **How it helps**: Instead of deciding *what* to study, the user opens the "Today" tab and sees exactly which topics are due. The "Focus Timer" provides a psychological boost to stay on task.

### Use Case 3: Recovery from Setbacks
**Occasion**: *User misses a day due to illness or personal reasons.*
- **How it helps**: The user clicks "Skip Today." The app handles the heavy lifting of rescheduling, removing the anxiety of "falling behind" by providing a mathematically optimized path forward.

---

## Technical Architecture

| Component | Technology | Responsibility |
| :--- | :--- | :--- |
| **Frontend** | React + Vite + TS | UI rendering and state management. |
| **Logic Engine** | TypeScript | Scheduling, rebalancing, and data sorting. |
| **Persistence** | LocalStorage | Saving user config, subjects, and sessions (offline-first). |
| **Styles** | Vanilla CSS | Custom liquid-glass design system and animations. |

---

## Getting Started

1. **Clone the repository.**
2. **Install dependencies**: `npm install`
3. **Run the development server**: `npm run dev`
4. **Build for production**: `npm run build`
