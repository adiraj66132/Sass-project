import { useState } from 'react';
import type { Subject } from '../types';
import { GlassCard } from './GlassCard';
import { TopicEditor } from './TopicEditor';
import type { Topic } from '../types';

interface SubjectEditorProps {
    subjects: Subject[];
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
}

export function SubjectEditor({
    subjects,
    onAddSubject,
    onUpdateSubject,
    onRemoveSubject,
    onAddTopic,
    onUpdateTopic,
    onRemoveTopic,
}: SubjectEditorProps) {
    const [newName, setNewName] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleAdd = () => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        onAddSubject(trimmed);
        setNewName('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAdd();
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Subjects
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add a subject…"
                        className="glass-input flex-1"
                    />
                    <button className="glass-btn glass-btn-primary" onClick={handleAdd}>
                        Add
                    </button>
                </div>
            </div>

            {subjects.map((subject, idx) => (
                <GlassCard key={subject.id} variant="subtle" delay={Math.min(idx + 1, 5)} className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-2">Subject Name</h3>
                            <input
                                type="text"
                                value={subject.name}
                                onChange={(e) => onUpdateSubject(subject.id, e.target.value)}
                                className="bg-transparent border-none outline-none text-xl font-medium w-full focus:ring-0"
                                style={{ color: 'rgba(255,255,255,0.95)' }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="glass-btn glass-btn-small !py-2 !px-4 !text-[11px] uppercase tracking-widest font-bold"
                                onClick={() => setExpandedId(expandedId === subject.id ? null : subject.id)}
                            >
                                {expandedId === subject.id ? 'Close' : 'Topics'}
                            </button>
                            <button
                                className="glass-btn glass-btn-small glass-btn-danger !p-2 opacity-40 hover:opacity-100 transition-opacity"
                                onClick={() => onRemoveSubject(subject.id)}
                                title="Remove Subject"
                            >
                                <span className="sr-only">Remove</span>
                                🗑️
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 py-3 border-y border-white/5 mx-[-24px] px-[24px] bg-white/[0.01]">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Topics</span>
                            <span className="text-white/80 font-medium">{subject.topics.length}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Est. Time</span>
                            <span className="text-white/80 font-medium">
                                {subject.topics.reduce((sum, t) => sum + t.estimatedHours, 0).toFixed(1)}h
                            </span>
                        </div>
                    </div>

                    {expandedId === subject.id && (
                        <div className="mt-2 fade-in">
                            <TopicEditor
                                subjectId={subject.id}
                                topics={subject.topics}
                                onAdd={onAddTopic}
                                onUpdate={onUpdateTopic}
                                onRemove={onRemoveTopic}
                            />
                        </div>
                    )}
                </GlassCard>
            ))}

            {subjects.length === 0 && (
                <p className="text-center py-8" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}>
                    No subjects yet. Add one above to get started.
                </p>
            )}
        </div>
    );
}
