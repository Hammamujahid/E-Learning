import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verifikasi email" description="Klik tautan yang kami kirim ke emailmu untuk memverifikasi akun">
            <Head title="Verifikasi email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-lg border border-success/20 bg-success-soft px-3 py-2 text-sm font-medium text-success">
                    Tautan verifikasi baru sudah dikirim ke email yang kamu daftarkan.
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-5">
                <Button className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Kirim Ulang Email Verifikasi
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto text-sm">
                    Keluar
                </TextLink>
            </form>
        </AuthLayout>
    );
}
