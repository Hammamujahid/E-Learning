import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pen, RotateCcw, Trash2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';

export function StatusBadge({ isDeleted }: { isDeleted: boolean }) {
    return (
        <div className="flex justify-center">
            <Badge
                variant="outline"
                className={
                    isDeleted ? 'border-destructive/20 bg-destructive-soft text-destructive' : 'border-success/20 bg-success-soft text-success'
                }
            >
                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${isDeleted ? 'bg-destructive' : 'bg-success'}`} />
                {isDeleted ? 'Non-aktif' : 'Aktif'}
            </Badge>
        </div>
    );
}

export function RoleBadge({ role }: { role: 'admin' | 'teacher' | 'user' }) {
    const label = role === 'admin' ? 'Admin' : role === 'teacher' ? 'Guru' : 'Siswa';

    const tone =
        role === 'admin'
            ? 'border-destructive/20 bg-destructive-soft text-destructive'
            : role === 'teacher'
              ? 'border-info/20 bg-info-soft text-info'
              : 'border-border bg-muted text-muted-foreground';

    return (
        <div className="flex justify-center">
            <Badge variant="outline" className={tone}>
                {label}
            </Badge>
        </div>
    );
}

/** Score pill shared by the history list and quiz results. */
export function ScoreBadge({ score }: { score: number }) {
    const tone =
        score >= 80
            ? 'border-success/20 bg-success-soft text-success'
            : score >= 60
              ? 'border-warning/20 bg-warning-soft text-warning'
              : 'border-destructive/20 bg-destructive-soft text-destructive';

    return (
        <Badge variant="outline" className={`font-semibold tabular-nums ${tone}`}>
            {score}
        </Badge>
    );
}

export function DateCell({ value }: { value: string | null }) {
    if (!value) return <div className="text-center text-muted-foreground">—</div>;

    const date = new Date(value);

    return (
        <div className="text-center text-sm">
            <span className="text-foreground">{date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            <span className="ml-1.5 text-muted-foreground">{date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    );
}

const ACTION_BUTTON =
    'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-50';

interface RowActionsProps {
    /** Dialog body for editing; receives a close callback. */
    editDialog?: { title: string; render: (close: () => void) => ReactNode };
    isDeleted: boolean;
    onDeactivate?: () => void;
    onActivate?: () => void;
    onDelete?: () => void;
    canEdit?: boolean;
    canDelete?: boolean;
    extra?: ReactNode;
}

/**
 * Shared action column: edit dialog plus deactivate / activate / delete.
 * Dialog open state is local to each row, so opening one row's editor no
 * longer opens every row's editor at once.
 */
export function RowActions({ editDialog, isDeleted, onDeactivate, onActivate, onDelete, canEdit = true, canDelete = true, extra }: RowActionsProps) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <div className="flex items-center justify-center gap-1.5">
            {extra}

            {editDialog && canEdit && (
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className={`${ACTION_BUTTON} border-border bg-background text-muted-foreground hover:border-warning/30 hover:bg-warning-soft hover:text-warning`}
                            title={editDialog.title}
                        >
                            <Pen size={14} />
                        </button>
                    </DialogTrigger>

                    <DialogContent className="flex max-h-[85vh] flex-col">
                        <DialogHeader>
                            <DialogTitle>{editDialog.title}</DialogTitle>
                        </DialogHeader>

                        <div className="-mx-1 flex-1 overflow-y-auto px-1">{editDialog.render(() => setEditOpen(false))}</div>
                    </DialogContent>
                </Dialog>
            )}

            {!isDeleted
                ? canDelete &&
                  onDeactivate && (
                      <button
                          onClick={(e) => {
                              e.stopPropagation();
                              onDeactivate();
                          }}
                          className={`${ACTION_BUTTON} border-border bg-background text-muted-foreground hover:border-destructive/30 hover:bg-destructive-soft hover:text-destructive`}
                          title="Nonaktifkan"
                      >
                          <Trash2 size={14} />
                      </button>
                  )
                : canDelete && (
                      <>
                          {onActivate && (
                              <button
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      onActivate();
                                  }}
                                  className={`${ACTION_BUTTON} border-border bg-background text-muted-foreground hover:border-success/30 hover:bg-success-soft hover:text-success`}
                                  title="Aktifkan"
                              >
                                  <RotateCcw size={14} />
                              </button>
                          )}
                          {onDelete && (
                              <button
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      onDelete();
                                  }}
                                  className={`${ACTION_BUTTON} border-destructive/20 bg-destructive-soft text-destructive hover:bg-destructive hover:text-destructive-foreground`}
                                  title="Hapus permanen"
                              >
                                  <Trash2 size={14} />
                              </button>
                          )}
                      </>
                  )}
        </div>
    );
}
