import { SectionLabel, SurfaceCard } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Check, History, MinusCircle, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Materi', href: '/user/learning-material' },
    { title: 'Hasil Quiz', href: '' },
];

interface ResultAnswer {
    id: number;
    answer_text: string;
    media_path: string | null;
}

interface QuestionResult {
    question_id: number;
    question_text: string;
    media_path: string | null;
    is_correct: boolean;
    chosen_answer_id: number | null;
    correct_answer_id: number | null;
    answers: ResultAnswer[];
}

interface ResultProps {
    material: { id: number; name: string; subject: { id: number; name: string } | null };
    result: {
        quiz_attempt_id: number;
        learning_material_id: number;
        score: number;
        correct_count: number;
        total: number;
        submitted_at: string | null;
        results: QuestionResult[];
    };
}

function scoreTone(score: number) {
    if (score >= 80) return { text: 'text-success', ring: 'text-success', label: 'Bagus sekali' };
    if (score >= 60) return { text: 'text-warning', ring: 'text-warning', label: 'Cukup baik' };
    return { text: 'text-destructive', ring: 'text-destructive', label: 'Perlu belajar lagi' };
}

/** Circular score gauge drawn with an SVG stroke offset. */
function ScoreRing({ score, className }: { score: number; className: string }) {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative h-28 w-28 flex-shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="8" className="stroke-muted" />
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={`${className} transition-[stroke-dashoffset] duration-700`}
                    stroke="currentColor"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-semibold tabular-nums ${className}`}>{score}</span>
                <span className="text-xs text-muted-foreground">dari 100</span>
            </div>
        </div>
    );
}

export default function Result({ material, result }: ResultProps) {
    const tone = scoreTone(result.score);

    const submittedAt = result.submitted_at
        ? new Date(result.submitted_at).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Hasil Quiz — ${material.name}`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
                {/* Ringkasan skor */}
                <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card">
                    <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />

                    <div className="relative flex flex-wrap items-center gap-6">
                        <ScoreRing score={result.score} className={tone.ring} />

                        <div className="min-w-0 flex-1 space-y-1.5">
                            <p className={`text-sm font-medium ${tone.text}`}>{tone.label}</p>
                            <h1 className="text-xl font-semibold tracking-tight text-foreground">{material.name}</h1>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-success">{result.correct_count} benar</span>
                                {' · '}
                                <span className="font-medium text-destructive">{result.total - result.correct_count} salah</span>
                                {' dari '}
                                {result.total} soal
                            </p>
                            {submittedAt && <p className="text-xs text-muted-foreground">Dikirim {submittedAt}</p>}
                        </div>
                    </div>

                    <div className="relative mt-5 flex flex-wrap gap-2">
                        <Button asChild>
                            <Link href={route('user.learning-material.show', result.learning_material_id)}>
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Materi
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('user.history')}>
                                <History className="h-4 w-4" />
                                Riwayat Quiz
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Pembahasan */}
                <SectionLabel>Pembahasan</SectionLabel>

                <div className="flex flex-col gap-3">
                    {result.results.map((item, qIndex) => (
                        <SurfaceCard key={item.question_id}>
                            <div className="mb-4 flex items-start gap-3">
                                <span
                                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                                        item.is_correct ? 'bg-success-soft text-success' : 'bg-destructive-soft text-destructive'
                                    }`}
                                >
                                    {qIndex + 1}
                                </span>

                                <p className="flex-1 text-sm leading-relaxed font-medium text-foreground">{item.question_text}</p>

                                <span
                                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                                        item.is_correct ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                                    }`}
                                    title={item.is_correct ? 'Benar' : 'Salah'}
                                >
                                    {item.is_correct ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                </span>
                            </div>

                            {item.media_path && (
                                <img
                                    src={item.media_path}
                                    alt="Gambar soal"
                                    className="mb-4 ml-10 max-h-52 w-auto rounded-lg border border-border object-contain"
                                />
                            )}

                            <div className="space-y-2 pl-10">
                                {item.answers.map((ans, aIndex) => {
                                    const isChosen = item.chosen_answer_id === ans.id;
                                    const isKey = item.correct_answer_id === ans.id;

                                    const tone = isKey
                                        ? 'border-success/25 bg-success-soft text-success'
                                        : isChosen
                                          ? 'border-destructive/25 bg-destructive-soft text-destructive'
                                          : 'border-border text-muted-foreground';

                                    const marker = isKey
                                        ? 'bg-success text-success-foreground'
                                        : isChosen
                                          ? 'bg-destructive text-destructive-foreground'
                                          : 'bg-muted text-muted-foreground';

                                    return (
                                        <div key={ans.id} className={`flex items-start gap-2.5 rounded-lg border px-3 py-2 text-sm ${tone}`}>
                                            <span
                                                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-xs font-semibold ${marker}`}
                                            >
                                                {String.fromCharCode(65 + aIndex)}
                                            </span>

                                            <span className="min-w-0 flex-1 break-words">{ans.answer_text}</span>

                                            {isKey && <span className="flex-shrink-0 text-xs font-medium">Kunci</span>}
                                            {isChosen && !isKey && <span className="flex-shrink-0 text-xs font-medium">Jawabanmu</span>}
                                        </div>
                                    );
                                })}
                            </div>

                            {item.chosen_answer_id === null && (
                                <p className="mt-2.5 flex items-center gap-1.5 pl-10 text-xs text-muted-foreground">
                                    <MinusCircle className="h-3.5 w-3.5" />
                                    Soal ini tidak kamu jawab.
                                </p>
                            )}
                        </SurfaceCard>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
