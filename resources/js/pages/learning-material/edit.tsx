import { FileTypeBadge } from '@/components/document-viewer';
import { controlClass, Field, FormActions } from '@/components/form-field';
import { PageHeader, SectionLabel, SurfaceCard } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ExternalLink, FileText, Loader2, Upload, X } from 'lucide-react';
import { useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Materi', href: '/admin/learning-material' },
    { title: 'Edit', href: '' },
];

interface EditProps {
    material: {
        id: number;
        name: string;
        description: string | null;
        file_path: string | null;
        subject_id: number;
    };
    subjects: Array<{ id: number; name: string }>;
}

export default function EditLearningMaterial({ material, subjects }: EditProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, isDirty } = useForm<{
        name: string;
        description: string;
        subject_id: string;
        file: File | null;
        remove_file: boolean;
    }>({
        name: material.name,
        description: material.description ?? '',
        subject_id: String(material.subject_id),
        file: null,
        remove_file: false,
    });

    const currentFileName = material.file_path?.split('/').pop() ?? null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isDirty) return;

        post(route('learning-material.update', material.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${material.name}`} />

            <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <PageHeader
                    title="Edit Materi"
                    description="Perbarui informasi dan lampiran materi pembelajaran."
                    actions={
                        <FormActions>
                            <Button variant="outline" asChild>
                                <Link href={route('learning-material.show', material.id)}>Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing || !isDirty}>
                                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                Simpan Perubahan
                            </Button>
                        </FormActions>
                    }
                />

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Informasi materi */}
                    <SurfaceCard className="flex flex-col gap-4">
                        <SectionLabel>Informasi</SectionLabel>

                        <Field label="Judul Materi" htmlFor="name" error={errors.name} required>
                            <input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={controlClass(errors.name)}
                            />
                        </Field>

                        <Field label="Mata Pelajaran" htmlFor="subject_id" error={errors.subject_id} required>
                            <select
                                id="subject_id"
                                value={data.subject_id}
                                onChange={(e) => setData('subject_id', e.target.value)}
                                className={controlClass(errors.subject_id)}
                            >
                                <option value="">Pilih mata pelajaran</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Deskripsi" htmlFor="description" error={errors.description}>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={6}
                                className={controlClass(errors.description, 'resize-y')}
                            />
                        </Field>
                    </SurfaceCard>

                    {/* File */}
                    <SurfaceCard className="flex flex-col gap-4">
                        <SectionLabel>File Materi</SectionLabel>

                        {material.file_path && !data.remove_file && !data.file && (
                            <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-foreground">{currentFileName}</p>
                                        <FileTypeBadge filePath={material.file_path} />
                                    </div>
                                </div>

                                <div className="flex flex-shrink-0 items-center gap-1">
                                    <a
                                        href={material.file_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-xs font-medium transition-colors hover:bg-muted"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        Buka
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setData('remove_file', true)}
                                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive-soft hover:text-destructive"
                                        title="Hapus file"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {data.remove_file && !data.file && (
                            <div className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-destructive/40 bg-destructive-soft px-3 py-2.5 text-sm text-destructive">
                                <span>File akan dihapus saat disimpan.</span>
                                <button type="button" onClick={() => setData('remove_file', false)} className="text-xs font-medium underline">
                                    Batalkan
                                </button>
                            </div>
                        )}

                        {data.file && (
                            <div className="flex items-center justify-between gap-3 rounded-lg border border-success/25 bg-success-soft px-3 py-2.5">
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-foreground">{data.file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(data.file.size / 1024 / 1024).toFixed(2)} MB &middot; file baru
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('file', null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive-soft hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-dashed px-4 py-7 text-center transition-colors hover:bg-muted/40 ${
                                errors.file ? 'border-destructive' : 'border-border'
                            }`}
                        >
                            <Upload className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{material.file_path ? 'Ganti file' : 'Pilih file materi'}</span>
                            <span className="text-xs text-muted-foreground">PDF, DOCX, PPTX, XLSX &middot; maks. 20 MB</span>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                            onChange={(e) => {
                                setData('file', e.target.files?.[0] ?? null);
                                setData('remove_file', false);
                            }}
                        />

                        {errors.file && <p className="text-xs font-medium text-destructive">{errors.file}</p>}
                    </SurfaceCard>
                </div>
            </form>
        </AppLayout>
    );
}
