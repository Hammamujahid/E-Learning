import { api } from '@/lib/api';
import { City } from '@/types/interfaces';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CreateUser({ onSuccess }: { onSuccess?: () => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('user');
    const [cityId, setCityId] = useState('');
    const [fullname, setFullname] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('male');
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchCities = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/cities');

            setCities(response.data.data);
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message ?? 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post('/api/user', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                role,
                city_id: cityId || null,
                fullname,
                birth_date: birthDate,
                phone_number: phoneNumber,
                gender,
                is_deleted: false,
            });

            toast.success('User berhasil ditambahkan');

            onSuccess?.();
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
        }
    };

    return (
        <form className="space-y-4 text-primary" onSubmit={handleSubmit}>
            {/* Nama */}
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama"
                className={`w-full rounded border p-2 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="mt-0.5 text-sm text-red-500">{errors.name}</p>}

            {/* Email */}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={`w-full rounded border p-2 ${errors.email ? 'border-red-500' : ''}`} />
            {errors.email && <p className="mt-0.5 text-sm text-red-500">{errors.email}</p>}

            {/* Password */}
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full rounded border p-2 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="mt-0.5 text-sm text-red-500">{errors.password}</p>}

            {/* Confirm Password */}
            <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Konfirmasi Password"
                className="w-full rounded border p-2"
            />

            {/* Role */}
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded border p-2">
                <option value="user">User</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
            </select>

            {/* Fullname */}
            <input value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Nama Lengkap" className="w-full rounded border p-2" />

            {/* Phone */}
            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="No HP" className="w-full rounded border p-2" />

            {/* Birth Date */}
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full rounded border p-2" />

            {/* Gender */}
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded border p-2">
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
            </select>

            {/* City ID */}
            <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="w-full rounded border p-2" disabled={loading}>
                <option value="">{loading ? 'Memuat kota...' : 'Pilih Kota (Opsional)'}</option>

                {!loading &&
                    cities.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name}
                        </option>
                    ))}
            </select>

            {/* Submit */}
            <button type="submit" className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600">
                Simpan
            </button>
        </form>
    );
}
