import { useState, memo } from 'react';
import type { DayPlan } from '../types';
import { GlassCard } from './GlassCard';
import { FocusTimer } from './FocusTimer';
import { launchConfetti } from './Confetti';

interface DailyTasksProps {
    plan: DayPlan;
    onToggle: (subjectId: string, topicId: string) => void;
    onSessionComplete: (subjectId: string, duration: number) => void;
    showDate?: boolean;
}

export const DailyTasks = memo(function DailyTasks({ plan, onToggle, onSessionComplete, showDate = false }: DailyTasksProps) {
    const [activeTask, setActiveTask] = useState<{ topicId: string; subjectId: string; name: string } | null>(null);

    const completed = plan.tasks.filter((t) => t.completed).length;
    const total = plan.tasks.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    const dateStr = new Date(plan.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    if (plan.isSkipped) {
        return (
            <GlassCard variant="subtle" className="flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-white/20 mb-1">
                        {showDate ? dateStr : 'Today'}
                    </h3>
                    <p className="text-white/40 italic">Day skipped</p>
                </div>
                <div className="opacity-20 text-2xl">💤</div>
            </GlassCard>
        );
    }

    if (plan.isBuffer) {
        return (
            <GlassCard variant="subtle" className="flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-white/20 mb-1">
                        {showDate ? dateStr : 'Today'}
                    </h3>
                    <p className="text-white/40">Buffer day — revision only</p>
                </div>
                <div className="opacity-20 text-2xl">⏳</div>
            </GlassCard>
        );
    }

    return (
        <GlassCard variant="subtle" className="flex flex-col gap-6">
            {/* Header / Stats Row */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-2">
                        {showDate ? dateStr : 'Daily Focus'}
                    </h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-light text-white">
                            {Math.round(progress)}<span className="text-lg opacity-40">%</span>
                        </span>
                        <span className="text-xs text-white/30">complete</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-white/30 text-xs mb-1">Estimated</p>
                    <p className="text-white/80 font-medium">{plan.totalHours.toFixed(1)}h</p>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/20 font-bold">
                    <span>{completed} of {total} items</span>
                    <span>Ready</span>
                </div>
                <div className="glass-progress h-2 rounded-full">
                    <div
                        className="glass-progress-fill rounded-full"
                        style={{
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.4))'
                        }}
                    />
                </div>
            </div>

            {/* Task List */}
            <div className="flex flex-col gap-3" role="list" aria-label="Tasks">
                {plan.tasks.map((task) => (
                    <div
                        key={task.topicId}
                        className="group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-white/[0.02]"
                        style={{
                            border: '1px solid rgba(255,255,255,0.03)',
                            background: task.completed ? 'transparent' : 'rgba(255,255,255,0.01)',
                            opacity: task.completed ? 0.4 : 1,
                        }}
                        role="listitem"
                    >
                        {/* Checkbox */}
                        <div
                            className={`glass-check ${task.completed ? 'checked' : ''} !w-6 !h-6 !rounded-lg active:scale-95 transition-transform`}
                            onClick={() => {
                                onToggle(task.subjectId, task.topicId);
                                if (!task.completed) launchConfetti();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onToggle(task.subjectId, task.topicId);
                                    if (!task.completed) launchConfetti();
                                }
                            }}
                            role="checkbox"
                            aria-checked={task.completed}
                            aria-label={`Mark ${task.topicName} as ${task.completed ? 'incomplete' : 'complete'}`}
                            tabIndex={0}
                        />

                        {/* Title Section */}
                        <div className="flex flex-col flex-1 min-w-0">
                            <span
                                className="font-medium truncate transition-all duration-500"
                                style={{
                                    color: task.completed ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.9)',
                                    fontSize: '0.95rem',
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                }}
                            >
                                {task.topicName}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-white/20 truncate">
                                    {task.subjectName}
                                </span>
                                <span className="text-[10px] text-white/10">•</span>
                                <span className="text-[10px] text-white/30 font-medium">
                                    {task.estimatedHours}h
                                </span>
                            </div>
                        </div>

                        {/* Action */}
                        {!task.completed && (
                            <button
                                className="glass-btn glass-btn-small !py-2 !px-4 !text-[11px] uppercase tracking-widest font-bold"
                                onClick={() => setActiveTask({ topicId: task.topicId, subjectId: task.subjectId, name: task.topicName })}
                                aria-label={`Start focus timer for ${task.topicName}`}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    borderColor: 'rgba(255,255,255,0.08)',
                                }}
                            >
                                Focus
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {total === 0 && (
                <div className="py-8 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/[0.02] flex items-center justify-center text-xl opacity-20">
                        ✅
                    </div>
                    <p className="text-white/20 text-xs uppercase tracking-widest font-bold">
                        All clear for today
                    </p>
                </div>
            )}

            {activeTask && (
                <FocusTimer
                    taskName={activeTask.name}
                    onComplete={(duration) => {
                        onSessionComplete(activeTask.subjectId, duration);
                        setActiveTask(null);
                        launchConfetti();
                    }}
                    onCancel={() => setActiveTask(null)}
                />
            )}
        </GlassCard>
    );
});
