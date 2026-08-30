import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Palette, ShieldCheck, UserCog } from 'lucide-react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    { title: 'Profil', href: '/settings/profile', icon: UserCog },
    { title: 'Password', href: '/settings/password', icon: ShieldCheck },
    { title: 'Tampilan', href: '/settings/appearance', icon: Palette },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const currentPath = usePage().url.split('?')[0];

    return (
        <div className="mx-auto w-full max-w-5xl">
            <Heading title="Pengaturan" description="Kelola profil, keamanan, dan preferensi tampilan akunmu." />

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <aside className="w-full lg:w-56 lg:flex-shrink-0">
                    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
                        {sidebarNavItems.map((item) => {
                            const isActive = currentPath === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    prefetch
                                    className={cn(
                                        'flex flex-shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        isActive ? 'bg-primary-soft text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                    )}
                                >
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="lg:hidden" />

                <div className="min-w-0 flex-1">
                    <section className="max-w-xl space-y-10">{children}</section>
                </div>
            </div>
        </div>
    );
}
