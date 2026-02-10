import type { DayPlan, PlannerConfig } from '../types';
import { DailyTasks } from '../components/DailyTasks';
import { GlassCard } from '../components/GlassCard';
import { formatDate, isSameDay, todayISO } from '../engine/utils';
import { launchConfetti } from '../components/Confetti';

interface TodayProps {
    plan: DayPlan | null;
    config: PlannerConfig;
    onToggle: (subjectId: string, topicId: string) => void;
    onSkip: (dateISO: string) => void;
    onReviewToggle: (reviewId: string) => void;
    onSessionComplete: (subjectId: string, duration: number) => void;
}

export function Today({ plan, config, onToggle, onSkip, onReviewToggle, onSessionComplete }: TodayProps) {
    const totalTopics = config.subjects.reduce((sum, s) => sum + s.topics.length, 0);
    const completedTopics = config.subjects.reduce(
        (sum, s) => sum + s.topics.filter((t) => t.completed).length,
        0
    );
    const overallProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

    const todayStr = todayISO();
    const dueReviews = config.reviews.filter(
        (r) => !r.completed && (r.dueDate <= todayStr)
    );

    return (
        <div className="flex flex-col gap-6 fade-in">
            {/* Header */}
            <div className="text-center mb-2">
                <h1 className="text-2xl font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Today
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
                    {plan ? formatDate(plan.date) : 'No plan generated'}
                </p>
            </div>

            {/* Overall progress */}
            {totalTopics > 0 && (
                <GlassCard variant="subtle" delay={1}>
                    <div className="flex justify-between items-center mb-2">
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                            Overall Progress
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                            {completedTopics}/{totalTopics}
                        </span>
                    </div>
                    <div className="glass-progress">
                        <div className="glass-progress-fill" style={{ width: `${overallProgress}%` }} />
                    </div>
                </GlassCard>
            )}

            {/* Smart Reviews */}
            {dueReviews.length > 0 && (
                <div className="slide-up">
                    <h3 className="text-sm font-medium mb-2 pl-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Review Due
                    </h3>
                    <GlassCard variant="subtle">
                        <div className="flex flex-col gap-1">
                            {dueReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="flex items-center gap-3 py-3"
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                >
                                    <div
                                        className="glass-check"
                                        onClick={() => {
                                            onReviewToggle(review.id);
                                            launchConfetti();
                                        }}
                                    />
                                    <div className="flex flex-col flex-1 gap-0.5">
                                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                                            {review.topicName}
                                        </span>
                                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                                            {review.subjectName} · Revision
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Today's tasks */}
            {plan ? (
                <div className="slide-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
                    <h3 className="text-sm font-medium mb-2 pl-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Tasks
                    </h3>
                    <DailyTasks
                        plan={plan}
                        onToggle={onToggle}
                        onSessionComplete={onSessionComplete}
                    />
                    {!plan.isBuffer && !plan.isSkipped && plan.tasks.length > 0 && (
                        <div className="mt-3 flex justify-end">
                            <button
                                className="glass-btn glass-btn-small"
                                onClick={() => onSkip(plan.date)}
                                style={{ opacity: 0.6 }}
                            >
                                Skip today
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <GlassCard>
                    <p className="text-center" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
                        {totalTopics === 0
                            ? 'Add subjects and topics in Setup to generate your plan.'
                            : 'No plan for today. Check your exam date in Setup.'}
                    </p>
                </GlassCard>
            )}
        </div>
    );
}
