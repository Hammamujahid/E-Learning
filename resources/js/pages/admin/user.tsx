'use client';

import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { type BreadcrumbItem } from '@/types';
import { Profile } from '@/types/interfaces';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Loader2, RefreshCcw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User',
        href: '/user',
    },
];

export default function UserPage() {
    const [user, setUser] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    const columns: ColumnDef<Profile>[] = [
        {
            header: 'No',
            size: 50,
            cell: ({ row }) => {
                return <div className="text-center">{row.index + 1}</div>;
            },
        },
        {
            accessorKey: 'name',
            header: 'Nama',
            size: 100,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <span>{row.original.user?.name}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'email',
            header: 'Email',
            size: 150,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <span>{row.original.user?.email}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'role',
            header: 'Peran',
            size: 100,
            cell: ({ row }) => {
                const capitalize = (text: string = '') => text.charAt(0).toUpperCase() + text.slice(1);
                return (
                    <div className="text-center">
                        <span>{capitalize(row.original.user?.role)}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'is_deleted',
            header: 'Status',
            size: 100,
            cell: ({ row }) => {
                const isActive = !row.original.is_deleted;

                return (
                    <div className="text-center">
                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                        >
                            {isActive ? 'Aktif' : 'Non-aktif'}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Dibuat Pada',
            size: 150,
            cell: ({ row }) => {
                const raw = row.original.user?.created_at;

                if (!raw) return <div className="text-center">-</div>;

                const date = new Date(raw);

                return (
                    <div className="text-center">
                        {date.toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>
                );
            },
        },
        {
            header: 'Aksi',
            size: 200,
            cell: ({ row }) => {
                const id = row.original.id;
                const userId = row.original.user?.id;

                const handleDeactived = async (e: React.MouseEvent) => {
                    e.stopPropagation();

                    if (!confirm('Yakin ingin non-aktifkan pengguna ini?')) return;

                    try {
                        await api.put(`/api/profiles/${id}`, {
                            is_deleted: true,
                        });

                        toast.success('User berhasil dinon-aktifkan');

                        window.location.reload(); // atau update state
                    } catch (error) {
                        toast.error('Gagal menon-aktifkan pengguna');
                        console.error(error);
                    }
                };

                const handleActived = async (e: React.MouseEvent) => {
                    e.stopPropagation();
                    try {
                        await api.put(`/api/profiles/${id}`, {
                            is_deleted: false,
                        });

                        toast.success('User berhasil diaktifkan');

                        window.location.reload(); // atau update state
                    } catch (error) {
                        toast.error('Gagal mengaktifkan pengguna');
                        console.error(error);
                    }
                };

                const handleDelete = async (e: React.MouseEvent) => {
                    e.stopPropagation();

                    if (!confirm('Yakin ingin hapus pengguna ini?')) return;

                    try {
                        await api.delete(`/api/profiles/${id}`);
                        await api.delete(`/api/users/${userId}`)

                        toast.success('User berhasil dihapus');

                        window.location.reload(); // atau update state
                    } catch (error) {
                        toast.error('Gagal menghapus pengguna');
                        console.error(error);
                    }
                };

                return (
                    <div className="flex items-center justify-center gap-2">
                        {/* Detail */}
                        <Link href={`/profile/${id}`}>
                            <div className="rounded-md bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200" title="Lihat Detail">
                                <Eye size={16} />
                            </div>
                        </Link>

                        {/* Delete */}
                        {row.original.is_deleted === false ? (
                            <button
                                onClick={handleDeactived}
                                className="rounded-md bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                                title="Nonaktifkan"
                            >
                                <Trash2 size={16} />
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={handleActived}
                                    className="rounded-md bg-green-100 p-2 text-green-600 transition hover:bg-green-200"
                                    title="Aktifkan"
                                >
                                    <RefreshCcw size={16} />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="rounded-md bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                                    title="Hapus"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                );
            },
        },
    ];

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/profiles', {
                params: {
                    user: true,
                    city: true,
                },
            });
            setUser(response.data.data);
            toast.success('Data berhasil dimuat');
        } catch (error) {
            toast.error('Gagal memuat data');
            console.error('Error: ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User - Admin User Page" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable columns={columns} data={user} />
            </div>
        </AppLayout>
    );
}
