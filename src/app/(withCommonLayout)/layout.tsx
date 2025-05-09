'use client';

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import useSessionUpdateListener from "@/hooks/useSessionUpdateListener";


const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  useSessionUpdateListener();
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default CommonLayout;