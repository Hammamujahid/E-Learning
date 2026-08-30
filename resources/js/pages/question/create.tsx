import { Field, controlClass } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { AlertCircle, Check, ImagePlus, Loader2, X } from 'lucide-react';
import { FormEventHandler } from 'react';

/**
 * The index signature is required by Inertia's useForm, which only accepts
 * nested values it knows how to serialise into FormData.
 */
interface AnswerDraft {
    [key: string]: string | File | boolean | null;
    text: string;
    image: File | null;
    is_correct: boolean;
}

interface CreateQuestionProps {
    learningMaterialId: number;
    onSuccess?: () => void;
}

const emptyAnswers = (): AnswerDraft[] => [
    { text: '', image: null, is_correct: false },
    { text: '', image: null, is_correct: false },
    { text: '', image: null, is_correct: false },
    { text: '', image: null, is_correct: false },
];

export default function CreateQuestion({ learningMaterialId, onSuccess }: CreateQuestionProps) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        learning_material_id: number;
        question_text: string;
        question_image: File | null;
        answers: AnswerDraft[];
    }>({
        learning_material_id: learningMaterialId,
        question_text: '',
        question_image: null,
        answers: emptyAnswers(),
    });

    const updateAnswer = <K extends keyof AnswerDraft>(index: number, field: K, value: AnswerDraft[K]) => {
        setData(
            'answers',
            data.answers.map((answer, i) => (i === index ? { ...answer, [field]: value } : answer)),
        );
    };

    /** Marking one answer correct clears the others: exactly one is allowed. */
    const markCorrect = (index: number) => {
        setData(
            'answers',
            data.answers.map((answer, i) => ({ ...answer, is_correct: i === index })),
        );
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('question.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setData('answers', emptyAnswers());
                onSuccess?.();
            },
        });
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <Field label="Teks Soal" htmlFor="question-text" error={errors.question_text} required>
                <textarea
                    id="question-text"
                    value={data.question_text}
                    onChange={(e) => setData('question_text', e.target.value)}
                    placeholder="Tulis pertanyaan di sini"
                    rows={3}
                    className={controlClass(errors.question_text, 'resize-y')}
                    autoFocus
                />
            </Field>

            <Field label="Gambar Soal" error={errors.question_image} hint="Opsional. PNG, JPG, atau WEBP maks. 2 MB.">
                <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted">
                        <ImagePlus className="h-4 w-4 text-muted-foreground" />
                        {data.question_image ? 'Ganti gambar' : 'Pilih gambar'}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setData('question_image', e.target.files?.[0] ?? null)}
                        />
                    </label>

                    {data.question_image && (
                        <div className="flex items-center gap-2">
                            <img
                                src={URL.createObjectURL(data.question_image)}
                                alt="Pratinjau"
                                className="h-14 w-14 rounded-lg border border-border object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setData('question_image', null)}
                                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive-soft hover:text-destructive"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </Field>

            {/* ── Pilihan jawaban ──────────────────────────────────── */}
            <div className="space-y-3 border-t border-border pt-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <p className="text-sm font-medium text-foreground">Pilihan Jawaban</p>
                        <p className="text-xs text-muted-foreground">Tandai tepat satu jawaban sebagai kunci.</p>
                    </div>
                </div>

                {errors.answers && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/25 bg-destructive-soft px-3 py-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {errors.answers}
                    </div>
                )}

                <div className="space-y-2.5">
                    {data.answers.map((ans, index) => {
                        const textError = errors[`answers.${index}.text` as keyof typeof errors];
                        const letter = String.fromCharCode(65 + index);

                        return (
                            <div
                                key={index}
                                className={`rounded-lg border p-3 transition-colors ${
                                    ans.is_correct ? 'border-success/30 bg-success-soft/50' : 'border-border bg-background'
                                }`}
                            >
                                <div className="flex items-start gap-2.5">
                                    {/* Kunci jawaban: satu pilihan saja */}
                                    <button
                                        type="button"
                                        onClick={() => markCorrect(index)}
                                        title="Tandai sebagai kunci jawaban"
                                        className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border text-xs font-semibold transition-colors ${
                                            ans.is_correct
                                                ? 'border-success bg-success text-success-foreground'
                                                : 'border-border bg-muted text-muted-foreground hover:border-success/40 hover:text-success'
                                        }`}
                                    >
                                        {ans.is_correct ? <Check className="h-3.5 w-3.5" /> : letter}
                                    </button>

                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                        <input
                                            type="text"
                                            value={ans.text}
                                            onChange={(e) => updateAnswer(index, 'text', e.target.value)}
                                            placeholder={`Jawaban ${letter}`}
                                            className={controlClass(textError, 'py-1.5')}
                                        />
                                        {textError && <p className="text-xs font-medium text-destructive">{textError}</p>}

                                        <div className="flex flex-wrap items-center gap-2">
                                            <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                                                <ImagePlus className="h-3.5 w-3.5" />
                                                {ans.image ? 'Ganti gambar' : 'Tambah gambar'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => updateAnswer(index, 'image', e.target.files?.[0] ?? null)}
                                                />
                                            </label>

                                            {ans.image && (
                                                <div className="flex items-center gap-1.5">
                                                    <img
                                                        src={URL.createObjectURL(ans.image)}
                                                        alt="Pratinjau"
                                                        className="h-10 w-10 rounded border border-border object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => updateAnswer(index, 'image', null)}
                                                        className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Button type="submit" disabled={processing} className="w-full">
                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan Soal
            </Button>
        </form>
    );
}
