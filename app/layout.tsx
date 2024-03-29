"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });
import globalRouter from "@/tools/globalRouter";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  globalRouter.navigate = router;
  return (
    <html lang="en">
      <head>
        <title>Code Art Course Management</title>
        <script
          src=""
          async
          defer
        ></script>
      </head>
      <body className={`${inter.className} min-h-screen `}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 5000,
          }}
        />
        {children}
      </body>
    </html>
  );
}
