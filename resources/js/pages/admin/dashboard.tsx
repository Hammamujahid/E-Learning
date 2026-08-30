import { PageHeader, SectionLabel, SurfaceCard } from '@/components/page-header';
import SummaryCard from '@/components/summary-card';
import { DateCell } from '@/components/table-cells';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { BookOpen, Check, ChevronDown, ClipboardList, Layers, SquarePen, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dasbor', href: '/admin/dashboard' }];

type ActivityType = 'user' | 'learning_material' | 'question';

interface ActivityRow {
    id: number;
    model_id: number;
    type: ActivityType;
    action: 'created' | 'updated' | 'deleted';
    description: string;
    created_at: string | null;
}

interface DashboardProps {
    stats: {
        user_count: number;
        new_user_count: number;
        material_count: number;
        new_material_count: number;
        question_count: number;
        new_question_count: number;
        subject_count: number;
        attempt_count: number;
    };
    activities: ActivityRow[];
}

const ACTION_TONE: Record<string, string> = {
    created: 'border-success/20 bg-success-soft text-success',
    updated: 'border-warning/20 bg-warning-soft text-warning',
    deleted: 'border-destructive/20 bg-destructive-soft text-destructive',
};

const ACTION_LABEL: Record<string, string> = {
    created: 'Dibuat',
    updated: 'Diubah',
    deleted: 'Dihapus',
};

const TYPE_LABEL: Record<ActivityType, string> = {
    user: 'Pengguna',
    learning_material: 'Materi',
    question: 'Soal',
};

const FILTERS = [
    { label: 'Semua', value: null },
    { label: 'Pengguna', value: 'user' as const },
    { label: 'Materi', value: 'learning_material' as const },
    { label: 'Soal', value: 'question' as const },
];

export default function DashboardPage({ stats, activities }: DashboardProps) {
    const [typeFilter, setTypeFilter] = useState<ActivityType | null>(null);

    const filteredActivity = useMemo(
        () => (typeFilter ? activities.filter((item) => item.type === typeFilter) : activities),
        [activities, typeFilter],
    );

    const activityColumns = useMemo<ColumnDef<ActivityRow>[]>(
        () => [
            {
                accessorKey: 'created_at',
                header: 'Waktu',
                size: 180,
                cell: ({ row }) => <DateCell value={row.original.created_at} />,
            },
            {
                accessorKey: 'type',
                header: 'Tipe',
                size: 120,
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        <Badge variant="outline" className="border-border bg-muted text-muted-foreground">
                            {TYPE_LABEL[row.original.type]}
                        </Badge>
                    </div>
                ),
            },
            {
                accessorKey: 'description',
                header: 'Deskripsi',
                size: 380,
                cell: ({ row }) => <div className="truncate text-sm text-foreground">{row.original.description || '—'}</div>,
            },
            {
                accessorKey: 'action',
                header: 'Aksi',
                size: 120,
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        <Badge variant="outline" className={ACTION_TONE[row.original.action]}>
                            {ACTION_LABEL[row.original.action]}
                        </Badge>
                    </div>
                ),
            },
        ],
        [],
    );

    const activeFilterLabel = FILTERS.find((f) => f.value === typeFilter)?.label ?? 'Semua';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dasbor" />

            <div className="flex flex-col gap-6">
                <PageHeader title="Dasbor" description="Ringkasan aktivitas dan pertumbuhan platform." />

                {/* Kartu ringkasan */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <SummaryCard
                        title="Pengguna"
                        icon={<Users className="h-4 w-4" />}
                        tone="info"
                        value={stats.user_count}
                        growth={stats.new_user_count}
                        description="pengguna baru minggu ini"
                        buttonText="Kelola Pengguna"
                        route="/admin/user"
                    />
                    <SummaryCard
                        title="Materi"
                        icon={<BookOpen className="h-4 w-4" />}
                        tone="primary"
                        value={stats.material_count}
                        growth={stats.new_material_count}
                        description="materi baru minggu ini"
                        buttonText="Kelola Materi"
                        route="/admin/learning-material"
                    />
                    <SummaryCard
                        title="Soal"
                        icon={<SquarePen className="h-4 w-4" />}
                        tone="success"
                        value={stats.question_count}
                        growth={stats.new_question_count}
                        description="soal baru minggu ini"
                        buttonText="Kelola Materi"
                        route="/admin/learning-material"
                    />
                </div>

                {/* Metrik sekunder */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <SurfaceCard className="flex items-center gap-4">
                        <div className="rounded-lg bg-accent p-2.5 text-accent-foreground">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-foreground">{stats.subject_count}</p>
                            <p className="text-sm text-muted-foreground">Mata pelajaran terdaftar</p>
                        </div>
                        <Link href="/admin/other" className="ml-auto text-sm font-medium text-primary hover:underline">
                            Atur
                        </Link>
                    </SurfaceCard>

                    <SurfaceCard className="flex items-center gap-4">
                        <div className="rounded-lg bg-accent p-2.5 text-accent-foreground">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-foreground">{stats.attempt_count}</p>
                            <p className="text-sm text-muted-foreground">Quiz telah dikerjakan siswa</p>
                        </div>
                    </SurfaceCard>
                </div>

                {/* Aktivitas */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <SectionLabel>Aktivitas Terbaru</SectionLabel>
                            <p className="mt-1 text-sm text-muted-foreground">Perubahan pengguna, materi, dan soal yang tercatat sistem.</p>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    {activeFilterLabel}
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                {FILTERS.map((item) => (
                                    <DropdownMenuItem key={item.label} onClick={() => setTypeFilter(item.value)} className="gap-2">
                                        <span className="flex-1">{item.label}</span>
                                        {typeFilter === item.value && <Check className="h-3.5 w-3.5 text-primary" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <DataTable columns={activityColumns} data={filteredActivity} pageSize={8} emptyMessage="Belum ada aktivitas tercatat." />
                </div>
            </div>
        </AppLayout>
    );
}
