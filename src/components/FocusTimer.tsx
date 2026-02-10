import { useState, useEffect, useRef } from 'react';
import { GlassCard } from './GlassCard';

interface FocusTimerProps {
    initialMinutes?: number;
    taskName: string;
    onComplete: (durationMinutes: number) => void;
    onCancel: () => void;
}

export function FocusTimer({ initialMinutes = 25, taskName, onComplete, onCancel }: FocusTimerProps) {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [duration, setDuration] = useState(initialMinutes);
    const totalTimeRef = useRef(initialMinutes * 60);

    useEffect(() => {
        let interval: number | undefined;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            onComplete(duration);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete, duration]);

    const toggleTimer = () => setIsActive(!isActive);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = ((totalTimeRef.current - timeLeft) / totalTimeRef.current) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in">
            <GlassCard variant="strong" className="w-full max-w-sm p-8 flex flex-col items-center gap-6 relative overflow-hidden">
                {/* Liquid Background Effect */}
                <div
                    className="absolute bottom-0 left-0 right-0 bg-blue-500/10 transition-all duration-1000 ease-linear pointer-events-none"
                    style={{ height: `${progress}%` }}
                />

                <div className="z-10 text-center">
                    <h3 className="text-white/60 text-sm uppercase tracking-wider mb-2">Focusing On</h3>
                    <h2 className="text-xl font-bold text-white mb-6">{taskName}</h2>

                    <div className="text-6xl font-mono font-light text-white mb-8 tracking-wider">
                        {formatTime(timeLeft)}
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            className={`glass-btn ${isActive ? 'glass-btn-danger' : 'glass-btn-primary'} w-24`}
                            onClick={toggleTimer}
                        >
                            {isActive ? 'Pause' : 'Start'}
                        </button>
                        <button
                            className="glass-btn"
                            onClick={onCancel}
                        >
                            Stop
                        </button>
                    </div>
                </div>

                {/* Quick select (only if not active/started) */}
                {!isActive && timeLeft === totalTimeRef.current && (
                    <div className="flex gap-2 z-10 pt-4">
                        {[15, 25, 45, 60].map((m) => (
                            <button
                                key={m}
                                onClick={() => {
                                    setDuration(m);
                                    setTimeLeft(m * 60);
                                    totalTimeRef.current = m * 60;
                                }}
                                className={`px-3 py-1 rounded-full text-xs border ${duration === m
                                        ? 'bg-white/20 border-white/40 text-white'
                                        : 'bg-transparent border-white/10 text-white/40 hover:bg-white/5'
                                    }`}
                            >
                                {m}m
                            </button>
                        ))}
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
