import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData, type UserRole } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, GraduationCap, History, LayoutDashboard, Library, Settings2, Users } from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    { title: 'Dasbor', href: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Pengguna', href: '/admin/user', icon: Users },
    { title: 'Materi', href: '/admin/learning-material', icon: BookOpen },
    { title: 'Data Master', href: '/admin/other', icon: Settings2 },
];

const teacherNavItems: NavItem[] = [
    { title: 'Dasbor', href: '/teacher/overview', icon: LayoutDashboard },
    { title: 'Materi Saya', href: '/teacher/learning-material', icon: BookOpen },
];

const userNavItems: NavItem[] = [
    { title: 'Dasbor', href: '/user/overview', icon: LayoutDashboard },
    { title: 'Materi', href: '/user/learning-material', icon: Library },
    { title: 'Riwayat Quiz', href: '/user/history', icon: History },
];

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
    admin: adminNavItems,
    teacher: teacherNavItems,
    user: userNavItems,
};

const HOME_BY_ROLE: Record<UserRole, string> = {
    admin: '/admin/dashboard',
    teacher: '/teacher/overview',
    user: '/user/overview',
};

const ROLE_LABEL: Record<UserRole, string> = {
    admin: 'Administrator',
    teacher: 'Guru',
    user: 'Siswa',
};

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    if (!user) return null;

    const navItems = NAV_BY_ROLE[user.role] ?? [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={HOME_BY_ROLE[user.role] ?? '/'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} label={ROLE_LABEL[user.role]} />
            </SidebarContent>

            <SidebarFooter>
                {/* Role reminder, hidden when the rail is collapsed to icons. */}
                <div className="mx-2 mb-1 flex items-center gap-2 rounded-lg bg-sidebar-accent/60 px-2.5 py-2 group-data-[collapsible=icon]:hidden">
                    <GraduationCap className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                    <p className="truncate text-xs text-sidebar-foreground/70">
                        Masuk sebagai <span className="font-medium text-sidebar-foreground">{ROLE_LABEL[user.role]}</span>
                    </p>
                </div>

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
