import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

const OPTIONS = [
    { value: 'light', label: 'Terang', icon: Sun },
    { value: 'dark', label: 'Gelap', icon: Moon },
    { value: 'system', label: 'Sistem', icon: Monitor },
] as const;

export function AppearanceToggle({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const CurrentIcon = OPTIONS.find((option) => option.value === appearance)?.icon ?? Monitor;

    return (
        <div className={className} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                        <CurrentIcon className="h-4 w-4" />
                        <span className="sr-only">Ganti tema</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                    {OPTIONS.map(({ value, label, icon: Icon }) => (
                        <DropdownMenuItem key={value} onClick={() => updateAppearance(value)} className="gap-2">
                            <Icon className="h-4 w-4" />
                            <span className="flex-1">{label}</span>
                            {appearance === value && <Check className="h-3.5 w-3.5 text-primary" />}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default AppearanceToggle;
