import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { BreadcrumbItem } from '@/types';
import { LearningMaterial, Subject } from '@/types/interfaces';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Loader2, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Materi Pelajaran',
        href: '/learning-material',
    },
];

export default function LearningMaterialPage() {
    const [search, setSearch] = useState('');
    const [activeSubjectId, setActiveSubjectId] = useState<number | null>(null);
    const [materials, setMaterials] = useState<LearningMaterial[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    const filteredMaterials = materials.filter((material) => {
        const matchSearch = material.name.toLowerCase().includes(search.toLowerCase());
        const matchSubject = activeSubjectId === null || material.subject_id === activeSubjectId;
        return matchSearch && matchSubject;
    });

    const fetchMaterials = useCallback(async () => {
        try {
            const response = await api.get('/api/learning-materials', {
                params: {
                    subject: true,
                    is_deleted: false
                },
            });
            setMaterials(response.data.data);
        } catch (error) {
            console.error('Error get learning materials:', error);
            toast.error('Gagal memuat materi pelajaran');
        }
    }, []);

    const fetchSubjects = useCallback(async () => {
        try {
            const response = await api.get('/api/subjects');
            setSubjects(response.data.data);
        } catch (error) {
            console.error('Error get subjects', error);
            toast.error('Gagal memuat mata pelajaran');
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchMaterials(), fetchSubjects()]);
            setLoading(false);
        };
        loadData();
    }, [fetchMaterials, fetchSubjects]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Materi Pelajaran" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 text-black">
                {/* Header */}
                <div>
                    <div className="text-2xl font-semibold">Materi Pelajaran</div>
                    <p className="mt-1 text-sm text-gray-500">Pilih Materi Pelajaran yang ingin kamu pelajari hari ini.</p>
                </div>

                {/* Search + Filter by Subject */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari Materi Pelajaran..."
                            className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-9 text-sm outline-none focus:border-gray-400"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveSubjectId(null)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                activeSubjectId === null ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Semua
                        </button>
                        {subjects.map((subject) => (
                            <button
                                key={subject.id}
                                onClick={() => setActiveSubjectId(subject.id)}
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                                    activeSubjectId === subject.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {subject.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Cards */}
                {filteredMaterials.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredMaterials.map((material) => (
                            <Link
                                key={material.id}
                                href={`/user/learning-material/${material.id}`}
                                className="group flex flex-col justify-between rounded-xl border border-gray-200 p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div className="rounded-lg bg-gray-100 p-2.5">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                            {material.subject?.name ?? 'Tanpa Kategori'}
                                        </span>
                                    </div>

                                    <div className="mt-4 text-lg font-semibold group-hover:underline">{material.name}</div>
                                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">{material.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center py-16 text-center text-gray-400">
                        <BookOpen className="mb-3 h-10 w-10" />
                        <p>Materi Pelajaran tidak ditemukan.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
