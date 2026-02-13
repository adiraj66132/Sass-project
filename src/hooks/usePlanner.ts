import { useMemo, useCallback } from 'react';
import type { PlannerConfig, Subject, Topic } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from './useToast';
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
    const { addToast } = useToast();

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
        addToast(`Subject "${name}" added`, 'success');
    }, [setConfig, addToast]);

    const updateSubject = useCallback((id: string, name: string) => {
        setConfig((c) => ({
            ...c,
            subjects: c.subjects.map((s) => (s.id === id ? { ...s, name } : s)),
        }));
    }, [setConfig]);

    const removeSubject = useCallback((id: string) => {
        const subject = config.subjects.find(s => s.id === id);
        setConfig((c) => ({
            ...c,
            subjects: c.subjects.filter((s) => s.id !== id),
        }));
        if (subject) {
            addToast(`Subject "${subject.name}" removed`, 'info');
        }
    }, [setConfig, config.subjects, addToast]);

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
            addToast(`Topic "${name}" added`, 'success');
        },
        [setConfig, addToast]
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
            const subject = config.subjects.find(s => s.id === subjectId);
            const topic = subject?.topics.find(t => t.id === topicId);
            setConfig((c) => ({
                ...c,
                subjects: c.subjects.map((s) =>
                    s.id === subjectId
                        ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) }
                        : s
                ),
            }));
            if (topic) {
                addToast(`Topic "${topic.name}" removed`, 'info');
            }
        },
        [setConfig, config.subjects, addToast]
    );

    // ── Day Actions ──

    const skipDay = useCallback((dateISO: string) => {
        setConfig((c) => skipDayAndRebalance(c, dateISO));
    }, [setConfig]);

    const toggleComplete = useCallback(
        (subjectId: string, topicId: string) => {
            const subject = config.subjects.find(s => s.id === subjectId);
            const topic = subject?.topics.find(t => t.id === topicId);
            const isCompleting = topic && !topic.completed;
            
            setConfig((c) => toggleTopicComplete(c, subjectId, topicId));
            
            if (topic) {
                addToast(
                    isCompleting ? `Completed "${topic.name}"` : `"${topic.name}" marked incomplete`,
                    isCompleting ? 'success' : 'info'
                );
            }
        },
        [setConfig, config.subjects, addToast]
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
        addToast('All data has been reset', 'info');
    }, [setConfig, addToast]);

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
