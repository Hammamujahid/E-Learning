import { Field, controlClass } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface CreateUserProps {
    /** Provided by the parent page's props; no extra request needed. */
    cities: Array<{ id: number; name: string }>;
    onSuccess?: () => void;
}

export default function CreateUser({ cities, onSuccess }: CreateUserProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
        fullname: '',
        phone_number: '',
        birth_date: '',
        gender: '',
        city_id: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('admin.user.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        });
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            {/* ── Akun ──────────────────────────────────────────────── */}
            <div className="space-y-4">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Akun</p>

                <Field label="Nama" htmlFor="user-name" error={errors.name} required>
                    <input
                        id="user-name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Nama tampilan"
                        className={controlClass(errors.name)}
                        autoFocus
                    />
                </Field>

                <Field label="Email" htmlFor="user-email" error={errors.email} required>
                    <input
                        id="user-email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="email@example.com"
                        className={controlClass(errors.email)}
                    />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Password" htmlFor="user-password" error={errors.password} required>
                        <input
                            id="user-password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={controlClass(errors.password)}
                        />
                    </Field>

                    <Field label="Konfirmasi Password" htmlFor="user-password-confirm">
                        <input
                            id="user-password-confirm"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className={controlClass()}
                        />
                    </Field>
                </div>

                <Field label="Peran" htmlFor="user-role" error={errors.role} required>
                    <select id="user-role" value={data.role} onChange={(e) => setData('role', e.target.value)} className={controlClass(errors.role)}>
                        <option value="user">Siswa</option>
                        <option value="teacher">Guru</option>
                        <option value="admin">Admin</option>
                    </select>
                </Field>
            </div>

            {/* ── Profil ────────────────────────────────────────────── */}
            <div className="space-y-4 border-t border-border pt-5">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Profil</p>

                <Field label="Nama Lengkap" htmlFor="user-fullname" error={errors.fullname}>
                    <input
                        id="user-fullname"
                        value={data.fullname}
                        onChange={(e) => setData('fullname', e.target.value)}
                        placeholder="Sesuai identitas"
                        className={controlClass(errors.fullname)}
                    />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="No. Telepon" htmlFor="user-phone" error={errors.phone_number}>
                        <input
                            id="user-phone"
                            value={data.phone_number}
                            onChange={(e) => setData('phone_number', e.target.value)}
                            placeholder="08xxxxxxxxxx"
                            className={controlClass(errors.phone_number)}
                        />
                    </Field>

                    <Field label="Tanggal Lahir" htmlFor="user-birth" error={errors.birth_date}>
                        <input
                            id="user-birth"
                            type="date"
                            value={data.birth_date}
                            onChange={(e) => setData('birth_date', e.target.value)}
                            className={controlClass(errors.birth_date)}
                        />
                    </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Jenis Kelamin" htmlFor="user-gender" error={errors.gender}>
                        <select
                            id="user-gender"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                            className={controlClass(errors.gender)}
                        >
                            <option value="">Pilih</option>
                            <option value="male">Laki-laki</option>
                            <option value="female">Perempuan</option>
                        </select>
                    </Field>

                    <Field label="Asal Kota" htmlFor="user-city" error={errors.city_id}>
                        <select
                            id="user-city"
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
            </div>

            <Button type="submit" disabled={processing} className="w-full">
                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan Pengguna
            </Button>
        </form>
    );
}
