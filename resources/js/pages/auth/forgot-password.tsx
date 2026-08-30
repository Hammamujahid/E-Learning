import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title="Lupa password" description="Masukkan email untuk menerima tautan reset password">
            <Head title="Lupa password" />

            {status && (
                <div className="mb-4 rounded-lg border border-success/20 bg-success-soft px-3 py-2 text-sm font-medium text-success">{status}</div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-5">
                <div className="grid gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        autoComplete="off"
                        value={data.email}
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="email@example.com"
                    />
                    <InputError message={errors.email} />
                </div>

                <Button className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Kirim Tautan Reset
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Atau kembali ke <TextLink href={route('login')}>halaman masuk</TextLink>
                </p>
            </form>
        </AuthLayout>
    );
}
