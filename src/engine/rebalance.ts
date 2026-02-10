import type { PlannerConfig } from '../types';
import { generatePlan } from './planner';

/**
 * Mark a day as skipped and regenerate the plan.
 * Unfinished topics are automatically redistributed because
 * generatePlan() always recalculates from scratch using current config.
 */
export function skipDayAndRebalance(config: PlannerConfig, dateISO: string): PlannerConfig {
    const newSkipped = config.skippedDays.includes(dateISO)
        ? config.skippedDays
        : [...config.skippedDays, dateISO];

    return { ...config, skippedDays: newSkipped };
}

/**
 * Mark a topic as completed and return updated config.
 */
export function markTopicComplete(
    config: PlannerConfig,
    subjectId: string,
    topicId: string
): PlannerConfig {
    return {
        ...config,
        subjects: config.subjects.map((s) =>
            s.id === subjectId
                ? {
                    ...s,
                    topics: s.topics.map((t) =>
                        t.id === topicId ? { ...t, completed: true } : t
                    ),
                }
                : s
        ),
    };
}

import { uid, todayISO, addDays } from './utils';

/**
 * Toggle a topic's completion status.
 * SCHEDULES A SMART REVIEW if completing a Hard/Medium topic.
 * REMOVES PENDING REVIEW if uncompleting.
 */
export function toggleTopicComplete(
    config: PlannerConfig,
    subjectId: string,
    topicId: string
): PlannerConfig {
    let targetTopic: any = null;
    let targetSubjectName = '';

    // 1. Find the topic to check its difficulty
    for (const s of config.subjects) {
        if (s.id === subjectId) {
            targetTopic = s.topics.find((t) => t.id === topicId);
            targetSubjectName = s.name;
            if (targetTopic) break;
        }
    }

    if (!targetTopic) return config;

    const isCompleting = !targetTopic.completed;
    let newReviews = [...(config.reviews || [])];

    // 2. Smart Review Logic
    if (isCompleting) {
        let reviewDays = 0;
        if (targetTopic.difficulty === 'hard') reviewDays = 2;
        else if (targetTopic.difficulty === 'medium') reviewDays = 4;

        if (reviewDays > 0) {
            const dueDate = addDays(todayISO(), reviewDays);
            newReviews.push({
                id: uid(),
                topicId,
                subjectId,
                subjectName: targetSubjectName,
                topicName: targetTopic.name,
                dueDate,
                completed: false,
            });
        }
    } else {
        // Unchecking -> remove any pending (incomplete) reviews for this topic
        newReviews = newReviews.filter((r) => r.topicId !== topicId || r.completed);
    }

    // 3. Update completion status
    return {
        ...config,
        reviews: newReviews,
        subjects: config.subjects.map((s) =>
            s.id === subjectId
                ? {
                    ...s,
                    topics: s.topics.map((t) =>
                        t.id === topicId ? { ...t, completed: isCompleting } : t
                    ),
                }
                : s
        ),
    };
}

export { generatePlan };
