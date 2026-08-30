import { useCallback } from 'react';

export function useInitials() {
    return useCallback((fullName: string): string => {
        const names = fullName.trim().split(' ').filter(Boolean);

        const first = names.at(0);
        const last = names.at(-1);

        if (!first) return '';
        if (names.length === 1) return first.charAt(0).toUpperCase();

        return `${first.charAt(0)}${last?.charAt(0) ?? ''}`.toUpperCase();
    }, []);
}
