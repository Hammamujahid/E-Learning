import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Standard page heading: title, optional description, optional right-aligned
 * actions. Used at the top of every authenticated screen so spacing and
 * typography stay identical across the app.
 */
export function PageHeader({
    title,
    description,
    actions,
    className,
}: {
    title: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex flex-wrap items-start justify-between gap-4', className)}>
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>

            {actions && <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}

/**
 * Consistent placeholder for "no data yet" and "nothing matched" states.
 */
export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center',
                className,
            )}
        >
            <div className="rounded-full bg-background p-3 shadow-card">
                <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{title}</p>
                {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
            </div>
            {action}
        </div>
    );
}

/**
 * Card shell with the shared border, surface and shadow treatment.
 */
export function SurfaceCard({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('rounded-xl border border-border bg-card p-5 shadow-card', className)}>{children}</div>;
}

/**
 * Small uppercase label that introduces a block inside a card.
 */
export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
    return <p className={cn('text-xs font-semibold tracking-widest text-muted-foreground uppercase', className)}>{children}</p>;
}
