"use client";

import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isAuthPage = ["/login", "/register"].includes(pathname);
  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
    </>
  );
};

export default Provider;
