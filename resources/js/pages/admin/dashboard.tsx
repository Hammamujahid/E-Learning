'use client';

import SummaryCard from '@/components/summary-card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { User, type BreadcrumbItem } from '@/types';
import { Activity, LearningMaterial, Question } from '@/types/interfaces';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { BookOpen, ChevronDown, Loader2, SquarePen, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor',
        href: '/dashboard',
    },
];

export default function DashboardPage() {
    const [activity, setActivity] = useState<Activity[]>([]);
    const [material, setMaterial] = useState<LearningMaterial[]>([]);
    const [newMaterial, setNewMaterial] = useState(0);
    const [user, setUser] = useState<User[]>([]);
    const [newUser, setNewUser] = useState(0);
    const [question, setQuestion] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState(0);
    const [loading, setLoading] = useState(false);
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [activityResponse, materialResponse, newMaterialResponse, userResponse, newUserResponse, questionResponse, newQuestionResponse] =
                await Promise.all([
                    api.get('/api/activities'),
                    api.get('/api/learning-materials'),
                    api.get('/api/learning-materials/latest'),
                    api.get('/api/users'),
                    api.get('/api/users/latest'),
                    api.get('/api/questions'),
                    api.get('/api/questions/latest'),
                ]);

            setActivity(activityResponse.data.data);
            setMaterial(materialResponse.data.data);
            setNewMaterial(newMaterialResponse.data.data);
            setUser(userResponse.data.data);
            setNewUser(newUserResponse.data.data);
            setNewQuestion(newQuestionResponse.data.data);
            setQuestion(questionResponse.data.data);
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

    const filteredActivity = typeFilter ? activity.filter((item) => item.type === typeFilter) : activity;

    const actionStyle: Record<string, string> = {
        created: 'text-green-500 bg-green-500/10',
        updated: 'text-yellow-500 bg-yellow-500/10',
        deleted: 'text-red-500 bg-red-500/10',
    };

    const activityColumns: ColumnDef<Activity>[] = [
        /* ================= WAKTU ================= */
        {
            accessorKey: 'created_at',
            header: 'Waktu',
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

        /* ================= TIPE ================= */
        {
            accessorKey: 'type',
            header: 'Tipe',
            size: 150,
            cell: ({ row }) => <div className="text-center font-semibold text-secondary capitalize">{row.original.type.replaceAll('_', ' ')}</div>,
        },

        /* ================= DESKRIPSI ================= */
        {
            accessorKey: 'description',
            header: 'Deskripsi',
            size: 330,
            cell: ({ row }) => <div className="truncate">{row.original.description || '-'}</div>,
        },

        /* ================= AKSI ================= */
        {
            accessorKey: 'action',
            header: 'Aksi',
            size: 150,
            cell: ({ row }) => {
                const action = row.original.action;

                return (
                    <div className="flex justify-center">
                        <span className={`rounded-md px-2 py-1 text-sm font-semibold capitalize ${actionStyle[action]}`}>{action}</span>
                    </div>
                );
            },
        },

        /* ================= BUTTON ================= */
        {
            id: 'button',
            header: 'Detail',
            size: 150,
            cell: ({ row }) => {
                const type = row.original.type;

                const route = type === 'user' ? '/user' : type === 'learning_material' ? '/learning-material' : '/question';

                const name = type === 'user' ? 'Users' : type === 'learning_material' ? 'Materials' : 'Questions';

                return (
                    <div className="flex justify-center">
                        <Link
                            href={route}
                            className="w-full rounded-md bg-secondary px-3 py-1 text-center text-sm text-white transition hover:opacity-90 active:scale-95"
                        >
                            View {name}
                        </Link>
                    </div>
                );
            },
        },
    ];

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dasbor" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <SummaryCard
                        title="USERS"
                        icon={<Users className="h-5 w-5 text-chart-3" />}
                        color="chart-3"
                        value={user.length}
                        growth={newUser ?? 0}
                        description="users baru minggu ini"
                        buttonText="View Users"
                        route="/user"
                    />
                    <SummaryCard
                        title="MATERIALS"
                        icon={<BookOpen className="h-5 w-5 text-chart-5" />}
                        color="chart-5"
                        value={material.length}
                        growth={newMaterial ?? 0}
                        description="materials baru minggu ini"
                        buttonText="View Materials"
                        route="/learning-material"
                    />
                    <SummaryCard
                        title="QUESTIONS"
                        icon={<SquarePen className="h-5 w-5 text-chart-1" />}
                        color="chart-1"
                        value={question.length}
                        growth={newQuestion ?? 0}
                        description="questions baru minggu ini"
                        buttonText="View Questions"
                        route="/question"
                    />
                </div>
                <div className="relative min-h-[100vh] flex-1 flex-col items-center justify-start overflow-hidden rounded-xl border border-sidebar-border/70 p-6 md:min-h-min dark:border-sidebar-border">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-secondary">Recent Activity {typeFilter && `(${typeFilter.replace('_', ' ')})`}</h1>

                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold text-secondary hover:bg-muted-foreground/20"
                            >
                                Filter by Type
                                <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
                            </button>

                            {open && (
                                <div className="absolute right-0 z-50 mt-2 w-full rounded-md border bg-background shadow-md">
                                    {[
                                        { label: 'All', value: null },
                                        { label: 'User', value: 'user' },
                                        { label: 'Material', value: 'learning_material' },
                                        { label: 'Question', value: 'question' },
                                    ].map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => {
                                                setTypeFilter(item.value);
                                                setOpen(false);
                                            }}
                                            className="block w-full px-3 py-2 text-left text-primary hover:bg-muted-foreground/20"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <DataTable columns={activityColumns} data={filteredActivity} pageSize={3} />
                </div>
            </div>
        </AppLayout>
    );
}
