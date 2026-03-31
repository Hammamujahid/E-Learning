import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Question() {
    return (
        <AppLayout>
            <Head title="Soal" />

            <div className='text-primary'>Question</div>
        </AppLayout>
    );
}
