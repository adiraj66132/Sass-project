import type { PlannerConfig, DayPlan, DayTask } from '../types';
import { flattenAndSort } from './scheduler';
import { daysBetween, todayISO, addDays, BUFFER_DAYS } from './utils';

/**
 * Generate a full revision plan from config.
 *
 * Algorithm:
 * 1. Calculate total days from today → exam date
 * 2. Mark last BUFFER_DAYS as buffer (revision only)
 * 3. Exclude skipped days from available slots
 * 4. Flatten & sort all incomplete topics (hardest first)
 * 5. Greedily assign topics to days without exceeding dailyStudyHours
 * 6. Return array of DayPlan objects
 */
export function generatePlan(config: PlannerConfig): DayPlan[] {
    const today = todayISO();
    const totalDays = daysBetween(today, config.examDate);

    if (totalDays <= 0) return [];

    const plans: DayPlan[] = [];
    const tasks = flattenAndSort(config.subjects);
    let taskIdx = 0;

    for (let i = 0; i < totalDays; i++) {
        const date = addDays(today, i);
        const isBuffer = i >= totalDays - BUFFER_DAYS;
        const isSkipped = config.skippedDays.includes(date);

        const dayPlan: DayPlan = {
            date,
            tasks: [],
            isBuffer,
            isSkipped,
            totalHours: 0,
        };

        if (!isBuffer && !isSkipped) {
            // Fill this day with tasks
            let remaining = config.dailyStudyHours;

            while (taskIdx < tasks.length && remaining > 0) {
                const task = tasks[taskIdx];
                if (task.estimatedHours <= remaining + 0.01) {
                    dayPlan.tasks.push({ ...task });
                    dayPlan.totalHours += task.estimatedHours;
                    remaining -= task.estimatedHours;
                    taskIdx++;
                } else {
                    // Topic doesn't fit today — try next day
                    break;
                }
            }
        }

        plans.push(dayPlan);
    }

    return plans;
}

/** Get today's plan from a full plan array */
export function getTodayPlan(plans: DayPlan[]): DayPlan | null {
    const today = todayISO();
    return plans.find((p) => p.date === today) ?? null;
}

/** Get plans for the next N days (starting from today) */
export function getUpcomingPlans(plans: DayPlan[], days: number = 7): DayPlan[] {
    const today = todayISO();
    const todayIdx = plans.findIndex((p) => p.date === today);
    if (todayIdx === -1) return plans.slice(0, days);
    return plans.slice(todayIdx, todayIdx + days);
}
