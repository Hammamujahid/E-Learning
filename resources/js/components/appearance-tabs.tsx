import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

const TABS: { value: Appearance; icon: LucideIcon; label: string; hint: string }[] = [
    { value: 'light', icon: Sun, label: 'Terang', hint: 'Selalu tema terang' },
    { value: 'dark', icon: Moon, label: 'Gelap', hint: 'Selalu tema gelap' },
    { value: 'system', icon: Monitor, label: 'Sistem', hint: 'Ikuti perangkat' },
];

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <div className={cn('grid gap-3 sm:grid-cols-3', className)} {...props}>
            {TABS.map(({ value, icon: Icon, label, hint }) => {
                const isActive = appearance === value;

                return (
                    <button
                        key={value}
                        onClick={() => updateAppearance(value)}
                        aria-pressed={isActive}
                        className={cn(
                            'flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors',
                            isActive ? 'border-primary bg-primary-soft' : 'border-border bg-card hover:border-primary/25 hover:bg-muted/50',
                        )}
                    >
                        <span
                            className={cn(
                                'rounded-lg p-2 transition-colors',
                                isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                            )}
                        >
                            <Icon className="h-4 w-4" />
                        </span>

                        <span className="space-y-0.5">
                            <span className={cn('block text-sm font-medium', isActive ? 'text-primary' : 'text-foreground')}>{label}</span>
                            <span className="block text-xs text-muted-foreground">{hint}</span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
