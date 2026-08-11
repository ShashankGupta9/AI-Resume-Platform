import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-neue-montreal',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['500', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Resume Platform - Intelligent Recruiter Suite',
  description: 'Manage job postings, upload candidate resumes (PDF & DOCX), and evaluate candidate matches with AI skill scoring.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${jakartaSans.variable} ${outfit.variable}`}>
      <body className="bg-[#0B0501] text-slate-100 min-h-screen flex flex-col selection:bg-[#FF6803] selection:text-white font-sans antialiased relative overflow-x-hidden">
        {/* Ambient Warm Radial Background Spotlights */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-radial from-[#FF6803]/12 via-[#AE3A02]/5 to-transparent blur-[120px]" />
          <div className="absolute top-[40%] -right-[15%] w-[45vw] h-[45vw] rounded-full bg-radial from-[#FF6803]/8 via-amber-900/5 to-transparent blur-[140px]" />
          <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-radial from-[#AE3A02]/10 via-transparent to-transparent blur-[160px]" />
        </div>

        <AuthProvider>
          <ToastProvider>
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
