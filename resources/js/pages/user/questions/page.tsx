import { EmptyState } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Check, ChevronLeft, ChevronRight, HelpCircle, Loader2, Send } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Materi', href: '/user/learning-material' },
    { title: 'Kerjakan Quiz', href: '' },
];

interface AnswerOption {
    id: number;
    answer_text: string;
    media_path: string | null;
}

/** Note: no `is_correct` — the answer key never reaches the student. */
interface QuizQuestion {
    id: number;
    question_text: string;
    media_path: string | null;
    answers: AnswerOption[];
}

interface QuestionsPageProps {
    attempt: { id: number; learning_material_id: number };
    material: { id: number; name: string; subject: { id: number; name: string } | null };
    questions: QuizQuestion[];
}

export default function QuestionsPage({ attempt, material, questions }: QuestionsPageProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { post, processing, transform } = useForm({});

    const totalQuestions = questions.length;
    const answeredCount = Object.keys(selectedAnswers).length;
    const activeQuestion = questions[activeIndex];

    const isLastQuestion = activeIndex === totalQuestions - 1;
    const isFirstQuestion = activeIndex === 0;
    const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    const unansweredIndexes = useMemo(
        () => questions.map((q, i) => ({ q, i })).filter(({ q }) => selectedAnswers[q.id] === undefined),
        [questions, selectedAnswers],
    );

    const handleSelectAnswer = (questionId: number, answerId: number) => {
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    };

    const goTo = (index: number) => {
        if (index < 0 || index >= totalQuestions) return;
        setActiveIndex(index);
    };

    const handleSubmit = () => {
        // Every question is sent, unanswered ones with a null answer, so the
        // server grades the full set rather than only what was touched.
        transform(() => ({
            answers: questions.map((question) => ({
                question_id: question.id,
                answer_id: selectedAnswers[question.id] ?? null,
            })),
        }));

        post(route('user.quiz.submit', attempt.id), {
            onFinish: () => setConfirmOpen(false),
        });
    };

    if (totalQuestions === 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Kerjakan Quiz" />
                <EmptyState icon={HelpCircle} title="Belum ada soal" description="Materi ini belum memiliki soal untuk dikerjakan." />
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Quiz — ${material.name}`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
                {/* Progres & navigasi nomor */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                    <div className="flex flex-wrap items-end justify-between gap-2">
                        <div>
                            <h1 className="font-semibold text-foreground">{material.name}</h1>
                            <p className="text-sm text-muted-foreground">
                                Soal {activeIndex + 1} dari {totalQuestions}
                            </p>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground tabular-nums">{answeredCount}</span>/{totalQuestions} terjawab
                        </p>
                    </div>

                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {questions.map((q, i) => {
                            const isAnswered = selectedAnswers[q.id] !== undefined;
                            const isActive = i === activeIndex;

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => goTo(i)}
                                    aria-label={`Soal ${i + 1}`}
                                    aria-current={isActive}
                                    className={`h-8 w-8 cursor-pointer rounded-lg border text-xs font-semibold tabular-nums transition-colors ${
                                        isActive
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : isAnswered
                                              ? 'border-primary/25 bg-primary-soft text-primary'
                                              : 'border-border bg-background text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Soal aktif */}
                {activeQuestion && (
                    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                        <div className="flex items-start gap-3">
                            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary-soft text-xs font-semibold text-primary">
                                {activeIndex + 1}
                            </span>
                            <p className="flex-1 text-base leading-relaxed font-medium text-foreground">{activeQuestion.question_text}</p>
                        </div>

                        {activeQuestion.media_path && (
                            <img
                                src={activeQuestion.media_path}
                                alt="Gambar soal"
                                className="mt-4 ml-10 max-h-64 w-auto rounded-lg border border-border object-contain"
                            />
                        )}

                        <div className="mt-5 space-y-2">
                            {activeQuestion.answers.map((ans, aIndex) => {
                                const isSelected = selectedAnswers[activeQuestion.id] === ans.id;

                                return (
                                    <button
                                        key={ans.id}
                                        onClick={() => handleSelectAnswer(activeQuestion.id, ans.id)}
                                        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm transition-colors ${
                                            isSelected
                                                ? 'border-primary bg-primary-soft text-foreground'
                                                : 'border-border bg-background text-muted-foreground hover:border-primary/25 hover:bg-muted/50'
                                        }`}
                                    >
                                        <span
                                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                                                isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {isSelected ? <Check className="h-3.5 w-3.5" /> : String.fromCharCode(65 + aIndex)}
                                        </span>

                                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                            {ans.media_path && (
                                                <img
                                                    src={ans.media_path}
                                                    alt="Gambar jawaban"
                                                    className="h-16 w-auto rounded border border-border object-cover"
                                                />
                                            )}
                                            <span className="break-words">{ans.answer_text}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Navigasi bawah */}
                <div className="flex items-center justify-between gap-3">
                    <Button variant="outline" onClick={() => goTo(activeIndex - 1)} disabled={isFirstQuestion}>
                        <ChevronLeft className="h-4 w-4" />
                        Sebelumnya
                    </Button>

                    {isLastQuestion ? (
                        <Button onClick={() => setConfirmOpen(true)}>
                            <Send className="h-4 w-4" />
                            Kirim Jawaban
                        </Button>
                    ) : (
                        <Button onClick={() => goTo(activeIndex + 1)}>
                            Selanjutnya
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Dialog konfirmasi submit */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kirim jawaban sekarang?</DialogTitle>
                    </DialogHeader>

                    <div className="text-sm text-muted-foreground">
                        {unansweredIndexes.length > 0 ? (
                            <p>
                                Masih ada <span className="font-semibold text-destructive">{unansweredIndexes.length} soal</span> yang belum dijawab
                                (nomor {unansweredIndexes.map(({ i }) => i + 1).join(', ')}). Soal kosong akan dihitung salah.
                            </p>
                        ) : (
                            <p>Semua soal sudah terjawab. Jawaban tidak bisa diubah setelah dikirim.</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                            Periksa Lagi
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing}>
                            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                            Ya, Kirim
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
