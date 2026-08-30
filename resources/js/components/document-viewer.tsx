import { FileText } from 'lucide-react';
import type { ReactNode } from 'react';

export function MetaBadge({ icon, label }: { icon: ReactNode; label: string }) {
    return (
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground">
            {icon}
            <span className="font-medium text-foreground">{label}</span>
        </div>
    );
}

const OFFICE_EXTENSIONS = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

const EXT_TONE: Record<string, string> = {
    PDF: 'bg-destructive-soft text-destructive',
    DOC: 'bg-info-soft text-info',
    DOCX: 'bg-info-soft text-info',
    PPT: 'bg-warning-soft text-warning',
    PPTX: 'bg-warning-soft text-warning',
    XLS: 'bg-success-soft text-success',
    XLSX: 'bg-success-soft text-success',
};

/** Coloured chip for a file extension, shared by material screens. */
export function FileTypeBadge({ filePath }: { filePath: string }) {
    const name = filePath.split('/').pop() ?? filePath;
    const ext = name.split('?')[0]?.split('.').pop()?.toUpperCase() ?? 'FILE';

    return <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${EXT_TONE[ext] ?? 'bg-muted text-muted-foreground'}`}>{ext}</span>;
}

/**
 * Renders an uploaded material inline: PDFs natively, Office documents through
 * the Google viewer, images directly, and anything else as a download link.
 */
export function DocumentViewer({ filePath }: { filePath: string }) {
    // Cloudinary serves documents from the raw delivery type.
    const fileUrl = filePath.replace('/image/upload/', '/raw/upload/');
    const extension = fileUrl.split('?')[0]?.split('.').pop()?.toLowerCase() ?? '';

    const frameClass = 'h-[600px] w-full rounded-lg border border-border bg-muted/30';

    if (extension === 'pdf') {
        return <iframe src={fileUrl} className={frameClass} title="Pratinjau materi" />;
    }

    if (OFFICE_EXTENSIONS.includes(extension)) {
        return (
            <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                className={frameClass}
                title="Pratinjau materi"
            />
        );
    }

    if (IMAGE_EXTENSIONS.includes(extension)) {
        return <img src={fileUrl} alt="Materi" className="w-full rounded-lg border border-border object-contain" />;
    }

    return (
        <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground">
            <FileText className="h-8 w-8 opacity-40" />
            <p className="text-sm">Format ini tidak bisa dipratinjau</p>
            <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
                Unduh File
            </a>
        </div>
    );
}

/** Placeholder shown when a material has no attachment. */
export function NoFilePlaceholder({ message = 'Belum ada file yang diunggah untuk materi ini.' }: { message?: string }) {
    return (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 text-muted-foreground">
            <FileText className="h-7 w-7 opacity-40" />
            <p className="text-sm">{message}</p>
        </div>
    );
}
