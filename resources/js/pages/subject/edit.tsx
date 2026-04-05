import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function EditSubject({ subjectId, onSuccess }: { subjectId: number; onSuccess?: () => void }) {
    const [name, setName] = useState('');
    const [originalName, setOriginalName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const fetchSubject = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/subjects/${subjectId}`);
            const data = response.data.data;
            setName(data.name ?? '');
            setOriginalName(data.name ?? '');
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message ?? 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    }, [subjectId]);

    useEffect(() => {
        fetchSubject();
    }, [fetchSubject]);

    const isDirty = name !== originalName;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isDirty) return;
        setSaving(true);
        setErrors({});

        try {
            await api.patch(`/api/subjects/${subjectId}`, { name });

            setOriginalName(name);
            toast.success('Data berhasil diperbarui');
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
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-24 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <form className="space-y-4 text-primary" onSubmit={handleSubmit}>
            <div>
                <input
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="Nama Mata Pelajaran"
                    className={`w-full rounded border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-border/60 ${
                        errors.name ? 'border-red-400' : 'border-border/30'
                    }`}
                />
                {errors.name && <p className="mt-0.5 text-xs text-red-500">{errors.name}</p>}
            </div>

            <button
                type="submit"
                disabled={saving || !isDirty}
                className="w-full rounded bg-blue-500 py-2 text-sm text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {saving ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menyimpan...
                    </span>
                ) : (
                    'Simpan Perubahan'
                )}
            </button>
        </form>
    );
}
