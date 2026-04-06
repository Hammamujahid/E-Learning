import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { BreadcrumbItem } from '@/types';
import { LearningMaterial, Subject } from '@/types/interfaces';
import { Head, Link, usePage } from '@inertiajs/react';
import { AxiosError } from 'axios';
import { BookOpen, FileText, Loader2, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Daftar Materi', href: '/admin/learning-material' },
    { title: 'Edit Materi', href: '' },
];

function FieldRow({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-primary">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default function EditLearningMaterial() {
    const { id } = usePage<{ id: number }>().props;

    const [material, setMaterial] = useState<LearningMaterial | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [name, setName] = useState('');
    const [originalName, setOriginalName] = useState('');
    const [description, setDescription] = useState('');
    const [originalDescription, setOriginalDescription] = useState('');
    const [subjectId, setSubjectId] = useState<number | null>(null);
    const [originalSubjectId, setOriginalSubjectId] = useState<number | null>(null);
    const [newFile, setNewFile] = useState<File | null>(null);
    const [removeFile, setRemoveFile] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [materialRes, subjectsRes] = await Promise.all([
                api.get(`/api/learning-materials/${id}`, { params: { subject: true } }),
                api.get('/api/subjects'),
            ]);
            const data: LearningMaterial = materialRes.data.data;
            setMaterial(data);
            setName(data.name ?? '');
            setOriginalName(data.name ?? '');
            setDescription(data.description ?? '');
            setOriginalDescription(data.description ?? '');
            setSubjectId(data.subject?.id ?? null);
            setOriginalSubjectId(data.subject?.id ?? null);
            setSubjects(subjectsRes.data.data);
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message ?? 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const isDirty = useMemo(() => {
        return name !== originalName || description !== originalDescription || subjectId !== originalSubjectId || newFile !== null || removeFile;
    }, [name, originalName, description, originalDescription, subjectId, originalSubjectId, newFile, removeFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewFile(file);
            setRemoveFile(false);
            setErrors((prev) => ({ ...prev, file: '' }));
        }
    };

    const handleRemoveFile = () => {
        setNewFile(null);
        setRemoveFile(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSave = async () => {
        if (!isDirty) return;
        setSaving(true);
        setErrors({});

        try {
            const formData = new FormData();
            formData.append('_method', 'PATCH');
            formData.append('name', name);
            formData.append('description', description || '');
            if (subjectId) formData.append('subject_id', String(subjectId));
            if (newFile) formData.append('file', newFile);
            if (removeFile) formData.append('remove_file', '1');

            const response = await api.post(`/api/learning-materials/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const updated = response.data.data;
            setMaterial(updated);
            setOriginalName(name);
            setOriginalDescription(description);
            setOriginalSubjectId(subjectId);
            setNewFile(null);
            setRemoveFile(false);
            toast.success('Materi berhasil diperbarui');
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

    if (loading || !material) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const currentFileName = newFile ? newFile.name : removeFile ? null : (material.file_path?.split('/').pop() ?? null);

    const inputClass =
        'w-full rounded-md border border-border/30 bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-border/60';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Materi" />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4">
                {/* Page header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-medium text-primary">Edit Materi</h1>
                        <p className="text-sm text-muted-foreground">Perbarui informasi materi pembelajaran</p>
                    </div>
                    <Link href={`/learning-material/${id}`}>
                        <button className="flex items-center gap-1.5 bg-background px-3 py-1.5 text-sm text-primary hover:cursor-pointer hover:text-blue-600">
                            ← Kembali
                        </button>
                    </Link>
                </div>

                {/* Hero card */}
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-muted-foreground/20 bg-background p-5 shadow-sm">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                        <FileText className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-lg font-medium text-primary">{name || '—'}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>{subjects.find((s) => s.id === subjectId)?.name ?? '—'}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving || !isDirty}
                        className="rounded-lg border border-green-200 bg-green-50 px-4 py-1.5 text-sm text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {saving ? (
                            <span className="flex items-center gap-1.5">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Menyimpan...
                            </span>
                        ) : (
                            'Simpan'
                        )}
                    </button>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Informasi Materi */}
                    <div className="flex flex-col gap-4 rounded-xl border border-muted-foreground/20 bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium tracking-widest text-muted-foreground/60 uppercase">Informasi Materi</p>

                        <FieldRow label="Judul Materi" error={errors.name}>
                            <input
                                className={inputClass}
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrors((prev) => ({ ...prev, name: '' }));
                                }}
                                placeholder="Judul materi"
                            />
                        </FieldRow>

                        <FieldRow label="Mata Pelajaran" error={errors.subject_id}>
                            <select
                                className={inputClass}
                                value={subjectId ?? ''}
                                onChange={(e) => {
                                    setSubjectId(Number(e.target.value) || null);
                                    setErrors((prev) => ({ ...prev, subject_id: '' }));
                                }}
                            >
                                <option value="">— Pilih Mata Pelajaran —</option>
                                {subjects.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </FieldRow>

                        <FieldRow label="Deskripsi" error={errors.description}>
                            <textarea
                                className={`${inputClass} min-h-[120px] resize-y`}
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setErrors((prev) => ({ ...prev, description: '' }));
                                }}
                                placeholder="Deskripsi materi..."
                            />
                        </FieldRow>
                    </div>

                    {/* File Materi */}
                    <div className="flex flex-col gap-4 rounded-xl border border-muted-foreground/20 bg-background p-5 shadow-sm">
                        <p className="text-xs font-medium tracking-widest text-muted-foreground/60 uppercase">File Materi</p>

                        {/* Current / new file preview */}
                        {currentFileName ? (
                            <div className="flex items-center justify-between gap-3 rounded-lg border border-border/20 bg-muted/30 px-3 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                                        <FileText className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="max-w-[180px] truncate text-sm font-medium text-primary">{currentFileName}</p>
                                        <p className="text-xs text-muted-foreground">{newFile ? 'File baru' : 'File saat ini'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRemoveFile}
                                    className="rounded-md p-1 text-muted-foreground transition hover:bg-red-50 hover:text-red-500"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/40 px-3 py-4 text-sm text-muted-foreground">
                                <X className="h-4 w-4 text-red-400" />
                                <span className="italic">Tidak ada file</span>
                            </div>
                        )}

                        {/* Upload area */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border/30 px-4 py-6 text-center transition hover:border-border/60 hover:bg-muted/20"
                        >
                            <Upload className="h-7 w-7 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">{currentFileName ? 'Ganti file' : 'Upload file'}</p>
                            <p className="text-xs text-muted-foreground/50">PDF, DOCX, PPTX, XLSX (maks. 20MB)</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                                onChange={handleFileChange}
                            />
                        </div>

                        {errors.file && <p className="text-xs text-red-500">{errors.file}</p>}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
