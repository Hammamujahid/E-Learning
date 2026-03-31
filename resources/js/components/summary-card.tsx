import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

type SummaryCardProps = {
    title: string;
    icon: ReactNode;
    color: string;
    value: number;
    growth: number;
    description: string;
    buttonText: string;
    route: string;
};

export default function SummaryCard({ title, icon, color, value, growth, description, buttonText, route }: SummaryCardProps) {
    return (
        <div className="group relative flex aspect-video flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 bg-foreground p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-sidebar-border">
            <div className="flex flex-col gap-2">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-sm font-medium tracking-wide text-muted-foreground">{title}</h1>

                    <div
                        className={`rounded-lg border border-white/10 bg-${color}/20 p-2 shadow-sm backdrop-blur-lg transition group-hover:scale-110`}
                    >
                        {icon}
                    </div>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-secondary">{value.toLocaleString()}</h1>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span className="text-base font-semibold text-green-500">+{growth}</span>
                    <span>{description}</span>
                </div>
            </div>
            <Link
                href={route}
                className="mt-4 flex items-center justify-between rounded-md bg-secondary/90 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-secondary hover:shadow-md active:scale-95"
            >
                <span>{buttonText}</span>
                <span className="ml-2 transition group-hover:translate-x-1">→</span>
            </Link>
            <div className={`pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-${color}/20 blur-2xl`}></div>
        </div>
    );
}
