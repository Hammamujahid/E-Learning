import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { BreadcrumbItem } from '@/types';
import { City, Profile } from '@/types/interfaces';
import { Head, Link, usePage } from '@inertiajs/react';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengguna', href: '/admin/user' },
    { title: 'Edit Profil', href: '' },
];

function FieldRow({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
    return (
        <div className="border-b border-border/10 py-2.5 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between gap-3">
                <span className="w-32 flex-shrink-0 text-sm text-muted-foreground">{label}</span>
                <div className="flex-1">{children}</div>
            </div>
            {error && <p className="mt-1 text-right text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default function EditProfile() {
    const { id } = usePage<{ id: number }>().props;
    const [profile, setProfile] = useState<Profile | null>(null);
    const [original, setOriginal] = useState<Profile | null>(null);
    const [originalName, setOriginalName] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [originalRole, setOriginalRole] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const [profileRes, citiesRes] = await Promise.all([
                api.get(`/api/profiles/${id}`, { params: { user: true, city: true } }),
                api.get('/api/cities'),
            ]);
            const data = profileRes.data.data;
            setProfile(data);
            setOriginal(data);
            setName(data.user?.name ?? '');
            setOriginalName(data.user?.name ?? '');
            setEmail(data.user?.email ?? '');
            setOriginalEmail(data.user?.email ?? '');
            setRole(data.user?.role ?? '');
            setOriginalRole(data.user?.role ?? '');
            setCities(citiesRes.data.data);
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message ?? 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const isDirty = useMemo(() => {
        if (!profile || !original) return false;
        return (
            name !== originalName ||
            email !== originalEmail ||
            role !== originalRole ||
            profile.fullname !== original.fullname ||
            profile.birth_date !== original.birth_date ||
            profile.phone_number !== original.phone_number ||
            profile.gender !== original.gender ||
            profile.city?.id !== original.city?.id
        );
    }, [name, originalName, email, originalEmail, role, originalRole, profile, original]);

    const handleChange = (field: keyof Profile, value: string | number | null) => {
        setProfile((prev) => ({ ...prev!, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const handleSaving = async () => {
        if (!isDirty) return;
        setSaving(true);
        setErrors({});

        try {
            const response = await api.put(`/api/profiles/${profile?.id}`, {
                name,
                email,
                role,
                fullname: profile?.fullname,
                birth_date: profile?.birth_date,
                phone_number: profile?.phone_number,
                gender: profile?.gender,
                city_id: profile?.city?.id,
            });

            const updated = response.data.data;
            setProfile(updated);
            setOriginal(updated);
            setOriginalName(name);
            setOriginalEmail(email);
            setOriginalRole(role);
            toast.success('Profil berhasil diperbarui');
        } catch (err) {
            const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
            const validationErrors = error.response?.data?.errors;
            if (error.response?.status === 422 && validationErrors) {
                const mapped: Record<string, string> = {};
                Object.entries(validationErrors).forEach(([k, v]) => (mapped[k] = v[0]));
                setErrors(mapped);
            } else {
                toast.error('Gagal menyimpan. Coba lagi nanti.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading || !profile) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const initials = name?.charAt(0)?.toUpperCase() ?? '?';

    const inputClass =
        'w-full rounded-md border border-border/30 bg-background px-2.5 py-1.5 text-right text-sm text-primary focus:outline-none focus:ring-1 focus:ring-border/60';
    const selectClass =
        'w-full rounded-md border border-border/30 bg-background px-2.5 py-1.5 text-right text-sm text-primary focus:outline-none focus:ring-1 focus:ring-border/60';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Profil" />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4">
                {/* Page header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-medium text-primary">Edit Profil</h1>
                    <Link href={`/profile/${id}`}>
                        <button className="flex items-center gap-1.5 bg-background px-3 py-1.5 text-sm text-primary hover:cursor-pointer hover:text-blue-600">
                            ← Kembali
                        </button>
                    </Link>
                </div>

                {/* Hero card */}
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-muted-foreground/20 bg-background p-5 shadow-lg">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-2xl font-medium text-purple-700">
                        {initials}
                    </div>
                    <div className="flex-1">
                        <p className="text-lg font-medium text-primary">{name || '—'}</p>
                        <p className="text-sm text-muted-foreground">{email || '—'}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium capitalize text-indigo-600">
                                {role || '—'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleSaving}
                        disabled={saving || !isDirty}
                        className="rounded-lg border border-green-200 bg-green-50 px-4 py-1.5 text-sm text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {saving ? (
                            <span className="flex items-center gap-1.5">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Menyimpan...
                            </span>
                        ) : (
                            'Simpan'
                        )}
                    </button>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Informasi Pribadi */}
                    <div className="rounded-xl border border-muted-foreground/20 bg-background p-5 shadow-lg">
                        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                            Informasi Pribadi
                        </p>

                        <FieldRow label="Nama Lengkap" error={errors.fullname}>
                            <input
                                className={inputClass}
                                value={profile.fullname ?? ''}
                                onChange={(e) => handleChange('fullname', e.target.value)}
                                placeholder="Nama lengkap"
                            />
                        </FieldRow>

                        <FieldRow label="Jenis Kelamin" error={errors.gender}>
                            <select
                                className={selectClass}
                                value={profile.gender ?? ''}
                                onChange={(e) => handleChange('gender', e.target.value)}
                            >
                                <option value="">— Pilih —</option>
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </select>
                        </FieldRow>

                        <FieldRow label="Tanggal Lahir" error={errors.birth_date}>
                            <input
                                type="date"
                                className={inputClass}
                                value={profile.birth_date ?? ''}
                                onChange={(e) => handleChange('birth_date', e.target.value)}
                            />
                        </FieldRow>

                        <FieldRow label="Asal Kota" error={errors.city_id}>
                            <select
                                className={selectClass}
                                value={profile.city?.id ? String(profile.city.id) : ''}
                                onChange={(e) => {
                                    const selected = cities.find((c) => c.id === Number(e.target.value));
                                    setProfile((prev) => ({ ...prev!, city: selected ?? null }));
                                    setErrors((prev) => ({ ...prev, city_id: '' }));
                                }}
                            >
                                <option value="">— Pilih Kota —</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={String(city.id)}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </FieldRow>
                    </div>

                    {/* Informasi Akun */}
                    <div className="rounded-xl border border-muted-foreground/20 bg-background p-5 shadow-lg">
                        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                            Informasi Akun
                        </p>

                        <FieldRow label="Nama" error={errors.name}>
                            <input
                                className={inputClass}
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrors((prev) => ({ ...prev, name: '' }));
                                }}
                                placeholder="Nama"
                            />
                        </FieldRow>

                        <FieldRow label="Email" error={errors.email}>
                            <input
                                type="email"
                                className={inputClass}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors((prev) => ({ ...prev, email: '' }));
                                }}
                                placeholder="email@example.com"
                            />
                        </FieldRow>

                        <FieldRow label="No. Telepon" error={errors.phone_number}>
                            <input
                                type="tel"
                                className={inputClass}
                                value={profile.phone_number ?? ''}
                                onChange={(e) => handleChange('phone_number', e.target.value)}
                                placeholder="+62812345678"
                            />
                        </FieldRow>

                        <FieldRow label="Peran" error={errors.role}>
                            <select
                                className={selectClass}
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    setErrors((prev) => ({ ...prev, role: '' }));
                                }}
                            >
                                <option value="">— Pilih Peran —</option>
                                <option value="teacher">Teacher</option>
                                <option value="user">User</option>
                            </select>
                        </FieldRow>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
