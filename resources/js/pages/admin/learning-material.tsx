import { EmptyState, PageHeader } from '@/components/page-header';
import { DateCell, RowActions, StatusBadge } from '@/components/table-cells';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { BookOpen, Eye, Pen, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import CreateMaterial from '../learning-material/create';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Materi', href: '/admin/learning-material' }];

export interface MaterialRow {
    id: number;
    name: string;
    description: string | null;
    file_path: string | null;
    is_deleted: boolean;
    created_at: string | null;
    subject: { id: number; name: string } | null;
    creator_name: string | null;
    questions_count: number;
    can: { update: boolean; delete: boolean };
}

export interface LearningMaterialIndexProps {
    materials: MaterialRow[];
    subjects: Array<{ id: number; name: string }>;
    can: { create: boolean };
}

/**
 * Builds the management table columns. Shared by the admin and teacher
 * screens; per-row actions honour the `can` flags sent by the server.
 */
export function useMaterialColumns(): ColumnDef<MaterialRow>[] {
    return useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Materi',
                size: 240,
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <Link
                            href={route('learning-material.show', row.original.id)}
                            className="truncate font-medium text-foreground hover:text-primary hover:underline"
                        >
                            {row.original.name}
                        </Link>
                        <span className="truncate text-xs text-muted-foreground">{row.original.description || 'Tanpa deskripsi'}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'subject.name',
                header: 'Pelajaran',
                size: 140,
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        {row.original.subject ? (
                            <Badge variant="outline" className="border-border bg-muted text-muted-foreground">
                                {row.original.subject.name}
                            </Badge>
                        ) : (
                            <span className="text-muted-foreground">—</span>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'creator_name',
                header: 'Dibuat Oleh',
                size: 140,
                cell: ({ row }) => <div className="truncate text-center text-sm">{row.original.creator_name ?? '—'}</div>,
            },
            {
                accessorKey: 'questions_count',
                header: 'Soal',
                size: 90,
                cell: ({ row }) => (
                    <div className="text-center">
                        {row.original.questions_count > 0 ? (
                            <span className="font-medium text-foreground tabular-nums">{row.original.questions_count}</span>
                        ) : (
                            <span className="text-xs text-muted-foreground">Kosong</span>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'is_deleted',
                header: 'Status',
                size: 120,
                cell: ({ row }) => <StatusBadge isDeleted={row.original.is_deleted} />,
            },
            {
                accessorKey: 'created_at',
                header: 'Dibuat',
                size: 170,
                cell: ({ row }) => <DateCell value={row.original.created_at} />,
            },
            {
                header: 'Aksi',
                size: 150,
                cell: ({ row }) => {
                    const material = row.original;

                    return (
                        <RowActions
                            isDeleted={material.is_deleted}
                            canEdit={material.can.update}
                            canDelete={material.can.delete}
                            extra={
                                <>
                                    <Link
                                        href={route('learning-material.show', material.id)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-info/30 hover:bg-info-soft hover:text-info"
                                        title="Lihat detail"
                                    >
                                        <Eye size={14} />
                                    </Link>

                                    {material.can.update && (
                                        <Link
                                            href={route('learning-material.edit', material.id)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-warning/30 hover:bg-warning-soft hover:text-warning"
                                            title="Edit materi"
                                        >
                                            <Pen size={14} />
                                        </Link>
                                    )}
                                </>
                            }
                            onDeactivate={() => {
                                if (!confirm('Non-aktifkan materi ini? Materi akan disembunyikan dari siswa.')) return;
                                router.patch(route('learning-material.toggle', material.id), { is_deleted: true }, { preserveScroll: true });
                            }}
                            onActivate={() =>
                                router.patch(route('learning-material.toggle', material.id), { is_deleted: false }, { preserveScroll: true })
                            }
                            onDelete={() => {
                                if (!confirm('Hapus materi ini?')) return;
                                router.delete(route('learning-material.destroy', material.id), { preserveScroll: true });
                            }}
                        />
                    );
                },
            },
        ],
        [],
    );
}

/** Shared "+ Tambah Materi" dialog trigger. */
export function CreateMaterialDialog({ subjects }: { subjects: Array<{ id: number; name: string }> }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4" />
                    Tambah Materi
                </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[85vh] flex-col">
                <DialogHeader>
                    <DialogTitle>Tambah Materi</DialogTitle>
                </DialogHeader>

                <div className="-mx-1 flex-1 overflow-y-auto px-1">
                    <CreateMaterial subjects={subjects} onSuccess={() => setOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function LearningMaterialPage({ materials, subjects, can }: LearningMaterialIndexProps) {
    const columns = useMaterialColumns();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Materi" />

            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Materi"
                    description={`${materials.length} materi terdaftar di platform.`}
                    actions={can.create && <CreateMaterialDialog subjects={subjects} />}
                />

                {materials.length === 0 ? (
                    <EmptyState
                        icon={BookOpen}
                        title="Belum ada materi"
                        description="Tambahkan materi pembelajaran pertama agar siswa punya bahan untuk dipelajari."
                        action={can.create && <CreateMaterialDialog subjects={subjects} />}
                    />
                ) : (
                    <DataTable columns={columns} data={materials} emptyMessage="Belum ada materi." />
                )}
            </div>
        </AppLayout>
    );
}
