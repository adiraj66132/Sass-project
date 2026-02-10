import { GlassCard } from './GlassCard';

interface SubjectChartProps {
    data: {
        label: string;
        value: number; // minutes
        color: string;
    }[];
}

export function SubjectChart({ data }: SubjectChartProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const sorted = [...data].sort((a, b) => b.value - a.value);

    if (total === 0) return null;

    return (
        <GlassCard variant="subtle" className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-wide">Study Distribution</h3>

            <div className="flex w-full h-10 rounded-full overflow-hidden border border-white/5 shadow-inner">
                {data.map((item, idx) => {
                    const width = (item.value / total) * 100;
                    return (
                        <div
                            key={idx}
                            style={{
                                width: `${width}%`,
                                background: `linear-gradient(to bottom, ${item.color}, ${item.color}ee)`,
                                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 15px ${item.color}33`
                            }}
                            className="h-full transition-all duration-1000 ease-out border-r border-black/10 last:border-r-0"
                            title={`${item.label}: ${Math.round(width)}%`}
                        />
                    );
                })}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
                {sorted.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-white/80">{item.label}</span>
                        <span className="text-white/40 ml-auto">{(item.value / 60).toFixed(1)}h</span>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
