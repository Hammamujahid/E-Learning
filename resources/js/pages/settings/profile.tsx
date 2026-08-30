import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { MailWarning } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profil',
        href: '/settings/profile',
    },
];

interface ProfilePageProps {
    mustVerifyEmail: boolean;
    status?: string;
    profile: {
        fullname: string | null;
        birth_date: string | null;
        phone_number: string | null;
        gender: string | null;
        city_id: number | null;
    };
    cities: Array<{ id: number; name: string }>;
}

export default function ProfilePage({ mustVerifyEmail, status, profile, cities }: ProfilePageProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const { data, setData, patch, processing, errors, recentlySuccessful, isDirty } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        fullname: profile.fullname ?? '',
        birth_date: profile.birth_date ?? '',
        phone_number: profile.phone_number ?? '',
        gender: profile.gender ?? '',
        city_id: profile.city_id ? String(profile.city_id) : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('settings.profile.update'), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Profil" />

            <SettingsLayout>
                <div className="space-y-5">
                    <HeadingSmall title="Profil" description="Perbarui nama, email, dan data pribadimu." />

                    <form onSubmit={submit} className="space-y-5">
                        <div className="grid gap-1.5">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoComplete="name"
                                placeholder="Nama tampilan"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {mustVerifyEmail && user?.email_verified_at === null && (
                            <div className="flex gap-3 rounded-xl border border-warning/25 bg-warning-soft p-3.5">
                                <MailWarning className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
                                <div className="space-y-1 text-sm">
                                    <p className="text-warning">Alamat email kamu belum diverifikasi.</p>
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="font-medium text-warning underline underline-offset-4"
                                    >
                                        Kirim ulang email verifikasi
                                    </Link>

                                    {status === 'verification-link-sent' && (
                                        <p className="font-medium text-success">Tautan verifikasi baru sudah dikirim.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-border pt-5">
                            <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">Data Pribadi</p>

                            <div className="space-y-5">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="fullname">Nama Lengkap</Label>
                                    <Input
                                        id="fullname"
                                        value={data.fullname}
                                        onChange={(e) => setData('fullname', e.target.value)}
                                        placeholder="Sesuai identitas"
                                    />
                                    <InputError message={errors.fullname} />
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="birth_date">Tanggal Lahir</Label>
                                        <Input
                                            id="birth_date"
                                            type="date"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                        />
                                        <InputError message={errors.birth_date} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="phone_number">No. Telepon</Label>
                                        <Input
                                            id="phone_number"
                                            value={data.phone_number}
                                            onChange={(e) => setData('phone_number', e.target.value)}
                                            placeholder="08xxxxxxxxxx"
                                        />
                                        <InputError message={errors.phone_number} />
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="gender">Jenis Kelamin</Label>
                                        <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                            <SelectTrigger id="gender" className="w-full">
                                                <SelectValue placeholder="Pilih" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Laki-laki</SelectItem>
                                                <SelectItem value="female">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.gender} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="city_id">Asal Kota</Label>
                                        <Select value={data.city_id} onValueChange={(value) => setData('city_id', value)}>
                                            <SelectTrigger id="city_id" className="w-full">
                                                <SelectValue placeholder="Pilih kota" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cities.map((city) => (
                                                    <SelectItem key={city.id} value={String(city.id)}>
                                                        {city.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.city_id} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button disabled={processing || !isDirty}>Simpan Perubahan</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm font-medium text-success">Tersimpan</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
