import { EmptyState, SectionLabel, SurfaceCard } from '@/components/page-header';
import { ScoreBadge } from '@/components/table-cells';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpen, ClipboardList, HelpCircle, Trophy, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dasbor', href: '/teacher/overview' }];

interface TeacherOverviewProps {
    stats: {
        material_count: number;
        question_count: number;
        attempt_count: number;
        average_score: number | null;
    };
    recentAttempts: Array<{
        id: number;
        score: number;
        submitted_at: string | null;
        student_name: string;
        material_name: string;
    }>;
    materials: Array<{
        id: number;
        name: string;
        questions_count: number;
    }>;
}

function formatDate(value: string | null): string {
    if (!value) return '—';

    return new Date(value).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function StatCard({
    icon: Icon,
    tone,
    value,
    label,
}: {
    icon: typeof BookOpen;
    tone: 'primary' | 'info' | 'success' | 'warning';
    value: string | number;
    label: string;
}) {
    const surface = {
        primary: 'bg-primary-soft text-primary',
        info: 'bg-info-soft text-info',
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

export default function TeacherOverview({ stats, recentAttempts, materials }: TeacherOverviewProps) {
    const { auth } = usePage<SharedData>().props;
    const firstName = auth.user?.name.split(' ')[0] ?? '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dasbor Guru" />

            <div className="flex flex-col gap-6">
                {/* Sambutan */}
                <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card">
                    <div
                        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
                        aria-hidden="true"
                    />

                    <div className="relative flex flex-wrap items-end justify-between gap-4">
                        <div className="space-y-1.5">
                            <p className="text-sm text-muted-foreground">Selamat datang,</p>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{firstName}</h1>
                            <p className="max-w-md text-sm text-muted-foreground">Kelola materi dan pantau perkembangan siswa dari satu tempat.</p>
                        </div>

                        <Button asChild>
                            <Link href={route('teacher.learning-material')}>
                                Kelola Materi
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Statistik */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={BookOpen} tone="primary" value={stats.material_count} label="Materi saya" />
                    <StatCard icon={HelpCircle} tone="info" value={stats.question_count} label="Soal saya" />
                    <StatCard icon={ClipboardList} tone="success" value={stats.attempt_count} label="Quiz dikerjakan" />
                    <StatCard
                        icon={Trophy}
                        tone="warning"
                        value={stats.average_score !== null ? Math.round(stats.average_score) : '—'}
                        label="Rata-rata skor"
                    />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Materi terbaru */}
                    <SurfaceCard>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <SectionLabel>Materi Terbaru</SectionLabel>
                            <Link href={route('teacher.learning-material')} className="text-xs font-medium text-primary hover:underline">
                                Kelola semua
                            </Link>
                        </div>

                        {materials.length === 0 ? (
                            <EmptyState
                                icon={BookOpen}
                                title="Belum ada materi"
                                description="Buat materi pertamamu untuk mulai mengajar."
                                className="border-0 bg-transparent py-8"
                            />
                        ) : (
                            <div className="flex flex-col divide-y divide-border">
                                {materials.map((material) => (
                                    <Link
                                        key={material.id}
                                        href={route('learning-material.show', material.id)}
                                        className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
                                    >
                                        <span className="truncate text-sm font-medium text-foreground">{material.name}</span>
                                        <span className="flex-shrink-0 text-xs text-muted-foreground">
                                            {material.questions_count > 0 ? `${material.questions_count} soal` : 'Belum ada soal'}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </SurfaceCard>

                    {/* Pengerjaan terbaru */}
                    <SurfaceCard>
                        <SectionLabel className="mb-4">Pengerjaan Siswa</SectionLabel>

                        {recentAttempts.length === 0 ? (
                            <EmptyState
                                icon={Users}
                                title="Belum ada pengerjaan"
                                description="Hasil quiz siswa akan tampil di sini."
                                className="border-0 bg-transparent py-8"
                            />
                        ) : (
                            <div className="flex flex-col divide-y divide-border">
                                {recentAttempts.map((attempt) => (
                                    <div key={attempt.id} className="flex items-center justify-between gap-3 py-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-foreground">{attempt.student_name}</p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {attempt.material_name} · {formatDate(attempt.submitted_at)}
                                            </p>
                                        </div>
                                        <ScoreBadge score={attempt.score} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </SurfaceCard>
                </div>
            </div>
        </AppLayout>
    );
}
