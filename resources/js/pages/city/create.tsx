import { Field, controlClass } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function CreateCity({ onSuccess }: { onSuccess?: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('admin.city.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        });
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <Field label="Nama Kota" htmlFor="city-name" error={errors.name} required>
                <input
                    id="city-name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Contoh: Surabaya"
                    className={controlClass(errors.name)}
                    autoFocus
                />
            </Field>

            <Button type="submit" disabled={processing} className="w-full">
                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
            </Button>
        </form>
    );
}
