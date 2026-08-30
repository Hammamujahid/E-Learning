import { DocumentViewer, FileTypeBadge, MetaBadge, NoFilePlaceholder } from '@/components/document-viewer';
import { PageHeader, SectionLabel, SurfaceCard } from '@/components/page-header';
import { ScoreBadge } from '@/components/table-cells';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, CalendarDays, ExternalLink, FileText, HelpCircle, Loader2, PlayCircle, User as UserIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Materi', href: '/user/learning-material' },
    { title: 'Detail', href: '' },
];

interface MaterialProp {
    id: number;
    name: string;
    description: string | null;
    file_path: string | null;
    created_at: string | null;
    subject: { id: number; name: string } | null;
    creator_name: string | null;
    question_count: number;
}

interface ShowProps {
    material: MaterialProp;
    inProgressAttemptId: number | null;
    lastResult: { id: number; score: number } | null;
}

export default function Show({ material, inProgressAttemptId, lastResult }: ShowProps) {
    const { post, processing } = useForm({});

    const startQuiz = () => post(route('user.quiz.start', material.id));

    const fileName = material.file_path?.split('/').pop() ?? null;

    const createdDate = material.created_at
        ? new Date(material.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—';

    const hasQuestions = material.question_count > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={material.name} />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <PageHeader
                    title={material.name}
                    description={material.subject?.name ? `Mata pelajaran: ${material.subject.name}` : 'Tanpa mata pelajaran'}
                />

                {/* Panggilan aksi quiz */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
                    <div className="flex items-start gap-3.5">
                        <div className="rounded-lg bg-primary-soft p-2.5 text-primary">
                            <HelpCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">
                                {hasQuestions ? `Quiz tersedia · ${material.question_count} soal` : 'Quiz belum tersedia'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {inProgressAttemptId
                                    ? 'Kamu punya pengerjaan yang belum dikirim.'
                                    : hasQuestions
                                      ? 'Uji pemahamanmu setelah membaca materi.'
                                      : 'Guru belum menambahkan soal untuk materi ini.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {lastResult && (
                            <Link
                                href={route('user.quiz.result', lastResult.id)}
                                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                            >
                                Hasil terakhir
                                <ScoreBadge score={lastResult.score} />
                            </Link>
                        )}

                        {hasQuestions && (
                            <Button onClick={startQuiz} disabled={processing}>
                                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
                                {inProgressAttemptId ? 'Lanjutkan Quiz' : 'Mulai Quiz'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Deskripsi & meta */}
                <SurfaceCard className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                            <FileText className="h-5 w-5" />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-3">
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {material.description || <span className="italic">Materi ini belum memiliki deskripsi.</span>}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {material.subject?.name && <MetaBadge icon={<BookOpen className="h-3.5 w-3.5" />} label={material.subject.name} />}
                                {material.creator_name && <MetaBadge icon={<UserIcon className="h-3.5 w-3.5" />} label={material.creator_name} />}
                                <MetaBadge icon={<CalendarDays className="h-3.5 w-3.5" />} label={createdDate} />
                            </div>
                        </div>
                    </div>
                </SurfaceCard>

                {/* File materi */}
                <SurfaceCard>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <SectionLabel>Bahan Bacaan</SectionLabel>

                        {material.file_path && (
                            <div className="flex items-center gap-2">
                                <FileTypeBadge filePath={material.file_path} />
                                <span className="max-w-[220px] truncate text-xs text-muted-foreground">{fileName}</span>
                                <a
                                    href={material.file_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    Buka
                                </a>
                            </div>
                        )}
                    </div>

                    {material.file_path ? <DocumentViewer filePath={material.file_path} /> : <NoFilePlaceholder />}
                </SurfaceCard>
            </div>
        </AppLayout>
    );
}
