import { controlClass, Field, FormActions } from '@/components/form-field';
import { PageHeader, SectionLabel, SurfaceCard } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { UserRow } from '../admin/user';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengguna', href: '/admin/user' },
    { title: 'Edit', href: '' },
];

interface EditProfileProps {
    user: UserRow;
    cities: Array<{ id: number; name: string }>;
}

export default function EditProfile({ user, cities }: EditProfileProps) {
    const { data, setData, patch, processing, errors, isDirty } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        fullname: user.profile?.fullname ?? '',
        birth_date: user.profile?.birth_date ?? '',
        phone_number: user.profile?.phone_number ?? '',
        gender: user.profile?.gender ?? '',
        city_id: user.profile?.city_id ? String(user.profile.city_id) : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isDirty) return;

        patch(route('admin.user.update', user.id), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.name}`} />

            <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                <PageHeader
                    title="Edit Pengguna"
                    description="Perbarui data akun dan profil pengguna."
                    actions={
                        <FormActions>
                            <Button variant="outline" asChild>
                                <Link href={route('admin.user.show', user.id)}>Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing || !isDirty}>
                                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                Simpan Perubahan
                            </Button>
                        </FormActions>
                    }
                />

                <div className="grid gap-4 lg:grid-cols-2">
                    <SurfaceCard className="flex flex-col gap-4">
                        <SectionLabel>Akun</SectionLabel>

                        <Field label="Nama" htmlFor="name" error={errors.name} required>
                            <input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={controlClass(errors.name)}
                            />
                        </Field>

                        <Field label="Email" htmlFor="email" error={errors.email} required>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={controlClass(errors.email)}
                            />
                        </Field>

                        <Field label="Peran" htmlFor="role" error={errors.role} hint="Menentukan menu dan hak akses pengguna." required>
                            <select
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value as UserRow['role'])}
                                className={controlClass(errors.role)}
                            >
                                <option value="user">Siswa</option>
                                <option value="teacher">Guru</option>
                                <option value="admin">Admin</option>
                            </select>
                        </Field>
                    </SurfaceCard>

                    <SurfaceCard className="flex flex-col gap-4">
                        <SectionLabel>Profil</SectionLabel>

                        <Field label="Nama Lengkap" htmlFor="fullname" error={errors.fullname}>
                            <input
                                id="fullname"
                                value={data.fullname}
                                onChange={(e) => setData('fullname', e.target.value)}
                                className={controlClass(errors.fullname)}
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Tanggal Lahir" htmlFor="birth_date" error={errors.birth_date}>
                                <input
                                    id="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                    className={controlClass(errors.birth_date)}
                                />
                            </Field>

                            <Field label="No. Telepon" htmlFor="phone_number" error={errors.phone_number}>
                                <input
                                    id="phone_number"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    className={controlClass(errors.phone_number)}
                                />
                            </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Jenis Kelamin" htmlFor="gender" error={errors.gender}>
                                <select
                                    id="gender"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className={controlClass(errors.gender)}
                                >
                                    <option value="">Pilih</option>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                            </Field>

                            <Field label="Asal Kota" htmlFor="city_id" error={errors.city_id}>
                                <select
                                    id="city_id"
                                    value={data.city_id}
                                    onChange={(e) => setData('city_id', e.target.value)}
                                    className={controlClass(errors.city_id)}
                                >
                                    <option value="">Pilih kota</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                    </SurfaceCard>
                </div>
            </form>
        </AppLayout>
    );
}
