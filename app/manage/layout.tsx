"use client";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/Sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "flowbite-react";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    let user = localStorage.getItem("USER");
    if (!user) {
      router.push("/login");
    }
  }, []);
  return (
    <>
      <NavBar />
      <div className="flex items-start">
        <SideBar />
        <main className="relative min-h-screen w-full overflow-y-auto bg-gray-50 lg:ml-64">
          {children}
        </main>
      </div>
      <Footer>
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <span className="block text-md text-gray-500 sm:text-center dark:text-gray-400">© 2024 CodeArt. All Rights Reserved.</span>
        </div>
      </Footer>
    </>
  );
}
