/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DataTable } from '@/components/ui/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { LearningMaterial, Subject } from '@/types/interfaces';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pelajaran',
        href: '/learning-material',
    },
];

export default function LearningMaterial() {
    const [subject, setSubject] = useState<Subject[]>([]);
    const [learningMaterials, setLearningMaterial] = useState<LearningMaterial[]>([]);
    const [loading, setLoading] = useState(true);

    const columns = React.useMemo<ColumnDef<Subject>[]>(
        () => [
            {
                header: 'No',
                size: 50,
                cell: ({ row }) => row.index + 1,
            },
            {
                accessorKey: 'name',
                header: 'Nama Pelajaran',
                size: 150,
            },
            {
                accessorKey: 'created_at',
                header: 'Dibuat Pada',
                size: 150,
                cell: ({ row}) => new Date(row.original.created_at).toLocaleDateString('id-ID')
            },
            {
                header: 'Aksi',
                size: 150,
            },
        ],
        [],
    );

    const learningMaterialsColumns = React.useMemo<ColumnDef<LearningMaterial>[]>(
        () => [
            {
                header: 'No',
                size: 50,
                cell: ({ row }) => row.index + 1,
            },
            {
                accessorKey: 'name',
                header: 'Nama Materi',
                size: 150,
            },
            {
                accessorKey: 'subject.name',
                header: 'Nama Pelajaran',
                size: 150,
            },
            {
                accessorKey: 'created_by',
                header: 'Dibuat Oleh',
                size: 150,
            },
            {
                accessorKey: 'created_at',
                header: 'Dibuat Pada',
                size: 150,
                cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString('id-ID')
            },
            {
                header: 'Aksi',
                size: 150,
            },
        ],
        [],
    );

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const subjectsResponse = await fetch('/api/subjects');
            const learningMaterialsResponse = await fetch('/api/learning-materials');

            if (subjectsResponse.status === 200 && learningMaterialsResponse.status === 200) {
                const subjectData = await subjectsResponse.json();
                const learningMaterialData = await learningMaterialsResponse.json();
                setSubject(subjectData.data);
                setLearningMaterial(learningMaterialData.data);
                toast.success('Data berhasil dimuat');
            } else {
                toast.error('Gagal memuat data');
            }
        } catch (error) {
            toast.warning('Terjadi kesalahan jaringan');
            console.error('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    }, [setSubject]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pelajaran" />
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
                            <DataTable columns={columns} data={subject} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
