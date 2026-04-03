'use client';

import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User',
        href: '/user',
    },
];

export default function UserPage() {
    const [user, setUser] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const columns: ColumnDef<User>[] = [
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
            accessorKey: 'email',
            header: 'Email',
            size: 150,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <span>{row.original.email}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'role',
            header: 'Peran',
            size: 50,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <span>{row.original.role}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Dibuat Pada',
            size: 200,
            cell: ({ row }) => {
                const raw = row.original.created_at;

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
        },
    ];

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/users');
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
