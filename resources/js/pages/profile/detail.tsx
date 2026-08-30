import { PageHeader, SectionLabel, SurfaceCard } from '@/components/page-header';
import { RoleBadge, StatusBadge } from '@/components/table-cells';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Pen } from 'lucide-react';
import type { UserRow } from '../admin/user';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengguna', href: '/admin/user' },
    { title: 'Detail', href: '' },
];

function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-right text-sm font-medium text-foreground">
                {value || <span className="font-normal text-muted-foreground">—</span>}
            </span>
        </div>
    );
}

function formatDate(value: string | null | undefined): string | null {
    if (!value) return null;

    return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function DetailUser({ user }: { user: UserRow }) {
    const initials = user.name.charAt(0).toUpperCase();
    const genderLabel = user.profile?.gender === 'male' ? 'Laki-laki' : user.profile?.gender === 'female' ? 'Perempuan' : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Profil ${user.name}`} />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <PageHeader
                    title="Detail Pengguna"
                    description="Informasi akun dan profil pengguna."
                    actions={
                        <Button variant="outline" asChild>
                            <Link href={route('admin.user.edit', user.id)}>
                                <Pen className="h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    }
                />

                {/* Identitas */}
                <SurfaceCard className="flex flex-wrap items-center gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary-soft text-xl font-semibold text-primary">
                        {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-semibold text-foreground">{user.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2">
                        <RoleBadge role={user.role} />
                        <StatusBadge isDeleted={user.profile?.is_deleted ?? false} />
                    </div>
                </SurfaceCard>

                {/* Rincian */}
                <div className="grid gap-4 md:grid-cols-2">
                    <SurfaceCard>
                        <SectionLabel className="mb-3">Informasi Pribadi</SectionLabel>
                        <InfoRow label="Nama Lengkap" value={user.profile?.fullname} />
                        <InfoRow label="Jenis Kelamin" value={genderLabel} />
                        <InfoRow label="Tanggal Lahir" value={formatDate(user.profile?.birth_date)} />
                        <InfoRow label="Asal Kota" value={user.profile?.city?.name} />
                    </SurfaceCard>

                    <SurfaceCard>
                        <SectionLabel className="mb-3">Informasi Akun</SectionLabel>
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="No. Telepon" value={user.profile?.phone_number} />
                        <InfoRow label="Peran" value={user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Guru' : 'Siswa'} />
                        <InfoRow label="Bergabung" value={formatDate(user.created_at)} />
                    </SurfaceCard>
                </div>
            </div>
        </AppLayout>
    );
}
