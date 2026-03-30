import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronDown, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="group relative flex aspect-video flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 bg-foreground p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-sidebar-border">
                        <div className="flex flex-col gap-2">
                            <div className="flex w-full items-center justify-between">
                                <h1 className="text-sm font-medium tracking-wide text-muted-foreground">USERS</h1>

                                <div className="rounded-lg border border-white/10 bg-chart-3/20 p-2 shadow-sm backdrop-blur-lg transition group-hover:scale-110">
                                    <Users className="h-5 w-5 text-chart-3" />
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-secondary">1,000</h1>

                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <span className="text-base font-semibold text-green-500">+32</span>
                                <span>users baru minggu ini</span>
                            </div>
                        </div>
                        <button className="mt-4 flex items-center justify-between rounded-md bg-secondary/90 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-secondary hover:shadow-md active:scale-95">
                            <span>View Users</span>
                            <span className="ml-2 transition group-hover:translate-x-1">→</span>
                        </button>
                        <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-chart-3/20 blur-2xl"></div>
                    </div>
                    <div className="group relative flex aspect-video flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 bg-foreground p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-sidebar-border">
                        <div className="flex flex-col gap-2">
                            <div className="flex w-full items-center justify-between">
                                <h1 className="text-sm font-medium tracking-wide text-muted-foreground">MATERIALS</h1>

                                <div className="rounded-lg border border-white/10 bg-chart-5/20 p-2 shadow-sm backdrop-blur-lg transition group-hover:scale-110">
                                    <Users className="h-5 w-5 text-chart-5" />
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-secondary">1,000</h1>

                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <span className="text-base font-semibold text-green-500">+32</span>
                                <span>materials baru minggu ini</span>
                            </div>
                        </div>
                        <button className="mt-4 flex items-center justify-between rounded-md bg-secondary/90 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-secondary hover:shadow-md active:scale-95">
                            <span>View Materials</span>
                            <span className="ml-2 transition group-hover:translate-x-1">→</span>
                        </button>
                        <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-chart-5/20 blur-2xl"></div>
                    </div>
                    <div className="group relative flex aspect-video flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 bg-foreground p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-sidebar-border">
                        <div className="flex flex-col gap-2">
                            <div className="flex w-full items-center justify-between">
                                <h1 className="text-sm font-medium tracking-wide text-muted-foreground">QUESTIONS</h1>

                                <div className="rounded-lg border border-white/10 bg-chart-1/20 p-2 shadow-sm backdrop-blur-lg transition group-hover:scale-110">
                                    <Users className="h-5 w-5 text-chart-1" />
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-secondary">1,000</h1>

                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <span className="text-base font-semibold text-green-500">+32</span>
                                <span>questions baru minggu ini</span>
                            </div>
                        </div>
                        <button className="mt-4 flex items-center justify-between rounded-md bg-secondary/90 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-secondary hover:shadow-md active:scale-95">
                            <span>View Questions</span>
                            <span className="ml-2 transition group-hover:translate-x-1">→</span>
                        </button>
                        <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-chart-1/20 blur-2xl"></div>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 flex-col items-center justify-start overflow-hidden rounded-xl border border-sidebar-border/70 p-6 md:min-h-min dark:border-sidebar-border">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-secondary">Recent Activity</h1>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 rounded-md border bg-muted-foreground/20 px-3 py-1.5 text-sm font-semibold text-secondary transition hover:bg-muted">
                                Filter by Type
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div>
                        
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
