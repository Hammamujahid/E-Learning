import { Field, controlClass } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function CreateSubject({ onSuccess }: { onSuccess?: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', description: '' });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('admin.subject.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        });
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <Field label="Nama Mata Pelajaran" htmlFor="subject-name" error={errors.name} required>
                <input
                    id="subject-name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Contoh: Matematika"
                    className={controlClass(errors.name)}
                    autoFocus
                />
            </Field>

            <Field label="Deskripsi" htmlFor="subject-description" error={errors.description} hint="Opsional, membantu siswa mengenali mapel.">
                <textarea
                    id="subject-description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Ringkasan singkat mata pelajaran"
                    rows={3}
                    className={controlClass(errors.description, 'resize-y')}
                />
            </Field>

            <Button type="submit" disabled={processing} className="w-full">
                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan
            </Button>
        </form>
    );
}
