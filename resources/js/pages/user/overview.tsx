import AppLayout from "@/layouts/app-layout";
import { getUser } from "@/lib/auth";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { BookOpen, GraduationCap, Clock, ArrowRight } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "overview",
        href: "/overview"
    }
]

export default function Overview() {
    const [user] = useState(() => getUser());

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Overview" />
            <div className="text-black flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Greeting */}
                <div>
                    <div className="text-lg font-medium">Hai, {user?.name}! 👋</div>
                    <div className="text-4xl font-semibold">Welcome Back!</div>
                    <p className="mt-2 text-sm text-gray-500">
                        Yuk lanjutkan proses belajarmu hari ini dan capai targetmu.
                    </p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="rounded-lg bg-blue-100 p-3">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-semibold">12</div>
                            <div className="text-sm text-gray-500">Mata Pelajaran</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="rounded-lg bg-green-100 p-3">
                            <GraduationCap className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-semibold">8</div>
                            <div className="text-sm text-gray-500">Modul Selesai</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="rounded-lg bg-orange-100 p-3">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-semibold">3.5 jam</div>
                            <div className="text-sm text-gray-500">Belajar Minggu Ini</div>
                        </div>
                    </div>
                </div>

                {/* CTA ke halaman subject */}
                <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center">
                    <div>
                        <div className="text-lg font-semibold">Lanjutkan Belajar</div>
                        <p className="text-sm text-gray-500">
                            Lihat seluruh mata pelajaran yang tersedia dan lanjutkan materi yang belum selesai.
                        </p>
                    </div>
                    <Link
                        href="/user/learning-material"
                        className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        Lihat Mata Pelajaran
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
