import { Field, controlClass } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { useRef } from 'react';

interface CreateMaterialProps {
    /** Provided by the parent page's props; no extra request needed. */
    subjects: Array<{ id: number; name: string }>;
    onSuccess?: () => void;
}

export default function CreateMaterial({ subjects, onSuccess }: CreateMaterialProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        description: string;
        subject_id: string;
        file: File | null;
    }>({
        name: '',
        description: '',
        subject_id: '',
        file: null,
    });

    const handleRemoveFile = () => {
        setData('file', null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // useForm switches to multipart automatically once a File is present.
        post(route('learning-material.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                handleRemoveFile();
                onSuccess?.();
            },
        });
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <Field label="Judul Materi" htmlFor="material-name" error={errors.name} required>
                <input
                    id="material-name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Contoh: Pengenalan Aljabar"
                    className={controlClass(errors.name)}
                    autoFocus
                />
            </Field>

            <Field label="Mata Pelajaran" htmlFor="material-subject" error={errors.subject_id} required>
                <select
                    id="material-subject"
                    value={data.subject_id}
                    onChange={(e) => setData('subject_id', e.target.value)}
                    className={controlClass(errors.subject_id)}
                >
                    <option value="">Pilih mata pelajaran</option>
                    {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </Field>

            <Field label="Deskripsi" htmlFor="material-description" error={errors.description} hint="Opsional.">
                <textarea
                    id="material-description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Ringkasan isi materi"
                    rows={3}
                    className={controlClass(errors.description, 'resize-y')}
                />
            </Field>

            <Field label="File Materi" error={errors.file}>
                <div className="space-y-2">
                    {data.file && (
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-foreground">{data.file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(data.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive-soft hover:text-destructive"
                                title="Hapus pilihan"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex w-full cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-dashed px-4 py-6 text-center transition-colors hover:bg-muted/40 ${
                            errors.file ? 'border-destructive' : 'border-border'
                        }`}
                    >
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{data.file ? 'Ganti file' : 'Pilih file materi'}</span>
                        <span className="text-xs text-muted-foreground">PDF, DOCX, PPTX, XLSX &middot; maks. 20 MB</span>
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                    />
                </div>
            </Field>

            <Button type="submit" disabled={processing} className="w-full">
                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan Materi
            </Button>
        </form>
    );
}
