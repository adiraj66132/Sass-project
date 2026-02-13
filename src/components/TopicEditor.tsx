import { useState } from 'react';
import type { Topic, Difficulty } from '../types';
import { ConfirmDialog } from './Modal';

interface TopicEditorProps {
    subjectId: string;
    topics: Topic[];
    onAdd: (subjectId: string, name: string, difficulty: Difficulty) => void;
    onUpdate: (
        subjectId: string,
        topicId: string,
        updates: Partial<Pick<Topic, 'name' | 'difficulty' | 'estimatedHours'>>
    ) => void;
    onRemove: (subjectId: string, topicId: string) => void;
}

export function TopicEditor({ subjectId, topics, onAdd, onUpdate, onRemove }: TopicEditorProps) {
    const [name, setName] = useState('');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [deleteTopic, setDeleteTopic] = useState<{ id: string; name: string } | null>(null);

    const handleAdd = () => {
        const trimmed = name.trim();
        if (!trimmed) return;
        onAdd(subjectId, trimmed, difficulty);
        setName('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAdd();
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Add topic row */}
            <div className="flex gap-4 items-end">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Topic name…"
                    className="glass-input flex-1"
                    style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                />
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="glass-select"
                    style={{ padding: '10px 32px 10px 14px', fontSize: '0.85rem' }}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <button className="glass-btn glass-btn-small glass-btn-primary" onClick={handleAdd} style={{ padding: '10px 16px' }}>
                    +
                </button>
            </div>

            {/* Topic list */}
            {topics.map((topic) => (
                <div
                    key={topic.id}
                    className="flex items-center gap-3 py-2 fade-in"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                    <div
                        className={`glass-badge ${topic.difficulty}`}
                        style={{ minWidth: '52px', justifyContent: 'center' }}
                    >
                        {topic.difficulty}
                    </div>

                    <input
                        type="text"
                        value={topic.name}
                        onChange={(e) => onUpdate(subjectId, topic.id, { name: e.target.value })}
                        className="bg-transparent border-none outline-none flex-1"
                        style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}
                    />

                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {topic.estimatedHours}h
                    </span>

                    <button
                        className="glass-btn glass-btn-small glass-btn-danger"
                        onClick={() => setDeleteTopic({ id: topic.id, name: topic.name })}
                        style={{ padding: '4px 10px' }}
                        aria-label={`Delete topic ${topic.name}`}
                    >
                        ×
                    </button>
                </div>
            ))}

            {topics.length === 0 && (
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', textAlign: 'center', padding: '8px 0' }}>
                    No topics yet
                </p>
            )}

            <ConfirmDialog
                isOpen={!!deleteTopic}
                onClose={() => setDeleteTopic(null)}
                title="Delete Topic"
                message={`Are you sure you want to delete "${deleteTopic?.name}"?`}
                confirmLabel="Delete"
                onConfirm={() => {
                    if (deleteTopic) {
                        onRemove(subjectId, deleteTopic.id);
                    }
                }}
                destructive
            />
        </div>
    );
}
