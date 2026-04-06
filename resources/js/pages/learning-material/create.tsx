import { api } from '@/lib/api';
import { Subject } from '@/types/interfaces';
import { AxiosError } from 'axios';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function CreateMaterial({ onSuccess }: { onSuccess?: () => void }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchSubjects = useCallback(async () => {
        setLoadingSubjects(true);
        try {
            const response = await api.get('/api/subjects');
            setSubjects(response.data.data);
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message ?? 'Gagal memuat mata pelajaran');
        } finally {
            setLoadingSubjects(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setErrors((prev) => ({ ...prev, file: '' }));
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('subject_id', subjectId);
            if (file) formData.append('file', file);

            await api.post('/api/learning-material', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Materi berhasil ditambahkan');
            onSuccess?.();
        } catch (err) {
            const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
            const validationErrors = error.response?.data?.errors;
            if (error.response?.status === 422 && validationErrors) {
                const mapped: Record<string, string> = {};
                Object.entries(validationErrors).forEach(([k, v]) => (mapped[k] = v[0]));
                setErrors(mapped);
            } else {
                toast.error('Gagal menyimpan. Coba lagi nanti.');
            }
        } finally {
            setSaving(false);
        }
    };

    const inputClass = (field?: string) =>
        `w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-border/60 bg-background ${
            field && errors[field] ? 'border-red-400' : 'border-border/30'
        }`;

    return (
        <form className="space-y-4 text-primary" onSubmit={handleSubmit}>

            {/* Judul */}
            <div>
                <label className="mb-1 block text-sm font-medium">Judul Materi</label>
                <input
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="Judul materi"
                    className={inputClass('name')}
                />
                {errors.name && <p className="mt-0.5 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Mata Pelajaran */}
            <div>
                <label className="mb-1 block text-sm font-medium">Mata Pelajaran</label>
                <select
                    value={subjectId}
                    onChange={(e) => {
                        setSubjectId(e.target.value);
                        setErrors((prev) => ({ ...prev, subject_id: '' }));
                    }}
                    disabled={loadingSubjects}
                    className={inputClass('subject_id')}
                >
                    <option value="">
                        {loadingSubjects ? 'Memuat mata pelajaran...' : '— Pilih Mata Pelajaran —'}
                    </option>
                    {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
                {errors.subject_id && <p className="mt-0.5 text-xs text-red-500">{errors.subject_id}</p>}
            </div>

            {/* Deskripsi */}
            <div>
                <label className="mb-1 block text-sm font-medium">Deskripsi</label>
                <textarea
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        setErrors((prev) => ({ ...prev, description: '' }));
                    }}
                    placeholder="Deskripsi materi..."
                    rows={3}
                    className={`${inputClass('description')} resize-y`}
                />
                {errors.description && <p className="mt-0.5 text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* File */}
            <div>
                <label className="mb-1 block text-sm font-medium">File Materi</label>

                {file ? (
                    <div className="mb-2 flex items-center justify-between gap-3 rounded-lg border border-border/20 bg-muted/30 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                                <FileText className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className="max-w-[200px] truncate text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="rounded-md p-1 text-muted-foreground transition hover:bg-red-50 hover:text-red-500"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : null}

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-5 text-center transition hover:bg-muted/20 ${
                        errors.file ? 'border-red-400' : 'border-border/30 hover:border-border/60'
                    }`}
                >
                    <Upload className="h-6 w-6 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                        {file ? 'Ganti file' : 'Klik untuk upload file'}
                    </p>
                    <p className="text-xs text-muted-foreground/50">PDF, DOCX, PPTX, XLSX (maks. 20MB)</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        onChange={handleFileChange}
                    />
                </div>
                {errors.file && <p className="mt-0.5 text-xs text-red-500">{errors.file}</p>}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md bg-blue-500 py-2 text-sm text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {saving ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menyimpan...
                    </span>
                ) : (
                    'Simpan'
                )}
            </button>
        </form>
    );
}
