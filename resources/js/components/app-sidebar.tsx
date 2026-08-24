import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { clearAuth, getUser, redirectToLogin } from '@/lib/auth';
import { User, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, LayoutDashboard, TableOfContents, TableProperties, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Dasbor',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Pengguna',
        href: '/admin/user',
        icon: Users,
    },
    {
        title: 'Materi',
        href: '/admin/learning-material',
        icon: BookOpen,
    },
    {
        title: 'Lainnya',
        href: '/admin/other',
        icon: TableProperties,
    },
];

const teacherNavItems: NavItem[] = [
    {
        title: 'Overview',
        href: '/teacher/overview',
        icon: TableOfContents,
    },
];

const userNavItems: NavItem[] = [
    {
        title: 'Overview',
        href: '/user/overview',
        icon: TableOfContents,
    },
    {
        title: 'Mata pelajaran',
        href: '/user/learning-material',
        icon: BookOpen,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const u = getUser();

        if (!u) {
            clearAuth();
            redirectToLogin();
            return;
        }

        setUser(u);
    }, []);

    if (!user) return null;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {user.role === 'admin' && <NavMain items={adminNavItems} />}
                {user.role === 'teacher' && <NavMain items={teacherNavItems} />}
                {user.role === 'user' && <NavMain items={userNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
