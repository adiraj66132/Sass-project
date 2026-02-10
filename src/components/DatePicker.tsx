interface DatePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    min?: string;
}

export function DatePicker({ label, value, onChange, min }: DatePickerProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {label}
            </label>
            <input
                type="date"
                value={value}
                min={min}
                onChange={(e) => onChange(e.target.value)}
                className="glass-input"
                style={{ colorScheme: 'dark' }}
            />
        </div>
    );
}
