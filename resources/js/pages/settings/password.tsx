import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [data, setData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const reset = (...fields: (keyof typeof data)[]) => {
        if (fields.length === 0) {
            setData({ current_password: '', password: '', password_confirmation: '' });
        } else {
            setData((prev) => {
                const next = { ...prev };
                fields.forEach((f) => (next[f] = ''));
                return next;
            });
        }
    };

    const updatePassword: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await api.patch('/api/update-password', {
                current_password: data.current_password,
                password: data.password,
                password_confirmation: data.password_confirmation,
            });

            reset();
            setRecentlySuccessful(true);
            toast.success('Password berhasil diperbarui');
            setTimeout(() => setRecentlySuccessful(false), 2000);

        } catch (err) {
            const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
            const validationErrors = error.response?.data?.errors;

            if (error.response?.status === 422 && validationErrors) {
                if (validationErrors.current_password) {
                    setErrors((prev) => ({ ...prev, current_password: validationErrors.current_password[0] }));
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
                if (validationErrors.password) {
                    setErrors((prev) => ({ ...prev, password: validationErrors.password[0] }));
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
            } else {
                toast.error('Gagal memperbarui password. Coba lagi nanti.');
            }
        } finally {
            setProcessing(false);
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Update password" description="Ensure your account is using a long, random password to stay secure" />

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="current_password">Current password</Label>

                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData((prev) => ({ ...prev, current_password: e.target.value}))}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                placeholder="Current password"
                            />

                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">New password</Label>

                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value}))}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="New password"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>

                            <Input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData((prev) => ({ ...prev, password_confirmation: e.target.value}))}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="Confirm password"
                            />

                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save password</Button>

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
            </SettingsLayout>
        </AppLayout>
    );
}
