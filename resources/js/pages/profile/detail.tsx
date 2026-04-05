import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { BreadcrumbItem } from '@/types';
import { Profile } from '@/types/interfaces';
import { Head, Link, usePage } from '@inertiajs/react';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Daftar Pengguna', href: '/admin/user' },
    { title: 'Detail Profil', href: '' },
];

function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex items-start justify-between gap-3 border-b border-border/10 py-2.5 last:border-b-0 last:pb-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className={`text-right text-sm font-medium text-primary ${!value ? 'font-normal text-muted-foreground/60 italic' : ''}`}>
                {value || '—'}
            </span>
        </div>
    );
}

export default function DetailUser() {
    const { id } = usePage<{ id: number }>().props;
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/profiles/${id}`, {
                params: { user: true, city: true },
            });
            setProfile(response.data.data);
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message ?? 'Gagal memuat data');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (loading || !profile) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const initials = profile.user?.name?.charAt(0)?.toUpperCase() ?? '?';

    const joinDate = profile.user?.created_at
        ? new Date(profile.user.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : null;

    const birthDate = profile.birth_date
        ? new Date(profile.birth_date).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : null;

    const genderLabel = profile.gender === 'male' ? 'Laki-laki' : profile.gender === 'female' ? 'Perempuan' : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Profil" />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4">
                {/* Page header */}
                <div className="flex flex-col items-start justify-center">
                    <h1 className="text-xl font-medium text-primary">Detail Profil</h1>
                    <p className="text-sm text-muted-foreground">Informasi lengkap mengenai pengguna</p>
                </div>

                {/* Hero card */}
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-muted-foreground/20 bg-background p-5 shadow-lg">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-2xl font-medium text-purple-700">
                        {initials}
                    </div>
                    <div className="flex-1">
                        <p className="text-lg font-medium text-primary">{profile.user?.name}</p>
                        <p className="text-sm text-muted-foreground">{profile.user?.email}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-600 capitalize">
                                {profile.user?.role}
                            </span>
                        </div>
                    </div>
                    <Link href={`/profile/edit/${id}`}>
                        <button className="cursor-pointer rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-sm text-yellow-700 transition hover:bg-yellow-100">
                            Edit Profil
                        </button>
                    </Link>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-muted-foreground/20 bg-background p-5 shadow-lg">
                        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground/60 uppercase">Informasi Pribadi</p>
                        <InfoRow label="Nama" value={profile.user?.name} />
                        <InfoRow label="Nama Lengkap" value={profile.fullname} />
                        <InfoRow label="Jenis Kelamin" value={genderLabel} />
                        <InfoRow label="Tanggal Lahir" value={birthDate} />
                        <InfoRow label="Asal Kota" value={profile.city?.name} />
                    </div>

                    <div className="rounded-xl border border-muted-foreground/20 bg-background p-5 shadow-lg">
                        <p className="mb-3 text-xs font-medium tracking-widest text-muted-foreground/60 uppercase">Informasi Akun</p>
                        <InfoRow label="Email" value={profile.user?.email} />
                        <InfoRow label="No. Telepon" value={profile.phone_number} />
                        <InfoRow label="Peran" value={profile.user?.role} />
                        <InfoRow label="Bergabung" value={joinDate} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
