import { PageHeader, SectionLabel } from '@/components/page-header';
import { DateCell, RowActions, StatusBadge } from '@/components/table-cells';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import CreateCity from '../city/create';
import EditCity from '../city/edit';
import CreateSubject from '../subject/create';
import EditSubject from '../subject/edit';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Data Master', href: '/admin/other' }];

interface SubjectRow {
    id: number;
    name: string;
    description: string | null;
    is_deleted: boolean;
    created_at: string | null;
}

interface CityRow {
    id: number;
    name: string;
    is_deleted: boolean;
    created_at: string | null;
}

interface OtherPageProps {
    subjects: SubjectRow[];
    cities: CityRow[];
}

function AddDialog({ label, title, children }: { label: string; title: string; children: (close: () => void) => ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                    {label}
                </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[85vh] flex-col">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="-mx-1 flex-1 overflow-y-auto px-1">{children(() => setOpen(false))}</div>
            </DialogContent>
        </Dialog>
    );
}

export default function OtherPage({ subjects, cities }: OtherPageProps) {
    const subjectColumns = useMemo<ColumnDef<SubjectRow>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Mata Pelajaran',
                size: 200,
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="truncate font-medium text-foreground">{row.original.name}</span>
                        <span className="truncate text-xs text-muted-foreground">{row.original.description || 'Tanpa deskripsi'}</span>
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
                size: 140,
                cell: ({ row }) => {
                    const subject = row.original;

                    return (
                        <RowActions
                            isDeleted={subject.is_deleted}
                            editDialog={{
                                title: 'Edit Mata Pelajaran',
                                render: (close) => <EditSubject subject={subject} onSuccess={close} />,
                            }}
                            onDeactivate={() => {
                                if (!confirm('Non-aktifkan mata pelajaran ini?')) return;
                                router.patch(route('admin.subject.update', subject.id), { is_deleted: true }, { preserveScroll: true });
                            }}
                            onActivate={() =>
                                router.patch(route('admin.subject.update', subject.id), { is_deleted: false }, { preserveScroll: true })
                            }
                            onDelete={() => {
                                if (!confirm('Hapus mata pelajaran ini?')) return;
                                router.delete(route('admin.subject.destroy', subject.id), { preserveScroll: true });
                            }}
                        />
                    );
                },
            },
        ],
        [],
    );

    const cityColumns = useMemo<ColumnDef<CityRow>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Kota',
                size: 200,
                cell: ({ row }) => <span className="truncate font-medium text-foreground">{row.original.name}</span>,
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
                size: 140,
                cell: ({ row }) => {
                    const city = row.original;

                    return (
                        <RowActions
                            isDeleted={city.is_deleted}
                            editDialog={{
                                title: 'Edit Kota',
                                render: (close) => <EditCity city={city} onSuccess={close} />,
                            }}
                            onDeactivate={() => {
                                if (!confirm('Non-aktifkan kota ini?')) return;
                                router.patch(route('admin.city.update', city.id), { is_deleted: true }, { preserveScroll: true });
                            }}
                            onActivate={() => router.patch(route('admin.city.update', city.id), { is_deleted: false }, { preserveScroll: true })}
                            onDelete={() => {
                                if (!confirm('Hapus kota ini?')) return;
                                router.delete(route('admin.city.destroy', city.id), { preserveScroll: true });
                            }}
                        />
                    );
                },
            },
        ],
        [],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Master" />

            <div className="flex flex-col gap-8">
                <PageHeader title="Data Master" description="Kelola mata pelajaran dan daftar kota yang dipakai di seluruh platform." />

                <section className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <SectionLabel>Mata Pelajaran</SectionLabel>
                            <p className="mt-1 text-sm text-muted-foreground">{subjects.length} mata pelajaran terdaftar.</p>
                        </div>

                        <AddDialog label="Tambah Mapel" title="Tambah Mata Pelajaran">
                            {(close) => <CreateSubject onSuccess={close} />}
                        </AddDialog>
                    </div>

                    <DataTable columns={subjectColumns} data={subjects} pageSize={5} emptyMessage="Belum ada mata pelajaran." />
                </section>

                <section className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <SectionLabel>Kota</SectionLabel>
                            <p className="mt-1 text-sm text-muted-foreground">{cities.length} kota terdaftar.</p>
                        </div>

                        <AddDialog label="Tambah Kota" title="Tambah Kota">
                            {(close) => <CreateCity onSuccess={close} />}
                        </AddDialog>
                    </div>

                    <DataTable columns={cityColumns} data={cities} pageSize={5} emptyMessage="Belum ada kota." />
                </section>
            </div>
        </AppLayout>
    );
}
