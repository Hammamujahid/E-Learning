import { EmptyState, PageHeader, SurfaceCard } from '@/components/page-header';
import { ScoreBadge } from '@/components/table-cells';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, History, PlayCircle, Trophy } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Riwayat Quiz', href: '/user/history' }];

interface AttemptRow {
    id: number;
    score: number;
    status: 'in_progress' | 'submitted';
    submitted_at: string | null;
    created_at: string | null;
    material: { id: number | null; name: string; subject: string | null };
}

interface HistoryProps {
    attempts: AttemptRow[];
}

function formatDate(value: string | null): string {
    if (!value) return '—';

    return new Date(value).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function HistoryPage({ attempts }: HistoryProps) {
    const submitted = attempts.filter((a) => a.status === 'submitted');
    const averageScore = submitted.length > 0 ? Math.round(submitted.reduce((sum, a) => sum + a.score, 0) / submitted.length) : null;
    const bestScore = submitted.length > 0 ? Math.max(...submitted.map((a) => a.score)) : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Quiz" />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <PageHeader title="Riwayat Quiz" description="Semua quiz yang pernah kamu kerjakan." />

                {/* Ringkasan */}
                {submitted.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-3">
                        <SurfaceCard className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary-soft p-2.5 text-primary">
                                <History className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-foreground">{submitted.length}</p>
                                <p className="text-sm text-muted-foreground">Quiz selesai</p>
                            </div>
                        </SurfaceCard>

                        <SurfaceCard className="flex items-center gap-4">
                            <div className="rounded-lg bg-warning-soft p-2.5 text-warning">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-foreground">{averageScore}</p>
                                <p className="text-sm text-muted-foreground">Rata-rata skor</p>
                            </div>
                        </SurfaceCard>

                        <SurfaceCard className="flex items-center gap-4">
                            <div className="rounded-lg bg-success-soft p-2.5 text-success">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-foreground">{bestScore}</p>
                                <p className="text-sm text-muted-foreground">Skor tertinggi</p>
                            </div>
                        </SurfaceCard>
                    </div>
                )}

                {/* Daftar attempt */}
                {attempts.length === 0 ? (
                    <EmptyState
                        icon={BookOpen}
                        title="Belum ada quiz yang dikerjakan"
                        description="Pilih satu materi, baca isinya, lalu kerjakan quiznya untuk mengukur pemahamanmu."
                        action={
                            <Button asChild>
                                <Link href={route('user.learning-material')}>Mulai Belajar</Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="flex flex-col gap-3">
                        {attempts.map((attempt) => (
                            <SurfaceCard key={attempt.id} className="flex flex-wrap items-center justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-foreground">{attempt.material.name}</p>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        {attempt.material.subject && (
                                            <Badge variant="outline" className="border-border bg-muted text-muted-foreground">
                                                {attempt.material.subject}
                                            </Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                            {attempt.status === 'submitted'
                                                ? formatDate(attempt.submitted_at)
                                                : `Dimulai ${formatDate(attempt.created_at)}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-shrink-0 items-center gap-3">
                                    {attempt.status === 'submitted' ? (
                                        <>
                                            <ScoreBadge score={attempt.score} />
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('user.quiz.result', attempt.id)}>Lihat Hasil</Link>
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Badge variant="outline" className="border-warning/20 bg-warning-soft text-warning">
                                                Belum dikirim
                                            </Badge>
                                            <Button size="sm" asChild>
                                                <Link href={route('user.quiz.show', attempt.id)}>
                                                    <PlayCircle className="h-3.5 w-3.5" />
                                                    Lanjutkan
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </SurfaceCard>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
