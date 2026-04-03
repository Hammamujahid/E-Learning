'use client';

import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { type BreadcrumbItem } from '@/types';
import type { LearningMaterial, Subject } from '@/types/interfaces';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pelajaran',
        href: '/learning-material',
    },
];

export default function LearningMaterialPage() {
    const [subject, setSubject] = useState<Subject[]>([]);
    const [learningMaterials, setLearningMaterial] = useState<LearningMaterial[]>([]);
    const [loading, setLoading] = useState(true);

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
            header: 'Pelajaran',
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
            size: 150,
        },
    ];

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
        },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const subjectsResponse = await api.get('/api/subjects');
            const learningMaterialsResponse = await api.get('/api/learning-materials',{
                params: {
                    subject: true
                }
            });

            setSubject(subjectsResponse.data.data);
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
            <Head title="Pelajaran - Admin Learning Material Page" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Tabs defaultValue="1" className="h-full w-full">
                    <TabsList>
                        <TabsTrigger value="1" className="hover:cursor-pointer">
                            Daftar Materi
                        </TabsTrigger>
                        <TabsTrigger value="2" className="hover:cursor-pointer">
                            Daftar Pelajaran
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="1" className="h-full w-full">
                        <div className="h-full w-full p-4">
                            <DataTable columns={learningMaterialsColumns} data={learningMaterials} />
                        </div>
                    </TabsContent>
                    <TabsContent value="2" className="h-full w-full">
                        <div className="h-full w-full p-4">
                            <DataTable columns={subjectColumns} data={subject} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
