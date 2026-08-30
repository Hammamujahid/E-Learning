import { Field, controlClass } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface EditSubjectProps {
    /** Seeded from the table row, so no extra request is needed. */
    subject: { id: number; name: string; description: string | null };
    onSuccess?: () => void;
}

export default function EditSubject({ subject, onSuccess }: EditSubjectProps) {
    const { data, setData, patch, processing, errors, isDirty } = useForm({
        name: subject.name,
        description: subject.description ?? '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!isDirty) return;

        patch(route('admin.subject.update', subject.id), {
            preserveScroll: true,
            onSuccess: () => onSuccess?.(),
        });
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <Field label="Nama Mata Pelajaran" htmlFor="subject-name" error={errors.name} required>
                <input
                    id="subject-name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={controlClass(errors.name)}
                    autoFocus
                />
            </Field>

            <Field label="Deskripsi" htmlFor="subject-description" error={errors.description}>
                <textarea
                    id="subject-description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                    className={controlClass(errors.description, 'resize-y')}
                />
            </Field>

            <Button type="submit" disabled={processing || !isDirty} className="w-full">
                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                Simpan Perubahan
            </Button>
        </form>
    );
}
