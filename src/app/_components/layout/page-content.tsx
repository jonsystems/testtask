"use client";
import { usePathname } from "next/navigation";
import React from "react";

export default ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const authPage = ["/sign-in", "/sign-up"].includes(pathname);

  return (
    <div className={`flex justify-start ${authPage ? "px-0" : "px-36"} w-full h-screen overflow-y-auto`}>
      <div className={`flex w-full ${authPage ? "md:w-full" : "md:w-[600px]"} md:py-10`}>
        {children}
      </div>
    </div >
  )
};