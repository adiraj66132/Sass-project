import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { DatePicker } from '../components/DatePicker';
import { SubjectEditor } from '../components/SubjectEditor';
import { ConfirmDialog } from '../components/Modal';
import type { PlannerConfig, Topic } from '../types';
import { todayISO } from '../engine/utils';

interface SetupProps {
    config: PlannerConfig;
    onSetExamDate: (date: string) => void;
    onSetDailyHours: (hours: number) => void;
    onAddSubject: (name: string) => void;
    onUpdateSubject: (id: string, name: string) => void;
    onRemoveSubject: (id: string) => void;
    onAddTopic: (subjectId: string, name: string, difficulty: Topic['difficulty']) => void;
    onUpdateTopic: (
        subjectId: string,
        topicId: string,
        updates: Partial<Pick<Topic, 'name' | 'difficulty' | 'estimatedHours'>>
    ) => void;
    onRemoveTopic: (subjectId: string, topicId: string) => void;
    onReset: () => void;
}

export function Setup({
    config,
    onSetExamDate,
    onSetDailyHours,
    onAddSubject,
    onUpdateSubject,
    onRemoveSubject,
    onAddTopic,
    onUpdateTopic,
    onRemoveTopic,
    onReset,
}: SetupProps) {
    const [showResetModal, setShowResetModal] = useState(false);

    const totalTopics = config.subjects.reduce((sum, s) => sum + s.topics.length, 0);
    const totalHours = config.subjects.reduce(
        (sum, s) => sum + s.topics.reduce((ts, t) => ts + t.estimatedHours, 0),
        0
    );

    return (
        <div className="flex flex-col gap-6 fade-in">
            {/* Header */}
            <div className="text-center mb-2">
                <h1 className="text-2xl font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Setup
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
                    Configure your revision plan
                </p>
            </div>

            {/* Date & Hours */}
            <GlassCard delay={1}>
                <div className="flex flex-col gap-5">
                    <DatePicker
                        label="Exam Date"
                        value={config.examDate}
                        onChange={onSetExamDate}
                        min={todayISO()}
                    />
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            Daily Study Hours
                        </label>
                        <input
                            type="number"
                            min={0.5}
                            max={16}
                            step={0.5}
                            value={config.dailyStudyHours}
                            onChange={(e) => onSetDailyHours(parseFloat(e.target.value) || 1)}
                            className="glass-input"
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Subjects & Topics */}
            <GlassCard delay={2}>
                <SubjectEditor
                    subjects={config.subjects}
                    onAddSubject={onAddSubject}
                    onUpdateSubject={onUpdateSubject}
                    onRemoveSubject={onRemoveSubject}
                    onAddTopic={onAddTopic}
                    onUpdateTopic={onUpdateTopic}
                    onRemoveTopic={onRemoveTopic}
                />
            </GlassCard>

            {/* Summary */}
            {totalTopics > 0 && (
                <GlassCard variant="subtle" delay={3}>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                                {config.subjects.length} subject{config.subjects.length !== 1 ? 's' : ''} · {totalTopics} topic{totalTopics !== 1 ? 's' : ''}
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
                                {totalHours.toFixed(1)}h total study time
                            </span>
                        </div>
                        <button className="glass-btn glass-btn-small glass-btn-danger" onClick={() => setShowResetModal(true)}>
                            Reset All
                        </button>
                    </div>
                </GlassCard>
            )}

            <ConfirmDialog
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                title="Reset All Data"
                message="This will delete all your subjects, topics, and progress. This action cannot be undone."
                confirmLabel="Reset"
                onConfirm={onReset}
                destructive
            />
        </div>
    );
}
