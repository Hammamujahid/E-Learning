import { SectionLabel, SurfaceCard } from '@/components/page-header';
import { ScoreBadge } from '@/components/table-cells';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpen, GraduationCap, History, Trophy } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dasbor', href: '/user/overview' }];

interface OverviewProps {
    stats: {
        subject_count: number;
        material_count: number;
        completed_quiz_count: number;
        average_score: number | null;
        best_score: number | null;
    };
    recentAttempts: Array<{
        id: number;
        score: number;
        submitted_at: string | null;
        material_name: string;
    }>;
}

function formatDate(value: string | null): string {
    if (!value) return '—';

    return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatCard({
    icon: Icon,
    tone,
    value,
    label,
}: {
    icon: typeof BookOpen;
    tone: 'primary' | 'success' | 'warning';
    value: string | number;
    label: string;
}) {
    const surface = {
        primary: 'bg-primary-soft text-primary',
        success: 'bg-success-soft text-success',
        warning: 'bg-warning-soft text-warning',
    }[tone];

    return (
        <SurfaceCard className="flex items-center gap-4">
            <div className={`rounded-lg p-2.5 ${surface}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </SurfaceCard>
    );
}

export default function Overview({ stats, recentAttempts }: OverviewProps) {
    const { auth } = usePage<SharedData>().props;
    const firstName = auth.user?.name.split(' ')[0] ?? '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dasbor" />

            <div className="flex flex-col gap-6">
                {/* Sambutan */}
                <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card">
                    <div
                        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
                        aria-hidden="true"
                    />

                    <div className="relative flex flex-wrap items-end justify-between gap-4">
                        <div className="space-y-1.5">
                            <p className="text-sm text-muted-foreground">Selamat datang kembali,</p>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{firstName} 👋</h1>
                            <p className="max-w-md text-sm text-muted-foreground">
                                Lanjutkan proses belajarmu hari ini dan uji pemahaman lewat quiz.
                            </p>
                        </div>

                        <Button asChild>
                            <Link href={route('user.learning-material')}>
                                Jelajahi Materi
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Statistik */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard icon={BookOpen} tone="primary" value={stats.material_count} label="Materi tersedia" />
                    <StatCard icon={GraduationCap} tone="success" value={stats.completed_quiz_count} label="Quiz selesai" />
                    <StatCard icon={Trophy} tone="warning" value={stats.average_score ?? '—'} label="Rata-rata skor" />
                </div>

                {/* Quiz terakhir */}
                <SurfaceCard>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <SectionLabel>Quiz Terakhir</SectionLabel>

                        {recentAttempts.length > 0 && (
                            <Link href={route('user.history')} className="text-xs font-medium text-primary hover:underline">
                                Lihat semua
                            </Link>
                        )}
                    </div>

                    {recentAttempts.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                            <History className="h-7 w-7 text-muted-foreground opacity-40" />
                            <p className="text-sm text-muted-foreground">Kamu belum mengerjakan quiz apa pun.</p>
                            <Link href={route('user.learning-material')} className="text-sm font-medium text-primary hover:underline">
                                Mulai dari materi pertama
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y divide-border">
                            {recentAttempts.map((attempt) => (
                                <Link
                                    key={attempt.id}
                                    href={route('user.quiz.result', attempt.id)}
                                    className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-foreground">{attempt.material_name}</p>
                                        <p className="text-xs text-muted-foreground">{formatDate(attempt.submitted_at)}</p>
                                    </div>
                                    <ScoreBadge score={attempt.score} />
                                </Link>
                            ))}
                        </div>
                    )}
                </SurfaceCard>
            </div>
        </AppLayout>
    );
}
