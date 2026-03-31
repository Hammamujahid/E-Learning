import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import React from 'react'

export default function User() {
  return (
    <AppLayout>
        <Head title="User - Admin Dashboard" />
        <div className='text-primary'>User</div>
    </AppLayout>
  )
}
