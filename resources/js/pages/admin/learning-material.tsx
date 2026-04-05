'use client';

import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { type BreadcrumbItem } from '@/types';
import type { LearningMaterial } from '@/types/interfaces';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Loader2, RefreshCcw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Materi',
        href: '/learning-material',
    },
];

export default function LearningMaterialPage() {
    const [learningMaterials, setLearningMaterial] = useState<LearningMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const learningMaterialsColumns: ColumnDef<LearningMaterial>[] = [
        {
            header: 'No',
            size: 50,
            cell: ({ row }) => {
                return <div className="text-center">{row.index + 1}</div>;
            },
        },
        {
            accessorKey: 'name',
            header: 'Materi',
            size: 150,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <span>{row.original.name}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'subject.name',
            header: 'Pelajaran',
            size: 150,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <span>{row.original.subject?.name ?? '-'}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'created_by',
            header: 'Dibuat Oleh',
            size: 150,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <span>{row.original.created_by || '-'}</span>
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
                        <Badge className={`${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isActive ? 'Aktif' : 'Non-aktif'}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Dibuat Pada',
            size: 150,
            cell: ({ row }) => {
                const date = new Date(row.original.created_at);

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

                const handleDeactived = async (e: React.MouseEvent) => {
                    e.stopPropagation();

                    if (!confirm('Yakin ingin non-aktifkan materi ini?')) return;

                    try {
                        await api.patch(`/api/learning-materials/${id}`, {
                            is_deleted: true,
                        });

                        toast.success('Materi berhasil dinon-aktifkan');

                        window.location.reload(); // atau update state
                    } catch (error) {
                        toast.error('Gagal menon-aktifkan materi');
                        console.error(error);
                    }
                };

                const handleActived = async (e: React.MouseEvent) => {
                    e.stopPropagation();
                    try {
                        await api.patch(`/api/learning-materials/${id}`, {
                            is_deleted: false,
                        });

                        toast.success('Materi berhasil diaktifkan');

                        window.location.reload(); // atau update state
                    } catch (error) {
                        toast.error('Gagal mengaktifkan materi');
                        console.error(error);
                    }
                };

                const handleDelete = async (e: React.MouseEvent) => {
                    e.stopPropagation();

                    if (!confirm('Yakin ingin hapus materi ini?')) return;

                    try {
                        await api.delete(`/api/learning-materials/${id}`);

                        toast.success('Materi berhasil dihapus');

                        window.location.reload(); // atau update state
                    } catch (error) {
                        toast.error('Gagal menghapus materi');
                        console.error(error);
                    }
                };

                return (
                    <div className="flex items-center justify-center gap-2">
                        {/* Detail */}
                        <Link href={`/learning-material/${id}`}>
                            <div className="cursor-ponter rounded-md bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200" title="Lihat Detail">
                                <Eye size={16} />
                            </div>
                        </Link>

                        {/* Delete */}
                        {row.original.is_deleted === false ? (
                            <button
                                onClick={handleDeactived}
                                className="cursor-pointer rounded-md bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                                title="Nonaktifkan"
                            >
                                <Trash2 size={16} />
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={handleActived}
                                    className="cursor-pointer rounded-md bg-green-100 p-2 text-green-600 transition hover:bg-green-200"
                                    title="Aktifkan"
                                >
                                    <RefreshCcw size={16} />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="cursor-pointer rounded-md bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
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

    const fetchData = async () => {
        setLoading(true);
        try {
            const learningMaterialsResponse = await api.get('/api/learning-materials', {
                params: {
                    subject: true,
                },
            });

            setLearningMaterial(learningMaterialsResponse.data.data);
            toast.success('Data berhasil dimuat');
        } catch (error) {
            toast.error('Gagal memuat data');
            console.error('Error: ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
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
            <Head title="Daftar Materi" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-primary">Daftar Materi</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <button className="mr-8 cursor-pointer rounded-lg bg-green-600 px-4 py-2 font-medium text-foreground shadow-md transition hover:font-normal hover:shadow-transparent">
                                + Tambah Materi
                            </button>
                        </DialogTrigger>

                        <DialogContent className="flex max-h-[80vh] flex-col">
                            <DialogHeader>
                                <DialogTitle>Tambah Materi</DialogTitle>
                            </DialogHeader>

                            <div className="flex-1 overflow-y-auto px-4">
                                {/* <CreateUser
                                    onSuccess={() => {
                                        setOpen(false);
                                        fetchUser();
                                    }}
                                /> */}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <DataTable columns={learningMaterialsColumns} data={learningMaterials} />
            </div>
        </AppLayout>
    );
}
