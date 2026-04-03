import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { api } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
import { Head, useForm } from '@inertiajs/react';
import { AxiosError } from 'axios';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: UserRole;
    };
}

type UserRole = 'admin' | 'teacher' | 'user';

const ROLE_REDIRECT: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    teacher: '/teacher/overview',
    user: '/user/overview',
};

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, errors, reset, setError } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });
    const [processing, setProcessing] = useState(false);

    const handleSuccess = ({ token, user }: LoginResponse) => {
        setToken(token);
        setUser(user);

        const redirectTo = ROLE_REDIRECT[user.role] ?? '/dashboard';
        window.location.href = redirectTo;

        toast.success('Login berhasil!');
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await api.post<LoginResponse>('/api/login', {
                email: data.email,
                password: data.password,
                remember: data.remember,
            });
            handleSuccess(response.data);
        } catch (err) {
            const error = err as AxiosError<{ errors?: Record<string, string[]>; message?: string }>;
            const status = error.response?.status;
            const validationErrors = error.response?.data?.errors;

            if (status === 422 && validationErrors) {
                if (validationErrors.email) setError('email', validationErrors.email[0]);
                if (validationErrors.password) setError('password', validationErrors.password[0]);
            } else if (status === 401) {
                setError('email', 'Email atau password salah.');
            } else {
                toast.error('Login gagal. Coba lagi nanti.');
            }
            reset('password');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <TextLink className="text-secondary" href={route('register')} tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
