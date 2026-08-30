import { EmptyState, PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, HelpCircle, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Materi', href: '/user/learning-material' }];

interface MaterialCard {
    id: number;
    name: string;
    description: string | null;
    subject: { id: number; name: string } | null;
    question_count: number;
}

interface LearningMaterialPageProps {
    materials: MaterialCard[];
    subjects: Array<{ id: number; name: string }>;
}

export default function LearningMaterialPage({ materials, subjects }: LearningMaterialPageProps) {
    const [search, setSearch] = useState('');
    const [activeSubjectId, setActiveSubjectId] = useState<number | null>(null);

    const filteredMaterials = useMemo(() => {
        const term = search.toLowerCase();

        return materials.filter((material) => {
            const matchSearch = material.name.toLowerCase().includes(term);
            const matchSubject = activeSubjectId === null || material.subject?.id === activeSubjectId;
            return matchSearch && matchSubject;
        });
    }, [materials, search, activeSubjectId]);

    const isFiltering = search.length > 0 || activeSubjectId !== null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Materi" />

            <div className="flex flex-col gap-6">
                <PageHeader title="Materi Pelajaran" description="Pilih materi yang ingin kamu pelajari hari ini." />

                {/* Pencarian & filter */}
                <div className="flex flex-col gap-3">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari materi…"
                            className="w-full rounded-lg border border-input bg-background py-2 pr-3 pl-9 text-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveSubjectId(null)}
                            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                                activeSubjectId === null
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            Semua
                        </button>

                        {subjects.map((subject) => (
                            <button
                                key={subject.id}
                                onClick={() => setActiveSubjectId(subject.id)}
                                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                                    activeSubjectId === subject.id
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-background text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                {subject.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Daftar materi */}
                {filteredMaterials.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredMaterials.map((material) => (
                            <Link
                                key={material.id}
                                href={route('user.learning-material.show', material.id)}
                                className="group flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="rounded-lg bg-primary-soft p-2.5 text-primary transition-transform group-hover:scale-105">
                                            <BookOpen className="h-5 w-5" />
                                        </div>

                                        {material.subject && (
                                            <Badge variant="outline" className="border-border bg-muted text-muted-foreground">
                                                {material.subject.name}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <h2 className="font-semibold text-foreground group-hover:text-primary">{material.name}</h2>
                                        <p className="line-clamp-2 text-sm text-muted-foreground">{material.description || 'Tanpa deskripsi.'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                                    <HelpCircle className="h-3.5 w-3.5" />
                                    {material.question_count > 0 ? `${material.question_count} soal quiz` : 'Belum ada soal'}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={BookOpen}
                        title={isFiltering ? 'Tidak ada materi yang cocok' : 'Belum ada materi'}
                        description={
                            isFiltering
                                ? 'Coba ubah kata kunci atau pilih mata pelajaran lain.'
                                : 'Materi akan muncul di sini setelah guru menambahkannya.'
                        }
                    />
                )}
            </div>
        </AppLayout>
    );
}
