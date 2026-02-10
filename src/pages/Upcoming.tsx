import type { DayPlan } from '../types';
import { DailyTasks } from '../components/DailyTasks';

interface UpcomingProps {
    plans: DayPlan[];
    onToggle: (subjectId: string, topicId: string) => void;
    onSessionComplete: (subjectId: string, duration: number) => void;
}

export function Upcoming({ plans, onToggle, onSessionComplete }: UpcomingProps) {
    return (
        <div className="flex flex-col gap-6 fade-in">
            {/* Header */}
            <div className="text-center mb-2">
                <h1 className="text-2xl font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Upcoming
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
                    Next 7 days
                </p>
            </div>

            {/* Day cards */}
            {plans.length > 0 ? (
                plans.map((plan, idx) => (
                    <div
                        key={plan.date}
                        className="slide-up"
                        style={{ opacity: 0, animationDelay: `${idx * 0.06}s` }}
                    >
                        <DailyTasks
                            plan={plan}
                            onToggle={onToggle}
                            onSessionComplete={onSessionComplete}
                            showDate
                        />
                    </div>
                ))
            ) : (
                <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}>
                    No upcoming plans. Add subjects and topics in Setup.
                </div>
            )}
        </div>
    );
}
