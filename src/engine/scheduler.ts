import type { Subject, DayTask } from '../types';

/**
 * Flatten all topics from all subjects into an ordered task list.
 * Sort by estimatedHours descending (harder/longer topics first).
 */
export function flattenAndSort(subjects: Subject[]): DayTask[] {
    const tasks: DayTask[] = [];

    for (const subject of subjects) {
        for (const topic of subject.topics) {
            if (topic.completed) continue;
            tasks.push({
                topicId: topic.id,
                subjectId: subject.id,
                subjectName: subject.name,
                topicName: topic.name,
                estimatedHours: topic.estimatedHours,
                completed: false,
            });
        }
    }

    // Longer / harder topics first
    tasks.sort((a, b) => b.estimatedHours - a.estimatedHours);

    return tasks;
}
