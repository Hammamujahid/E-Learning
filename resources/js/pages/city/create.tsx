import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateCity({ onSuccess }: { onSuccess?: () => void }) {
    const [name, setName] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post('/api/city', {
                name,
                is_deleted: false,
            });

            toast.success('Data berhasil ditambahkan');

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

            {/* Submit */}
            <button type="submit" className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600">
                Simpan
            </button>
        </form>
    );
}
