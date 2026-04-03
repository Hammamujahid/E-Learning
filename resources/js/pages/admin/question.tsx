'use client';

import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { type BreadcrumbItem } from '@/types';
import { Question } from '@/types/interfaces';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Soal',
        href: '/question',
    },
];

export default function QuestionPage() {
    const [question, setQuestion] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    const columns: ColumnDef<Question>[] = [
        {
            header: 'No',
            size: 50,
            cell: ({ row }) => {
                return <div className="text-center">{row.index + 1}</div>;
            },
        },
        {
            accessorKey: 'learning_material.name',
            header: 'Materi Soal',
            size: 100,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <span>{row.original.learning_material?.name ?? '-'}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'question_text',
            header: 'Pertanyaan',
            size: 200,
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <span>{row.original.question_text.split(' ').slice(0, 10).join(' ')}...</span>
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
        },
    ];

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/questions');
            setQuestion(response.data.data);
            toast.success('Data berhasil dimuat');
        } catch (error) {
            toast.error('Gagal memuat data');
            console.error('Error: ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
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
            <Head title="Soal - Admin Question Page" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable columns={columns} data={question} />
            </div>
        </AppLayout>
    );
}
