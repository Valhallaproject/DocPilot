"use client";

import { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { Home, FilePlus, FileText, Settings, Users } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isActive =
      href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(href);

    return `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
      isActive
        ? "bg-white/20 text-white font-medium"
        : "text-white/80 hover:bg-white/10"
    }`;
  };

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Accueil";
    if (pathname === "/dashboard/create") return "Créer un document";
    if (pathname === "/dashboard/documents") return "Mes documents";
    if (pathname === "/dashboard/clients") return "Clients";
    if (pathname === "/dashboard/settings") return "Paramètres";
    return "Dashboard";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-[#1E3A8A] text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10 bg-white/10">
          <img src="/templates/logo.png" alt="Logo DocPilot" className="-ml-10 mt-5 w-100" />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <a href="/dashboard" className={linkClass("/dashboard")}>
            <Home size={18} /> Accueil
          </a>
          <a href="/dashboard/create" className={linkClass("/dashboard/create")}>
            <FilePlus size={18} /> Créer un document
          </a>
          <a href="/dashboard/documents" className={linkClass("/dashboard/documents")}>
            <FileText size={18} /> Mes documents
          </a>
          <a href="/dashboard/clients" className={linkClass("/dashboard/clients")}>
            <Users size={18} /> Clients
          </a>
          <a href="/dashboard/settings" className={linkClass("/dashboard/settings")}>
            <Settings size={18} /> Paramètres
          </a>
        </nav>

        <div className="px-6 py-4 border-t border-white/10 text-sm text-white/70">
          DenTi
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            {getPageTitle()}
          </h2>
          <UserButton />
        </header>

        <main className="flex-1 p-10 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
