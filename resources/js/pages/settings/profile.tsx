/* eslint-disable @typescript-eslint/no-explicit-any */
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link } from '@inertiajs/react';
import { FormEventHandler, useCallback, useEffect, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { api } from '@/lib/api';
import { getUser, setUser } from '@/lib/auth';
import { Profile } from '@/types/interfaces';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function ProfilePage({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const user = getUser();
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [name, setName] = useState(user?.name || '');
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/profiles`, {
                params: {
                    user_id: user?.id,
                },
            });
            const data = response.data.data[0];
            setProfile(data);
            toast.success('Profile loaded');
        } catch (error) {
            toast.error('Failed to load profile');
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

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

    const handleChange = (field: keyof Profile, value: any) => {
        setProfile((prev) => ({
            ...prev!,
            [field]: value,
        }));
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/api/profiles/${profile.id}`, {
                fullname: profile.fullname,
                birth_date: profile.birth_date,
                phone_number: profile.phone_number,
                gender: profile.gender,
                is_deleted: false,
            });

            // 🟢 update user name
            const userRes = await api.put(`/api/users/${user?.id}`, {
                name: name,
            });

            // update local user
            setUser(userRes.data.data);
            setRecentlySuccessful(true);
            toast.success('Profil berhasil diperbarui');
            setTimeout(() => setRecentlySuccessful(false), 2000);
        } catch (err) {
            const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
            const validationErrors = error.response?.data?.errors;

            if (error.response?.status === 422 && validationErrors) {
                if (validationErrors.fullname) setErrors((prev) => ({ ...prev, fullname: validationErrors.fullname[0] }));
                if (validationErrors.birth_date) setErrors((prev) => ({ ...prev, birth_date: validationErrors.birth_date[0] }));
                if (validationErrors.phone_number) setErrors((prev) => ({ ...prev, phone_number: validationErrors.phone_number[0] }));
                if (validationErrors.gender) setErrors((prev) => ({ ...prev, gender: validationErrors.gender[0] }));
            } else {
                toast.error('Gagal memperbarui profil. Coba lagi nanti.');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Full name</Label>
                            <Input
                                id="fullname"
                                className="mt-1 block w-full"
                                value={profile.fullname || ''}
                                onChange={(e) => handleChange('fullname', e.target.value)}
                                required
                                autoComplete="fullname"
                                placeholder="Full name"
                            />
                            <InputError className="mt-2" message={errors.fullname} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="birth_date">Birth date</Label>
                            <Input
                                id="birth_date"
                                type="date"
                                className="mt-1 block w-full"
                                value={profile.birth_date || ''}
                                onChange={(e) => handleChange('birth_date', e.target.value)}
                                autoComplete="bday"
                            />
                            <InputError className="mt-2" message={errors.birth_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone_number">Phone number</Label>
                            <Input
                                id="phone_number"
                                type="tel"
                                className="mt-1 block w-full"
                                value={profile.phone_number || ''}
                                onChange={(e) => handleChange('phone_number', e.target.value)}
                                autoComplete="tel"
                                placeholder="+62812345678"
                            />
                            <InputError className="mt-2" message={errors.phone_number} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select value={profile.gender} onValueChange={(val) => handleChange('gender', val)}>
                                <SelectTrigger id="gender" className="mt-1 w-full">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError className="mt-2" message={errors.gender} />
                        </div>

                        {mustVerifyEmail && user?.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={saving}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
