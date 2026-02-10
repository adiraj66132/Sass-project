/* ── Data Models ── */

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Topic {
    id: string;
    name: string;
    /** Estimated hours — set directly or derived from difficulty */
    estimatedHours: number;
    difficulty: Difficulty;
    completed: boolean;
}

export interface Subject {
    id: string;
    name: string;
    topics: Topic[];
}

export interface ReviewItem {
    id: string;
    topicId: string;
    subjectId: string;
    subjectName: string;
    topicName: string;
    dueDate: string;  // ISO date
    completed: boolean;
}

export interface StudySession {
    id: string;
    date: string;     // ISO date
    subjectId: string;
    duration: number; // minutes
}

export interface PlannerConfig {
    examDate: string;            // ISO date string  YYYY-MM-DD
    dailyStudyHours: number;     // hours per day (decimal allowed)
    subjects: Subject[];
    skippedDays: string[];       // ISO date strings of skipped days
    reviews: ReviewItem[];
    studySessions: StudySession[];
}

export interface DayPlan {
    date: string;                // ISO date string
    tasks: DayTask[];
    isBuffer: boolean;           // last 2-3 days = buffer
    isSkipped: boolean;
    totalHours: number;
}

export interface DayTask {
    topicId: string;
    subjectId: string;
    subjectName: string;
    topicName: string;
    estimatedHours: number;
    completed: boolean;
}

export type ViewTab = 'today' | 'upcoming' | 'stats' | 'setup';
