import { Field, controlClass } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface EditCityProps {
    /** Seeded from the table row, so no extra request is needed. */
    city: { id: number; name: string };
    onSuccess?: () => void;
}

export default function EditCity({ city, onSuccess }: EditCityProps) {
    const { data, setData, patch, processing, errors, isDirty } = useForm({ name: city.name });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!isDirty) return;

        patch(route('admin.city.update', city.id), {
            preserveScroll: true,
            onSuccess: () => onSuccess?.(),
        });
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <Field label="Nama Kota" htmlFor="city-name" error={errors.name} required>
                <input
                    id="city-name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={controlClass(errors.name)}
                    autoFocus
                />
            </Field>

            <Button type="submit" disabled={processing || !isDirty} className="w-full">
                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan Perubahan
            </Button>
        </form>
    );
}
