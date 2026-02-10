import type { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'strong' | 'subtle';
    animate?: boolean;
    delay?: number;
    style?: React.CSSProperties;
}

export function GlassCard({
    children,
    className = '',
    variant = 'default',
    animate = true,
    delay = 0,
    style = {},
}: GlassCardProps) {
    const variantClass =
        variant === 'strong' ? 'glass-strong' : variant === 'subtle' ? 'glass-subtle' : 'glass';

    const staggerClass = delay > 0 && delay <= 5 ? `stagger-${delay}` : '';

    return (
        <div
            className={`${variantClass} ${animate ? 'slide-up' : ''} ${staggerClass} ${className}`}
            style={{ opacity: animate ? 0 : 1, padding: '24px', ...style }}
        >
            {children}
        </div>
    );
}
