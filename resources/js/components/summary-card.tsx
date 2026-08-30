import { Link } from '@inertiajs/react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { ReactNode } from 'react';

type SummaryCardProps = {
    title: string;
    icon: ReactNode;
    /** Themed accent token: 'primary' | 'success' | 'warning' | 'info'. */
    tone?: 'primary' | 'success' | 'warning' | 'info';
    value: number;
    growth: number;
    description: string;
    buttonText: string;
    route: string;
};

const TONE_SURFACE: Record<string, string> = {
    primary: 'bg-primary-soft text-primary',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
    info: 'bg-info-soft text-info',
};

const TONE_GLOW: Record<string, string> = {
    primary: 'bg-primary/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    info: 'bg-info/10',
};

export default function SummaryCard({ title, icon, tone = 'primary', value, growth, description, buttonText, route }: SummaryCardProps) {
    return (
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
            <div className="flex flex-col gap-3">
                <div className="flex w-full items-start justify-between gap-3">
                    <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{title}</h2>

                    <div className={`rounded-lg p-2 transition-transform group-hover:scale-105 ${TONE_SURFACE[tone]}`}>{icon}</div>
                </div>

                <p className="text-3xl font-semibold tracking-tight text-foreground">{value.toLocaleString('id-ID')}</p>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    {growth > 0 ? (
                        <>
                            <span className="flex items-center gap-0.5 font-medium text-success">
                                <TrendingUp className="h-3.5 w-3.5" />+{growth}
                            </span>
                            <span>{description}</span>
                        </>
                    ) : (
                        <span>Belum ada penambahan minggu ini</span>
                    )}
                </div>
            </div>

            <Link
                href={route}
                className="mt-5 flex items-center justify-between rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
                <span>{buttonText}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <div
                className={`pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full blur-2xl ${TONE_GLOW[tone]}`}
                aria-hidden="true"
            />
        </div>
    );
}
