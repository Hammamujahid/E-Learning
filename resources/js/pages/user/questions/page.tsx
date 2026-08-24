import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { BreadcrumbItem } from '@/types';
import { LearningMaterial, Question } from '@/types/interfaces';
import { Head, router, usePage } from '@inertiajs/react';
import { AxiosError } from 'axios';
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Flag, Loader2, XCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Daftar Materi', href: '/user/learning-material' },
    { title: 'Jawab Soal', href: '' },
];

interface QuestionResult {
    question_id: number;
    is_correct: boolean;
    correct_answer_id: number | null;
}

interface QuizAttemptResponse {
    quiz_attempt_id: number;
    score: number;
    correct_count: number;
    total: number;
    results: QuestionResult[];
}

export default function QuestionsPage() {
    const { id } = usePage<{ id: number }>().props;

    const [material, setMaterial] = useState<LearningMaterial | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

    const [submitting, setSubmitting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [result, setResult] = useState<QuizAttemptResponse | null>(null);

    const fetchQuizAttempt = useCallback(async(id: number)=> {
        const response = await api.get(`/api/quiz-attempt/${id}`);
        return response.data.data;
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const quizAttempt = await fetchQuizAttempt(id);
            const learningMaterialId = quizAttempt.learning_material_id;

            const [materialRes, questionsRes] = await Promise.all([
                api.get(`/api/learning-materials/${learningMaterialId}`, { params: { subject: true } }),
                api.get('/api/questions', { params: { learning_material_id: learningMaterialId } }),
            ]);
            setMaterial(materialRes.data.data);
            setQuestions(questionsRes.data.data);
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message ?? 'Gagal memuat soal');
        } finally {
            setLoading(false);
        }
    }, [id, fetchQuizAttempt]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalQuestions = questions.length;
    const answeredCount = Object.keys(selectedAnswers).length;
    const activeQuestion = questions[activeIndex] as Question | undefined;

    const isLastQuestion = activeIndex === totalQuestions - 1;
    const isFirstQuestion = activeIndex === 0;

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

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                learning_material_id: id,
                answers: Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
                    question_id: Number(questionId),
                    answer_id: answerId,
                })),
            };

            const response = await api.post('/api/quiz-attempts', payload);
            const data: QuizAttemptResponse = response.data.data ?? response.data;

            setResult(data);
            setConfirmOpen(false);
            toast.success('Jawaban berhasil dikirim');
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message ?? 'Gagal mengirim jawaban');
        } finally {
            setSubmitting(false);
        }
    };

    const resultMap = useMemo(() => {
        const map: Record<number, QuestionResult> = {};
        result?.results?.forEach((r) => {
            map[r.question_id] = r;
        });
        return map;
    }, [result]);

    if (loading || !material) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (totalQuestions === 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Jawab Soal" />
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-2 p-4 py-24 text-muted-foreground">
                    <Flag className="h-10 w-10 opacity-30" />
                    <p className="text-sm">Belum ada soal untuk materi ini.</p>
                </div>
            </AppLayout>
        );
    }

    // Hasil setelah submit
    if (result) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Hasil Jawaban" />
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
                    <div className="rounded-xl border border-muted-foreground/20 bg-background p-6 text-center shadow-sm">
                        <p className="text-xs font-medium tracking-widest text-muted-foreground/60 uppercase">Skor Kamu</p>
                        <p className="mt-2 text-4xl font-semibold text-primary">{result.score}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {result.correct_count} dari {result.total} soal dijawab benar
                        </p>
                        <button
                            onClick={() => router.visit(`/learning-material/${id}`)}
                            className="mt-5 cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                            Kembali ke Materi
                        </button>
                    </div>

                    <div className="space-y-4">
                        {questions.map((question, qIndex) => {
                            const qResult = resultMap[question.id];
                            const chosenAnswerId = selectedAnswers[question.id];

                            return (
                                <div key={question.id} className="rounded-xl border border-muted-foreground/20 bg-background p-5 shadow-sm">
                                    <div className="mb-3 flex items-start gap-3">
                                        <span
                                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                                qResult?.is_correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {qIndex + 1}
                                        </span>
                                        <div className="flex w-full items-start justify-between gap-3">
                                            <p className="text-sm leading-relaxed font-medium text-primary">{question.question_text}</p>
                                            {qResult?.is_correct ? (
                                                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                                            ) : (
                                                <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 pl-10">
                                        {question.answers?.map((ans, aIndex) => {
                                            const isChosen = chosenAnswerId === ans.id;
                                            const isCorrectAnswer = qResult?.correct_answer_id === ans.id;

                                            return (
                                                <div
                                                    key={ans.id}
                                                    className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
                                                        isCorrectAnswer
                                                            ? 'border-green-300 bg-green-50 text-green-800'
                                                            : isChosen
                                                              ? 'border-red-300 bg-red-50 text-red-800'
                                                              : 'border-border/30 text-primary/80'
                                                    }`}
                                                >
                                                    <span
                                                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                                            isCorrectAnswer
                                                                ? 'bg-green-500 text-white'
                                                                : isChosen
                                                                  ? 'bg-red-500 text-white'
                                                                  : 'bg-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        {String.fromCharCode(65 + aIndex)}
                                                    </span>
                                                    <span>{ans.answer_text}</span>
                                                    {isCorrectAnswer && <span className="ml-auto text-xs font-medium text-green-600">Kunci Jawaban</span>}
                                                    {isChosen && !isCorrectAnswer && <span className="ml-auto text-xs font-medium text-red-600">Jawabanmu</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Halaman mengerjakan soal
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jawab Soal" />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
                {/* Header + progres */}
                <div className="rounded-xl border border-muted-foreground/20 bg-background p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-medium text-primary">{material.name}</h1>
                            <p className="text-sm text-muted-foreground">
                                Soal {activeIndex + 1} dari {totalQuestions} &middot; {answeredCount} terjawab
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-indigo-600 transition-all"
                            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                        />
                    </div>

                    {/* Navigasi nomor soal */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {questions.map((q, i) => {
                            const isAnswered = selectedAnswers[q.id] !== undefined;
                            const isActive = i === activeIndex;
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => goTo(i)}
                                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-semibold transition ${
                                        isActive
                                            ? 'bg-indigo-600 text-white'
                                            : isAnswered
                                              ? 'bg-indigo-100 text-indigo-700'
                                              : 'bg-muted text-muted-foreground hover:bg-muted/70'
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
                    <div className="rounded-xl border border-muted-foreground/20 bg-background p-5 shadow-sm">
                        <p className="text-sm leading-relaxed font-medium text-primary">{activeQuestion.question_text}</p>

                        {activeQuestion.media_path && (
                            <img
                                src={activeQuestion.media_path}
                                alt="Gambar soal"
                                className="mt-4 h-48 w-auto rounded-lg border border-border/20 object-cover"
                            />
                        )}

                        <div className="mt-4 space-y-2">
                            {activeQuestion.answers?.map((ans, aIndex) => {
                                const isSelected = selectedAnswers[activeQuestion.id] === ans.id;
                                return (
                                    <button
                                        key={ans.id}
                                        onClick={() => handleSelectAnswer(activeQuestion.id, ans.id)}
                                        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                                            isSelected
                                                ? 'border-indigo-400 bg-indigo-50 text-indigo-800'
                                                : 'border-border/30 text-primary/80 hover:bg-muted/50'
                                        }`}
                                    >
                                        <span
                                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                                isSelected ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {String.fromCharCode(65 + aIndex)}
                                        </span>

                                        <div className="flex flex-col gap-1">
                                            {ans.media_path && (
                                                <img src={ans.media_path} alt="Gambar jawaban" className="h-16 w-auto rounded object-cover" />
                                            )}
                                            <span>{ans.answer_text}</span>
                                        </div>

                                        {isSelected ? (
                                            <CheckCircle2 className="ml-auto h-4 w-4 flex-shrink-0 text-indigo-600" />
                                        ) : (
                                            <Circle className="ml-auto h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Navigasi bawah */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => goTo(activeIndex - 1)}
                        disabled={isFirstQuestion}
                        className="flex cursor-pointer items-center gap-1 rounded-lg border border-border/30 px-4 py-2 text-sm text-primary/80 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Sebelumnya
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={() => setConfirmOpen(true)}
                            className="cursor-pointer rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white shadow-md transition hover:bg-green-700"
                        >
                            Selesai &amp; Kirim Jawaban
                        </button>
                    ) : (
                        <button
                            onClick={() => goTo(activeIndex + 1)}
                            className="flex cursor-pointer items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                            Selanjutnya
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Dialog konfirmasi submit */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kirim Jawaban?</DialogTitle>
                    </DialogHeader>

                    <div className="text-sm text-muted-foreground">
                        {unansweredIndexes.length > 0 ? (
                            <p>
                                Kamu masih punya <span className="font-medium text-primary">{unansweredIndexes.length} soal</span> yang belum
                                dijawab (nomor {unansweredIndexes.map(({ i }) => i + 1).join(', ')}). Jawaban yang kosong akan dianggap salah.
                            </p>
                        ) : (
                            <p>Semua soal sudah dijawab. Yakin ingin mengirim jawaban sekarang?</p>
                        )}
                    </div>

                    <DialogFooter>
                        <button
                            onClick={() => setConfirmOpen(false)}
                            className="cursor-pointer rounded-lg border border-border/30 px-4 py-2 text-sm text-primary/80 transition hover:bg-muted"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex cursor-pointer items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
                        >
                            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            Ya, Kirim
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
