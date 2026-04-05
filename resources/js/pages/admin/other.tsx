'use client';

import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { type BreadcrumbItem } from '@/types';
import { City, Subject } from '@/types/interfaces';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Loader2, Pen, RefreshCcw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CreateCity from '../city/create';
import EditCity from '../city/edit';
import CreateSubject from '../subject/create';
import EditSubject from '../subject/edit';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lainnya',
        href: '/other',
    },
];

export default function QuestionPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [openSubject, setOpenSubject] = useState(false);
    const [openCity, setOpenCity] = useState(false);
    const [openEditCity, setOpenEditCity] = useState(false);
    const [openEditSubject, setOpenEditSubject] = useState(false);

    const subjectColumns: ColumnDef<Subject>[] = [
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
                        <span>{row.original.name}</span>
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
            size: 200,
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

                    if (!confirm('Yakin ingin non-aktifkan mapel ini?')) return;

                    try {
                        await api.patch(`/api/subjects/${id}`, {
                            is_deleted: true,
                        });

                        toast.success('Mapel berhasil dinon-aktifkan');

                        window.location.reload(); // atau update state
                    } catch (error) {
                        toast.error('Gagal menon-aktifkan mapel');
                        console.error(error);
                    }
                };

                const handleActived = async (e: React.MouseEvent) => {
                    e.stopPropagation();
                    try {
                        await api.patch(`/api/subjects/${id}`, {
                            is_deleted: false,
                        });

                        toast.success('Mapel berhasil diaktifkan');

                        window.location.reload(); // atau update state
                    } catch (error) {
                        toast.error('Gagal mengaktifkan mapel');
                        console.error(error);
                    }
                };

                const handleDelete = async (e: React.MouseEvent) => {
                    e.stopPropagation();

                    if (!confirm('Yakin ingin hapus mapel ini?')) return;

                    try {
                        await api.delete(`/api/subjects/${id}`);

                        toast.success('Mapel berhasil dihapus');

                        window.location.reload(); // atau update state
                    } catch (error) {
                        toast.error('Gagal menghapus mapel');
                        console.error(error);
                    }
                };

                return (
                    <div className="flex items-center justify-center gap-2">
                        {/* Edit */}
                        <Dialog open={openEditSubject} onOpenChange={setOpenEditSubject}>
                            <DialogTrigger asChild>
                                <div
                                    className="cursor-ponter rounded-md bg-yellow-100 p-2 text-yellow-600 transition hover:bg-yellow-200"
                                    title="Edit Mapel"
                                >
                                    <Pen size={16} />
                                </div>
                            </DialogTrigger>

                            <DialogContent className="flex max-h-[80vh] flex-col">
                                <DialogHeader>
                                    <DialogTitle>Edit Mapel</DialogTitle>
                                </DialogHeader>

                                <div className="flex-1 overflow-y-auto px-4">
                                    <EditSubject
                                        subjectId={row.original.id}
                                        onSuccess={() => {
                                            setOpenEditSubject(false);
                                            fetchData();
                                        }}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>

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

    const cityColumns: ColumnDef<City>[] = [
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
                        <span>{row.original.name}</span>
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
            size: 200,
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

                    if (!confirm('Yakin ingin non-aktifkan kota ini?')) return;

                    try {
                        await api.patch(`/api/cities/${id}`, {
                            is_deleted: true,
                        });

                        toast.success('Kota berhasil dinon-aktifkan');

                        window.location.reload(); // atau update state
                    } catch (error) {
                        toast.error('Gagal menon-aktifkan kota');
                        console.error(error);
                    }
                };

                const handleActived = async (e: React.MouseEvent) => {
                    e.stopPropagation();
                    try {
                        await api.patch(`/api/cities/${id}`, {
                            is_deleted: false,
                        });

                        toast.success('Kota berhasil diaktifkan');

                        window.location.reload(); // atau update state
                    } catch (error) {
                        toast.error('Gagal mengaktifkan kota');
                        console.error(error);
                    }
                };

                const handleDelete = async (e: React.MouseEvent) => {
                    e.stopPropagation();

                    if (!confirm('Yakin ingin hapus kota ini?')) return;

                    try {
                        await api.delete(`/api/cities/${id}`);

                        toast.success('Kota berhasil dihapus');

                        window.location.reload(); // atau update state
                    } catch (error) {
                        toast.error('Gagal menghapus kota');
                        console.error(error);
                    }
                };

                return (
                    <div className="flex items-center justify-center gap-2">
                        {/* Edit */}
                        <Dialog open={openEditCity} onOpenChange={setOpenEditCity}>
                            <DialogTrigger asChild>
                                <div
                                    className="cursor-ponter rounded-md bg-yellow-100 p-2 text-yellow-600 transition hover:bg-yellow-200"
                                    title="Edit City"
                                >
                                    <Pen size={16} />
                                </div>
                            </DialogTrigger>

                            <DialogContent className="flex max-h-[80vh] flex-col">
                                <DialogHeader>
                                    <DialogTitle>Edit Kota</DialogTitle>
                                </DialogHeader>

                                <div className="flex-1 overflow-y-auto px-4">
                                    <EditCity
                                        cityId={row.original.id}
                                        onSuccess={() => {
                                            setOpenEditCity(false);
                                            fetchData();
                                        }}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>

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
            const [subjectResponse, cityResponse] = await Promise.all([api.get('/api/subjects'), api.get('/api/cities')]);
            setCities(cityResponse.data.data);
            setSubjects(subjectResponse.data.data);
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
            <Head title="Daftar Lainnya" />
            <div className="flex h-full flex-1 flex-col gap-10 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-primary">Daftar Mapel</h1>
                        <Dialog open={openSubject} onOpenChange={setOpenSubject}>
                            <DialogTrigger asChild>
                                <button className="mr-8 cursor-pointer rounded-lg bg-green-600 px-4 py-2 font-medium text-foreground shadow-md transition hover:font-normal hover:shadow-transparent">
                                    + Tambah Mapel
                                </button>
                            </DialogTrigger>

                            <DialogContent className="flex max-h-[80vh] flex-col">
                                <DialogHeader>
                                    <DialogTitle>Tambah Mata Pelajaran</DialogTitle>
                                </DialogHeader>

                                <div className="flex-1 overflow-y-auto px-4">
                                    <CreateSubject
                                        onSuccess={() => {
                                            setOpenSubject(false);
                                            fetchData();
                                        }}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>{' '}
                    <DataTable columns={subjectColumns} data={subjects} pageSize={5} />
                </div>
                <hr />
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-primary">Daftar Kota</h1>
                        <Dialog open={openCity} onOpenChange={setOpenCity}>
                            <DialogTrigger asChild>
                                <button className="mr-8 cursor-pointer rounded-lg bg-green-600 px-4 py-2 font-medium text-foreground shadow-md transition hover:font-normal hover:shadow-transparent">
                                    + Tambah Kota
                                </button>
                            </DialogTrigger>

                            <DialogContent className="flex max-h-[80vh] flex-col">
                                <DialogHeader>
                                    <DialogTitle>Tambah Kota</DialogTitle>
                                </DialogHeader>

                                <div className="flex-1 overflow-y-auto px-4">
                                    <CreateCity
                                        onSuccess={() => {
                                            setOpenCity(false);
                                            fetchData();
                                        }}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <DataTable columns={cityColumns} data={cities} pageSize={5} />
                </div>
            </div>
        </AppLayout>
    );
}
