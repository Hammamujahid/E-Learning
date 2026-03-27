import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React from 'react'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Overview',
        href: '/overview',
    }
];

export default function home() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title='Overview'/>
        <div>Teacher Overview</div>
    </AppLayout>
  )
}

