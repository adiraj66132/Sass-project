import { useMemo, useCallback } from 'react';
import type { PlannerConfig, DayPlan, Subject, Topic } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { generatePlan, getTodayPlan, getUpcomingPlans } from '../engine/planner';
import { skipDayAndRebalance, toggleTopicComplete } from '../engine/rebalance';
import { uid, DIFFICULTY_HOURS, todayISO, addDays } from '../engine/utils';

const DEFAULT_CONFIG: PlannerConfig = {
    examDate: addDays(todayISO(), 30),
    dailyStudyHours: 3,
    subjects: [],
    skippedDays: [],
    reviews: [],
    studySessions: [],
};

export function usePlanner() {
    const [config, setConfig] = useLocalStorage<PlannerConfig>('planner-config', DEFAULT_CONFIG);

    const plan = useMemo(() => generatePlan(config), [config]);
    const todayPlan = useMemo(() => getTodayPlan(plan), [plan]);
    const upcomingPlans = useMemo(() => getUpcomingPlans(plan, 7), [plan]);

    // ── Config Setters ──

    const setExamDate = useCallback((date: string) => {
        setConfig((c) => ({ ...c, examDate: date }));
    }, [setConfig]);

    const setDailyHours = useCallback((hours: number) => {
        setConfig((c) => ({ ...c, dailyStudyHours: hours }));
    }, [setConfig]);

    // ── Subject CRUD ──

    const addSubject = useCallback((name: string) => {
        const subject: Subject = { id: uid(), name, topics: [] };
        setConfig((c) => ({ ...c, subjects: [...c.subjects, subject] }));
    }, [setConfig]);

    const updateSubject = useCallback((id: string, name: string) => {
        setConfig((c) => ({
            ...c,
            subjects: c.subjects.map((s) => (s.id === id ? { ...s, name } : s)),
        }));
    }, [setConfig]);

    const removeSubject = useCallback((id: string) => {
        setConfig((c) => ({
            ...c,
            subjects: c.subjects.filter((s) => s.id !== id),
        }));
    }, [setConfig]);

    // ── Topic CRUD ──

    const addTopic = useCallback(
        (subjectId: string, name: string, difficulty: Topic['difficulty']) => {
            const topic: Topic = {
                id: uid(),
                name,
                estimatedHours: DIFFICULTY_HOURS[difficulty],
                difficulty,
                completed: false,
            };
            setConfig((c) => ({
                ...c,
                subjects: c.subjects.map((s) =>
                    s.id === subjectId ? { ...s, topics: [...s.topics, topic] } : s
                ),
            }));
        },
        [setConfig]
    );

    const updateTopic = useCallback(
        (subjectId: string, topicId: string, updates: Partial<Pick<Topic, 'name' | 'difficulty' | 'estimatedHours'>>) => {
            setConfig((c) => ({
                ...c,
                subjects: c.subjects.map((s) =>
                    s.id === subjectId
                        ? {
                            ...s,
                            topics: s.topics.map((t) => {
                                if (t.id !== topicId) return t;
                                const next = { ...t, ...updates };
                                if (updates.difficulty && !updates.estimatedHours) {
                                    next.estimatedHours = DIFFICULTY_HOURS[updates.difficulty];
                                }
                                return next;
                            }),
                        }
                        : s
                ),
            }));
        },
        [setConfig]
    );

    const removeTopic = useCallback(
        (subjectId: string, topicId: string) => {
            setConfig((c) => ({
                ...c,
                subjects: c.subjects.map((s) =>
                    s.id === subjectId
                        ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) }
                        : s
                ),
            }));
        },
        [setConfig]
    );

    // ── Day Actions ──

    const skipDay = useCallback((dateISO: string) => {
        setConfig((c) => skipDayAndRebalance(c, dateISO));
    }, [setConfig]);

    const toggleComplete = useCallback(
        (subjectId: string, topicId: string) => {
            setConfig((c) => toggleTopicComplete(c, subjectId, topicId));
        },
        [setConfig]
    );

    const toggleReviewComplete = useCallback((reviewId: string) => {
        setConfig((c) => ({
            ...c,
            reviews: c.reviews.map((r) =>
                r.id === reviewId ? { ...r, completed: !r.completed } : r
            ),
        }));
    }, [setConfig]);

    const addStudySession = useCallback((subjectId: string, duration: number) => {
        setConfig((c) => ({
            ...c,
            studySessions: [
                ...c.studySessions,
                { id: uid(), date: todayISO(), subjectId, duration },
            ],
        }));
    }, [setConfig]);

    const resetAll = useCallback(() => {
        setConfig(DEFAULT_CONFIG);
    }, [setConfig]);

    return {
        config,
        plan,
        todayPlan,
        upcomingPlans,
        setExamDate,
        setDailyHours,
        addSubject,
        updateSubject,
        removeSubject,
        addTopic,
        updateTopic,
        removeTopic,
        skipDay,
        toggleComplete,
        toggleReviewComplete,
        addStudySession,
        resetAll,
    };
}
