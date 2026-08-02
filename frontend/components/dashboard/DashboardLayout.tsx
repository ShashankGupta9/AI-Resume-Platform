'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { ChevronRight, Home, PlusCircle } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  // Generate breadcrumb items
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const name =
      segment === 'dashboard'
        ? 'Dashboard'
        : segment === 'jobs'
        ? 'Job Requisitions'
        : segment === 'create'
        ? 'Create New Job'
        : segment === 'edit'
        ? 'Edit'
        : segment.charAt(0).toUpperCase() + segment.slice(1);
    return { name, href };
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header / Breadcrumbs Bar */}
        <header className="px-4 sm:px-6 lg:px-8 py-3.5 border-b border-slate-800 bg-slate-950/60 backdrop-blur-md flex items-center justify-between gap-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 overflow-x-auto">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 hover:text-slate-200 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-indigo-400" />
            </Link>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.href}>
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                  {isLast ? (
                    <span className="font-semibold text-slate-200 truncate">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-slate-200 transition-colors truncate">
                      {crumb.name}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Action Quick Button */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/jobs/create"
              className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Requisition</span>
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
