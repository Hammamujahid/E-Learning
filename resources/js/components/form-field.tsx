import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * Label + control + error, with consistent spacing. Every form in the app
 * uses this so field rhythm and error styling stay identical.
 */
export function Field({
    label,
    htmlFor,
    error,
    hint,
    required,
    children,
    className,
}: {
    label: string;
    htmlFor?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
            </Label>

            {children}

            {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>
    );
}

const BASE_CONTROL =
    'w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60';

/** Shared class for native inputs, selects and textareas inside a Field. */
export function controlClass(error?: string, extra?: string): string {
    return cn(BASE_CONTROL, error ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25' : 'border-input', extra);
}

/**
 * Sticky footer for full-page edit forms: cancel plus a primary submit.
 */
export function FormActions({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('flex flex-wrap items-center justify-end gap-2', className)}>{children}</div>;
}
