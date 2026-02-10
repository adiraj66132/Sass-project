import type { StudySession, Subject } from '../types';
import { GlassCard } from '../components/GlassCard';
import { SubjectChart } from '../components/SubjectChart';

interface StatsProps {
    sessions: StudySession[];
    subjects: Subject[];
}

export function Stats({ sessions, subjects }: StatsProps) {
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    // Prepare chart data
    const chartData = subjects.map((subject, idx) => {
        const subjectMinutes = sessions
            .filter((s) => s.subjectId === subject.id)
            .reduce((sum, s) => sum + s.duration, 0);

        // Generate a calm color based on index
        const hue = (idx * 137.5) % 360; // Golden angle for distribution
        const color = `hsl(${hue}, 70%, 60%)`;

        return {
            label: subject.name,
            value: subjectMinutes,
            color,
        };
    }).filter(d => d.value > 0);

    return (
        <div className="flex flex-col gap-6 fade-in">
            {/* Header */}
            <div className="text-center mb-2">
                <h1 className="text-2xl font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Analytics
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
                    Track your focus
                </p>
            </div>

            <GlassCard variant="strong" className="flex items-center justify-between py-10 px-8">
                <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Total Time Spent</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-light text-white">{totalHours}</span>
                        <span className="text-lg text-white/40">hours</span>
                    </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center text-3xl border border-white/5">
                    ⏱️
                </div>
            </GlassCard>

            {chartData.length > 0 ? (
                <div className="slide-up" style={{ animationDelay: '0.1s' }}>
                    <SubjectChart data={chartData} />
                </div>
            ) : (
                <GlassCard variant="subtle" className="flex flex-col items-center gap-4 py-12 slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                        <span className="text-2xl opacity-20">📊</span>
                    </div>
                    <p className="text-center px-6" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        No study data yet. Use the <strong className="text-white/60">Focus Timer</strong> on your daily tasks to track your progress.
                    </p>
                </GlassCard>
            )}
        </div>
    );
}
