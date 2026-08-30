import AppLogo from '@/components/app-logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpen, CheckCircle2, FileText, Github, Instagram, Layers, Linkedin, Sparkles, Target, TrendingUp, Users } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface WelcomeProps {
    stats: {
        subject_count: number;
        material_count: number;
        question_count: number;
    };
    subjects: Array<{ id: number; name: string; description: string | null }>;
}

function useScrollReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, visible };
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
    const { ref, visible } = useScrollReveal();

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

const FEATURES = [
    {
        icon: FileText,
        title: 'Materi Terstruktur',
        body: 'Setiap materi dikelompokkan per mata pelajaran dan bisa dibaca langsung di browser tanpa perlu mengunduh.',
    },
    {
        icon: Target,
        title: 'Quiz dengan Pembahasan',
        body: 'Kerjakan quiz kapan saja, lihat skor seketika, lalu pelajari kunci jawaban untuk setiap soal yang salah.',
    },
    {
        icon: TrendingUp,
        title: 'Progres Terekam',
        body: 'Seluruh riwayat pengerjaan dan rata-rata skor tersimpan, jadi kamu tahu bagian mana yang perlu diperkuat.',
    },
];

const AUDIENCE = [
    { icon: Users, role: 'Siswa', body: 'Akses materi, kerjakan quiz, dan pantau perkembangan belajarmu.' },
    { icon: BookOpen, role: 'Guru', body: 'Susun materi dan bank soal, lalu lihat hasil pengerjaan siswa.' },
    { icon: Layers, role: 'Admin', body: 'Kelola pengguna, mata pelajaran, dan seluruh konten platform.' },
];

