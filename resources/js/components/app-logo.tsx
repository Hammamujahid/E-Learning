import { GraduationCap } from 'lucide-react';

/**
 * Wordmark used in the sidebar, header and auth screens.
 * `compact` renders the mark alone, for collapsed sidebars.
 */
export default function AppLogo({ compact = false }: { compact?: boolean }) {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <GraduationCap className="size-5" />
            </div>

            {!compact && (
                <div className="ml-1 grid flex-1 text-left">
                    <span className="truncate text-sm leading-tight font-semibold text-foreground">E-Learning</span>
                    <span className="truncate text-xs leading-tight text-muted-foreground">Belajar terarah</span>
                </div>
            )}
        </>
    );
}
