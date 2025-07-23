import React from 'react'
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AntdTable } from '@/components/antdesign/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pelajaran',
        href: '/learning-material',
    },
];

const colums = [
    {
        title: "id",
        dataIndex: "id",
    },
    {
        title: "Nama Pelajaran",
        dataIndex: "name",
    },
    {
        title: "Aksi",
        dataIndex: "action",
    }
]

export default function subject() {
  return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pelajaran" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <AntdTable columns={colums} data={}></AntdTable>
            </div>
        </AppLayout>  )
}
