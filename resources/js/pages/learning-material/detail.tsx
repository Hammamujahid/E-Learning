import { DocumentViewer, FileTypeBadge, MetaBadge, NoFilePlaceholder } from '@/components/document-viewer';
import { EmptyState, PageHeader, SectionLabel, SurfaceCard } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, CalendarDays, Check, ExternalLink, FileText, HelpCircle, Pen, Plus, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import CreateQuestion from '../question/create';
import EditQuestion, { type EditableQuestion } from '../question/edit';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Materi', href: '/admin/learning-material' },
    { title: 'Detail', href: '' },
];

interface DetailProps {
    material: {
        id: number;
        name: string;
        description: string | null;
        file_path: string | null;
        created_at: string | null;
        subject: { id: number; name: string } | null;
        creator_name: string | null;
        can: { update: boolean; delete: boolean };
    };
    questions: EditableQuestion[];
    canCreateQuestion: boolean;
}

export default function Detail({ material, questions, canCreateQuestion }: DetailProps) {
    const [tab, setTab] = useState('file');
    const [openAdd, setOpenAdd] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<EditableQuestion | null>(null);

    const fileName = material.file_path?.split('/').pop() ?? null;

    const createdDate = material.created_at
        ? new Date(material.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—';

    const handleDeleteQuestion = (questionId: number) => {
        if (!confirm('Hapus soal ini?')) return;

        router.delete(route('question.destroy', questionId), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={material.name} />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <PageHeader
                    title={material.name}
                    description={material.subject?.name ? `Mata pelajaran: ${material.subject.name}` : 'Tanpa mata pelajaran'}
                    actions={
                        material.can.update && (
                            <Button variant="outline" asChild>
                                <Link href={route('learning-material.edit', material.id)}>
                                    <Pen className="h-4 w-4" />
                                    Edit Materi
                                </Link>
                            </Button>
                        )
                    }
                />

                {/* Ringkasan */}
                <SurfaceCard className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <FileText className="h-5 w-5" />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-3">
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {material.description || <span className="italic">Materi ini belum memiliki deskripsi.</span>}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {material.subject?.name && <MetaBadge icon={<BookOpen className="h-3.5 w-3.5" />} label={material.subject.name} />}
                                {material.creator_name && <MetaBadge icon={<User className="h-3.5 w-3.5" />} label={material.creator_name} />}
                                <MetaBadge icon={<CalendarDays className="h-3.5 w-3.5" />} label={createdDate} />
                                <MetaBadge icon={<HelpCircle className="h-3.5 w-3.5" />} label={`${questions.length} soal`} />
                            </div>
                        </div>
                    </div>
                </SurfaceCard>

                {/* Tab file & soal */}
                <Tabs value={tab} onValueChange={setTab} className="gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <TabsList>
                            <TabsTrigger value="file">File Materi</TabsTrigger>
                            <TabsTrigger value="questions">Bank Soal ({questions.length})</TabsTrigger>
                        </TabsList>

                        {tab === 'questions' && canCreateQuestion && (
                            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                                <DialogTrigger asChild>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4" />
                                        Tambah Soal
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Tambah Soal</DialogTitle>
                                    </DialogHeader>

                                    <div className="-mx-1 flex-1 overflow-y-auto px-1">
                                        <CreateQuestion learningMaterialId={material.id} onSuccess={() => setOpenAdd(false)} />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    <TabsContent value="file">
                        <SurfaceCard>
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                <SectionLabel>File Materi</SectionLabel>

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
                    </TabsContent>

                    <TabsContent value="questions">
                        {questions.length === 0 ? (
                            <EmptyState
                                icon={HelpCircle}
                                title="Belum ada soal"
                                description="Tambahkan soal agar siswa bisa mengerjakan quiz untuk materi ini."
                                action={
                                    canCreateQuestion && (
                                        <Button size="sm" onClick={() => setOpenAdd(true)}>
                                            <Plus className="h-4 w-4" />
                                            Tambah Soal
                                        </Button>
                                    )
                                }
                            />
                        ) : (
                            <div className="flex flex-col gap-3">
                                {questions.map((question, qIndex) => (
                                    <SurfaceCard key={question.id}>
                                        <div className="mb-4 flex items-start gap-3">
                                            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary-soft text-xs font-semibold text-primary">
                                                {qIndex + 1}
                                            </span>

                                            <p className="flex-1 text-sm leading-relaxed font-medium text-foreground">{question.question_text}</p>

                                            <div className="flex flex-shrink-0 items-center gap-1.5">
                                                {question.can.update && (
                                                    <button
                                                        onClick={() => setEditingQuestion(question)}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-warning/30 hover:bg-warning-soft hover:text-warning"
                                                        title="Edit soal"
                                                    >
                                                        <Pen size={14} />
                                                    </button>
                                                )}

                                                {question.can.delete && (
                                                    <button
                                                        onClick={() => handleDeleteQuestion(question.id)}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive-soft hover:text-destructive"
                                                        title="Hapus soal"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {question.media_path && (
                                            <img
                                                src={question.media_path}
                                                alt="Gambar soal"
                                                className="mb-4 ml-10 h-40 w-auto rounded-lg border border-border object-cover"
                                            />
                                        )}

                                        <div className="grid gap-2 pl-10 sm:grid-cols-2">
                                            {question.answers.map((ans, aIndex) => (
                                                <div
                                                    key={ans.id}
                                                    className={`flex items-start gap-2.5 rounded-lg border px-3 py-2 text-sm ${
                                                        ans.is_correct
                                                            ? 'border-success/25 bg-success-soft text-success'
                                                            : 'border-border text-muted-foreground'
                                                    }`}
                                                >
                                                    <span
                                                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                                                            ans.is_correct ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        {String.fromCharCode(65 + aIndex)}
                                                    </span>

                                                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                                                        {ans.media_path && (
                                                            <img
                                                                src={ans.media_path}
                                                                alt="Gambar jawaban"
                                                                className="h-16 w-auto rounded object-cover"
                                                            />
                                                        )}
                                                        <span className="break-words">{ans.answer_text}</span>
                                                    </div>

                                                    {ans.is_correct && <Check className="h-4 w-4 flex-shrink-0" />}
                                                </div>
                                            ))}
                                        </div>
                                    </SurfaceCard>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Satu dialog edit untuk seluruh daftar, dikendalikan soal terpilih */}
            <Dialog open={editingQuestion !== null} onOpenChange={(open) => !open && setEditingQuestion(null)}>
                <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Soal</DialogTitle>
                    </DialogHeader>

                    <div className="-mx-1 flex-1 overflow-y-auto px-1">
                        {editingQuestion && <EditQuestion question={editingQuestion} onSuccess={() => setEditingQuestion(null)} />}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
