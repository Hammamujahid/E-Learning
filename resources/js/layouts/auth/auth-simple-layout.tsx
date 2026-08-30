import AppLogo from '@/components/app-logo';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
            {/* Ambient background: faint grid with a soft accent glow. */}
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden="true" />
            <div
                className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
                aria-hidden="true"
            />

            <div className="animate-rise relative w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-6">
                        <Link href={route('home')} className="flex items-center gap-2.5" aria-label="E-Learning">
                            <AppLogo />
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">{children}</div>
                </div>
            </div>
        </div>
    );
}
