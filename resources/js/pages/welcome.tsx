import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { type SharedData } from '@/types';
import { LearningMaterial, Question, Subject } from '@/types/interfaces';
import { Link, usePage } from '@inertiajs/react';
import { Github, Instagram, Linkedin, Loader2, SquareArrowOutUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [subject, setSubject] = useState<Subject[]>([]);
    const [learningMaterial, setLearningMaterial] = useState<LearningMaterial[]>([]);
    const [question, setQuestion] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [subjectResponse, learningMaterialResponse, questionResponse] = await Promise.all([
                    fetch('/api/subjects'),
                    fetch('/api/learning-materials'),
                    fetch('/api/questions'),
                ]);
                if (!subjectResponse.ok || !learningMaterialResponse.ok || !questionResponse.ok) {
                    throw new Error('Failed to fetch data');
                }
                const subjectResult = await subjectResponse.json();
                const learningMaterialResult = await learningMaterialResponse.json();
                const questionResult = await questionResponse.json();
                setSubject(subjectResult.data);
                setLearningMaterial(learningMaterialResult.data);
                setQuestion(questionResult.data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-lg text-destructive">Error: {error}</p>
            </div>
        );
    }

    return (
        <>
            <div>
                <header
                    className={`z-10 mb-6 flex h-24 w-full items-center justify-end bg-background/50 px-6 text-sm shadow-sm backdrop-blur-sm`}
                    style={{ position: 'sticky', top: 0 }}
                >
                    {' '}
                    {auth.user ? (
                        <nav className="flex items-center justify-end gap-4">
                            <Link
                                href={route('admin/dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        </nav>
                    ) : (
                        <nav className="flex w-full items-center justify-between px-4">
                            <div className="flex items-center gap-2">
                                <img src="/assets/logo.png" alt="Logo" width={80} height={80} />
                                <h1 className="text-[#1b1b18] dark:text-[#EDEDEC]">E-Learning</h1>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route('login')}
                                    className="rounded-lg px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-black"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-secondary px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-secondary/90 hover:shadow-md active:scale-95"
                                >
                                    Register
                                </Link>
                            </div>
                        </nav>
                    )}
                </header>
                <main className="flex w-screen flex-col items-center justify-start gap-38">
                    <section className="flex w-full items-center justify-between px-14">
                        <div className="flex w-3/5 flex-col items-start justify-center gap-5">
                            <h1 className="mt-20 text-7xl font-bold text-secondary">Belajar Lebih Terarah dan Praktis</h1>
                            <p className="text-lg text-muted-foreground">
                                Akses materi pembelajaran yang terstruktur dan uji pemahamanmu dengan quiz yang bisa dikerjakan kapan saja.
                            </p>
                            <div className="flex gap-6">
                                <button className="rounded-2xl bg-secondary px-6 py-3 text-white shadow-md transition hover:opacity-90 hover:shadow-lg active:scale-95">
                                    Mulai Belajar
                                </button>
                                <button className="rounded-2xl bg-primary-foreground px-6 py-3 text-secondary shadow-md transition hover:bg-secondary/10 active:scale-95">
                                    Coba Quiz
                                </button>{' '}
                            </div>
                        </div>
                    </section>
                    <section className="flex w-full items-center justify-center px-14">
                        <div className="flex w-2/3 justify-center gap-6 rounded-2xl bg-secondary-foreground px-6 py-4 shadow-md">
                            <div className="flex w-1/3 flex-col items-center gap-1">
                                <h1 className="text-4xl font-bold text-muted">{learningMaterial?.length ?? 0}</h1>
                                <p className="font-mono text-sm text-primary-foreground">Materi Pembelajaran</p>
                            </div>
                            <div className="flex w-1/3 flex-col items-center gap-1 border-x-2 border-muted-foreground">
                                <h1 className="text-4xl font-bold text-muted">{subject?.length ?? 0}</h1>
                                <p className="font-mono text-sm text-primary-foreground">Mata Pelajaran</p>
                            </div>
                            <div className="flex w-1/3 flex-col items-center gap-1">
                                <h1 className="text-4xl font-bold text-muted">{question?.length ?? 0}</h1>
                                <p className="font-mono text-sm text-primary-foreground">Quiz Interaktif</p>
                            </div>
                        </div>
                    </section>
                    <section className="flex w-full justify-between px-14">
                        <div className="flex w-2/3 flex-col gap-2">
                            <h1 className="text-2xl font-bold text-secondary">Materi yang Mudah Dipahami </h1>
                            <p className="text-sm text-muted-foreground">
                                Setiap materi disusun secara ringkas, jelas, dan terstruktur agar kamu bisa belajar dengan lebih efektif tanpa
                                kebingungan.
                            </p>
                            <div className="mt-4">
                                <img src="/assets/section3_home.png" alt="section 3" className="w-3/4 rounded-lg shadow-md" />
                            </div>
                        </div>
                        <div className="mr-8 flex w-1/3 items-center">
                            <Carousel
                                opts={{
                                    align: 'start',
                                    loop: true,
                                }}
                                orientation="vertical"
                                className="w-full max-w-md"
                            >
                                <CarouselContent className="-mt-2 h-[420px]">
                                    {subject.map((item) => (
                                        <CarouselItem key={item.id} className="basis-1/3 pt-2">
                                            <Card className="h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                                <CardContent className="flex h-full flex-col justify-between px-5 py-4">
                                                    {/* HEADER */}
                                                    <div className="flex items-start justify-between gap-3">
                                                        <h1 className="border-muted-foregroun inline-block rounded-br-lg border-r-2 border-b-2 pr-4 pb-2 text-xl leading-tight font-bold text-secondary">
                                                            {item.name}
                                                        </h1>

                                                        <div className="rounded-md bg-secondary p-2">
                                                            <SquareArrowOutUpRight className="h-4 w-4 text-primary-foreground" />
                                                        </div>
                                                    </div>bg=

                                                    {/* DESCRIPTION */}
                                                    <div className="mt-3">
                                                        <p className="line-clamp-3 text-sm text-muted-foreground">
                                                            {item.description || 'Tidak ada deskripsi'}
                                                        </p>
                                                    </div>

                                                    {/* CTA */}
                                                    <Link
                                                        href={`/materi/${item.id}`}
                                                        className="mt-4 inline-flex items-center justify-between text-sm font-medium text-primary hover:underline"
                                                    >

                                                    </Link>
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="text-secondary" /> <CarouselNext className="text-secondary" />
                            </Carousel>
                        </div>
                    </section>
                    <section className="flex items-center justify-between bg-foreground px-14 py-28">
                        <div className="flex w-1/2 justify-center">
                            <img src="/assets/section4_home.png" alt="section 4" className="w-3/4 rounded-lg shadow-md" />
                        </div>
                        <div className="flex w-1/2 flex-col items-start justify-center gap-2">
                            <h1 className="text-3xl font-bold text-secondary">Uji Pemahamanmu Kapan Saja</h1>
                            <p className="text-md mt-2 pr-42 align-middle text-muted-foreground">
                                Kerjakan quiz kapan pun untuk mengukur sejauh mana kamu memahami materi. Tidak terikat waktu, belajar jadi lebih
                                fleksibel.
                            </p>
                        </div>
                    </section>
                </main>
                <footer className="w-full bg-secondary-foreground py-6">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        {/* LEFT */}
                        <p className="text-sm text-primary-foreground">© 2026</p>

                        {/* RIGHT */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="transition hover:text-primary-foreground">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="transition hover:text-primary-foreground">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="transition hover:text-primary-foreground">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
