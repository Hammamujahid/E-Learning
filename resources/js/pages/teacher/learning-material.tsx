import { EmptyState, PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { CreateMaterialDialog, useMaterialColumns, type LearningMaterialIndexProps } from '../admin/learning-material';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Materi Saya', href: '/teacher/learning-material' }];

/**
 * Teacher view of the material bank. Reuses the admin table columns; the
 * server already scopes the rows to this teacher's own materials.
 */
export default function TeacherLearningMaterialPage({ materials, subjects, can }: LearningMaterialIndexProps) {
    const columns = useMaterialColumns();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Materi Saya" />

            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Materi Saya"
                    description="Materi yang kamu buat beserta bank soalnya."
                    actions={can.create && <CreateMaterialDialog subjects={subjects} />}
                />

                {materials.length === 0 ? (
                    <EmptyState
                        icon={BookOpen}
                        title="Kamu belum membuat materi"
                        description="Mulai dengan menambahkan satu materi, lalu lengkapi dengan soal-soal quiz."
                        action={can.create && <CreateMaterialDialog subjects={subjects} />}
                    />
                ) : (
                    <DataTable columns={columns} data={materials} emptyMessage="Belum ada materi." />
                )}
            </div>
        </AppLayout>
    );
}
