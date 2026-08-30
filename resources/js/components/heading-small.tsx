export default function HeadingSmall({ title, description }: { title: string; description?: string }) {
    return (
        <header className="space-y-0.5">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </header>
    );
}
