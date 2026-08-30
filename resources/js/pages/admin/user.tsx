import { EmptyState, PageHeader } from '@/components/page-header';
import { DateCell, RoleBadge, RowActions, StatusBadge } from '@/components/table-cells';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pen, Plus, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import CreateUser from '../profile/create';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pengguna', href: '/admin/user' }];

export interface UserRow {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'user';
    created_at: string | null;
    profile: {
        id: number;
        fullname: string | null;
        birth_date: string | null;
        phone_number: string | null;
        gender: string | null;
        is_deleted: boolean;
        city: { id: number; name: string } | null;
        city_id: number | null;
    } | null;
}

interface UserPageProps {
    users: UserRow[];
    cities: Array<{ id: number; name: string }>;
}

function CreateUserDialog({ cities }: { cities: Array<{ id: number; name: string }> }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4" />
                    Tambah Pengguna
                </Button>
            </DialogTrigger>

            <DialogContent className="flex max-h-[85vh] flex-col">
                <DialogHeader>
                    <DialogTitle>Tambah Pengguna</DialogTitle>
                </DialogHeader>

                <div className="-mx-1 flex-1 overflow-y-auto px-1">
                    <CreateUser cities={cities} onSuccess={() => setOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function UserPage({ users, cities }: UserPageProps) {
    const columns = useMemo<ColumnDef<UserRow>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Pengguna',
                size: 240,
                cell: ({ row }) => {
                    const user = row.original;
                    const initials = user.name.charAt(0).toUpperCase();

                    return (
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <Link
                                    href={route('admin.user.show', user.id)}
                                    className="block truncate font-medium text-foreground hover:text-primary hover:underline"
                                >
                                    {user.name}
                                </Link>
                                <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'role',
                header: 'Peran',
                size: 110,
                cell: ({ row }) => <RoleBadge role={row.original.role} />,
            },
            {
                accessorKey: 'profile.city',
                header: 'Kota',
                size: 130,
                cell: ({ row }) => <div className="truncate text-center text-sm">{row.original.profile?.city?.name ?? '—'}</div>,
            },
            {
                accessorKey: 'profile.is_deleted',
                header: 'Status',
                size: 120,
                cell: ({ row }) => <StatusBadge isDeleted={row.original.profile?.is_deleted ?? false} />,
            },
            {
                accessorKey: 'created_at',
                header: 'Bergabung',
                size: 170,
                cell: ({ row }) => <DateCell value={row.original.created_at} />,
            },
            {
                header: 'Aksi',
                size: 150,
                cell: ({ row }) => {
                    const user = row.original;

                    return (
                        <RowActions
                            isDeleted={user.profile?.is_deleted ?? false}
                            extra={
                                <>
                                    <Link
                                        href={route('admin.user.show', user.id)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-info/30 hover:bg-info-soft hover:text-info"
                                        title="Lihat detail"
                                    >
                                        <Eye size={14} />
                                    </Link>
                                    <Link
                                        href={route('admin.user.edit', user.id)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-warning/30 hover:bg-warning-soft hover:text-warning"
                                        title="Edit pengguna"
                                    >
                                        <Pen size={14} />
                                    </Link>
                                </>
                            }
                            onDeactivate={() => {
                                if (!confirm('Non-aktifkan pengguna ini?')) return;
                                router.patch(route('admin.user.toggle', user.id), { is_deleted: true }, { preserveScroll: true });
                            }}
                            onActivate={() => router.patch(route('admin.user.toggle', user.id), { is_deleted: false }, { preserveScroll: true })}
                            onDelete={() => {
                                if (!confirm('Hapus pengguna ini secara permanen? Tindakan ini tidak dapat dibatalkan.')) return;
                                router.delete(route('admin.user.destroy', user.id), { preserveScroll: true });
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
            <Head title="Daftar Pengguna" />

            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Pengguna"
                    description={`${users.length} guru dan siswa terdaftar.`}
                    actions={<CreateUserDialog cities={cities} />}
                />

                {users.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="Belum ada pengguna"
                        description="Tambahkan akun guru atau siswa untuk mulai menggunakan platform."
                        action={<CreateUserDialog cities={cities} />}
                    />
                ) : (
                    <DataTable columns={columns} data={users} emptyMessage="Belum ada pengguna." />
                )}
            </div>
        </AppLayout>
    );
}
