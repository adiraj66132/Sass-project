import type { Difficulty } from '../types';

/** Difficulty → estimated hours mapping */
export const DIFFICULTY_HOURS: Record<Difficulty, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
};

/** Number of buffer days before exam (revision-only) */
export const BUFFER_DAYS = 2;

/** Generate a unique ID */
export function uid(): string {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

/** Days between two ISO date strings (inclusive of start, exclusive of end) */
export function daysBetween(startISO: string, endISO: string): number {
    const start = new Date(startISO + 'T00:00:00');
    const end = new Date(endISO + 'T00:00:00');
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}

/** Get ISO date string for today */
export function todayISO(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Add N days to an ISO date string and return new ISO string */
export function addDays(dateISO: string, n: number): string {
    const d = new Date(dateISO + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Format an ISO date to readable string  e.g. "Mon, Feb 10" */
export function formatDate(dateISO: string): string {
    const d = new Date(dateISO + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

/** Check if two ISO dates are the same day */
export function isSameDay(a: string, b: string): boolean {
    return a === b;
}
