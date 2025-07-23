import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="relative flex min-h-screen flex-col items-center bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                <FlickeringGrid
                    squareSize={4}
                    gridGap={6}
                    color="#60A5FA"
                    maxOpacity={0.5}
                    flickerChance={0.1}
                    className="absolute inset-0 z-0 size-full [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
                />
                <header
                    className={`z-10 mb-6 flex h-24 w-full items-center justify-end px-6 text-sm transition-colors duration-300 not-has-[nav]:hidden ${scrolled ? 'bg-opacity-90 bg-[#0a0a0a] shadow' : 'bg-transparent'} `}
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
                        <nav className="flex items-center justify-between w-full px-4">
                            <div className="flex items-center gap-2">
                                <img src="/assets/logo.png" alt="Logo" width={80} height={80} />
                                <h1 className="text-[#1b1b18] dark:text-[#EDEDEC]">E-Learning</h1>
                            </div>
                            <div className='flex items-center gap-4'>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </div>
                        </nav>
                    )}
                </header>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
