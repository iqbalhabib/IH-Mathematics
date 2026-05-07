import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "IH Mathematics | O & A Level Online Tutoring",
  description:
    "Expert Cambridge O & A Level math tutoring with video courses, AI-powered photo math solver, past papers, and live progress tracking.",
  keywords: "O Level Math, A Level Math, Cambridge, online tutor, AI math solver, past papers",
  icons: { icon: "/logo-icon.png", apple: "/logo-icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} scroll-smooth`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-white text-slate-900 antialiased font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
