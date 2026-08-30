import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { toast } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

/**
 * Surfaces server-side flash messages as toasts. Controllers redirect with
 * `->with('success', ...)`, so pages no longer fire their own toasts.
 */
function FlashMessages() {
    const { flash } = usePage<SharedData>().props;
    const lastShown = useRef<string | null>(null);

    useEffect(() => {
        const message = flash?.success ?? flash?.error;

        if (!message || message === lastShown.current) return;

        lastShown.current = message;

        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return null;
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <FlashMessages />
            <Toaster position="top-center" richColors closeButton />
        </AppLayoutTemplate>
    );
}