export default function Welcome({ stats, subjects }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-background">
            <Head title="Belajar terarah, terukur, dan fleksibel" />

            {/* ── NAVBAR ──────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
                <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href={route('home')} className="flex items-center gap-2.5" aria-label="E-Learning">
                        <AppLogo />
                    </Link>

                    {auth.user ? (
                        <Button asChild size="sm">
                            <Link href={route('dashboard')}>
                                Buka Dasbor
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={route('login')}>Masuk</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href={route('register')}>Daftar Gratis</Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </header>

            <main>
                {/* ── HERO ────────────────────────────────────────── */}
                <section className="relative overflow-hidden">
                    <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.4]" aria-hidden="true" />
                    <div
                        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
                        aria-hidden="true"
                    />

                    <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
                        <div className="animate-rise mx-auto max-w-3xl text-center">
                            <Badge variant="outline" className="mb-6 border-primary/20 bg-primary-soft text-primary">
                                <Sparkles className="mr-1.5 h-3 w-3" />
                                Platform belajar mandiri
                            </Badge>

                            <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                                Belajar lebih terarah, <span className="text-primary">terukur</span>, dan fleksibel
                            </h1>

                            <p className="mx-auto mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
                                Akses materi pembelajaran yang tersusun rapi, lalu uji pemahamanmu lewat quiz yang bisa dikerjakan kapan saja —
                                lengkap dengan pembahasan.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <Button size="lg" asChild>
                                    <Link href={auth.user ? route('dashboard') : route('register')}>
                                        {auth.user ? 'Lanjutkan Belajar' : 'Mulai Belajar'}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>

                                {!auth.user && (
                                    <Button size="lg" variant="outline" asChild>
                                        <Link href={route('login')}>Sudah punya akun</Link>
                                    </Button>
                                )}
                            </div>

                            {/* Statistik */}
                            <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4 rounded-2xl border border-border bg-card p-6 shadow-card">
                                {[
                                    { value: stats.material_count, label: 'Materi' },
                                    { value: stats.subject_count, label: 'Mata Pelajaran' },
                                    { value: stats.question_count, label: 'Soal Quiz' },
                                ].map((item, i) => (
                                    <div key={item.label} className={i > 0 ? 'border-l border-border' : ''}>
                                        <dd className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{item.value}</dd>
                                        <dt className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{item.label}</dt>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </section>

                {/* ── FITUR ───────────────────────────────────────── */}
                <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <Reveal className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Semua yang kamu butuhkan untuk belajar</h2>
                        <p className="mt-3 text-muted-foreground">Dari membaca materi sampai mengukur hasil, semuanya dalam satu alur.</p>
                    </Reveal>

                    <div className="mt-12 grid gap-5 md:grid-cols-3">
                        {FEATURES.map((feature, i) => (
                            <Reveal key={feature.title} delay={i * 100}>
                                <div className="group h-full rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card-hover">
                                    <div className="mb-4 inline-flex rounded-lg bg-primary-soft p-2.5 text-primary transition-transform group-hover:scale-105">
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ── MATA PELAJARAN ──────────────────────────────── */}
                {subjects.length > 0 && (
                    <section className="border-y border-border bg-muted/30">
                        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                            <Reveal className="flex flex-wrap items-end justify-between gap-4">
                                <div className="max-w-xl">
                                    <h2 className="text-3xl font-semibold tracking-tight text-foreground">Mata pelajaran tersedia</h2>
                                    <p className="mt-3 text-muted-foreground">Pilih bidang yang ingin kamu kuasai lebih dulu.</p>
                                </div>

                                {!auth.user && (
                                    <Button variant="outline" asChild>
                                        <Link href={route('register')}>
                                            Daftar untuk akses
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                )}
                            </Reveal>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {subjects.map((subject, i) => (
                                    <Reveal key={subject.id} delay={Math.min(i, 5) * 70}>
                                        <div className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-card-hover">
                                            <div className="inline-flex w-fit rounded-lg bg-accent p-2 text-accent-foreground">
                                                <BookOpen className="h-4 w-4" />
                                            </div>
                                            <h3 className="font-semibold text-foreground">{subject.name}</h3>
                                            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                                {subject.description || 'Belum ada deskripsi untuk mata pelajaran ini.'}
                                            </p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── PERAN ───────────────────────────────────────── */}
                <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <Reveal className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Satu platform, tiga peran</h2>
                        <p className="mt-3 text-muted-foreground">Setiap peran punya ruang kerjanya sendiri dengan hak akses yang jelas.</p>
                    </Reveal>

                    <div className="mt-12 grid gap-5 md:grid-cols-3">
                        {AUDIENCE.map((item, i) => (
                            <Reveal key={item.role} delay={i * 100}>
                                <div className="flex h-full flex-col items-start gap-3 rounded-xl border border-border bg-card p-6 shadow-card">
                                    <div className="rounded-lg bg-accent p-2.5 text-accent-foreground">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-foreground">{item.role}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ── CTA PENUTUP ─────────────────────────────────── */}
                {!auth.user && (
                    <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                        <Reveal>
                            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center shadow-card sm:p-12">
                                <div
                                    className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
                                    aria-hidden="true"
                                />

                                <div className="relative mx-auto max-w-xl">
                                    <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Siap mulai belajar?</h2>
                                    <p className="mt-3 text-muted-foreground">Buat akun gratis dan langsung akses seluruh materi beserta quiznya.</p>

                                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                                        <Button size="lg" asChild>
                                            <Link href={route('register')}>
                                                Daftar Sekarang
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" asChild>
                                            <Link href={route('login')}>Masuk</Link>
                                        </Button>
                                    </div>

                                    <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                                        {['Gratis', 'Tanpa batas waktu', 'Pembahasan lengkap'].map((item) => (
                                            <li key={item} className="flex items-center gap-1.5">
                                                <CheckCircle2 className="h-4 w-4 text-success" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Reveal>
                    </section>
                )}
            </main>

            {/* ── FOOTER ──────────────────────────────────────────── */}
            <footer className="border-t border-border bg-muted/30">
                <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2.5">
                        <AppLogo />
                    </div>

                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} E-Learning</p>

                    <div className="flex items-center gap-1">
                        {[
                            { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/hammamujahid' },
                            { icon: Github, label: 'GitHub', href: 'https://github.com/hammamujahid' },
                            { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/hammamujahid' },
                        ].map(({ icon: Icon, label, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
