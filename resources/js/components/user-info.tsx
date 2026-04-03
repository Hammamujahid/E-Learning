import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { getUser } from '@/lib/auth';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user?: User | null; showEmail?: boolean }) {
    const getInitials = useInitials();
        const currentUser = user ?? getUser();

    if (!currentUser) {
        return null;
    }

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(currentUser.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentUser.name}</span>
                {showEmail && <span className="truncate text-xs text-muted-foreground">{currentUser.email}</span>}
            </div>
        </>
    );
}
