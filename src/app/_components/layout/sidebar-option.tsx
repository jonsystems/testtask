import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default ({ href, children }: { href: string, children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link className={`flex items-center gap-x-4 px-4 h-12 rounded-xl ${isActive ? "bg-gray-50 text-indigo-500" : ""}`} href={href}>
            {children}
        </Link>
    )
};