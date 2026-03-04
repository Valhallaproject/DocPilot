"use client";

import { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { Home, FilePlus, FileText, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Classes dynamiques pour les liens
  const linkClass = (href: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
      pathname === href
        ? "bg-white/20 text-white font-medium" // lien actif
        : "text-white/80 hover:bg-white/10"
    }`;

  // Titre dynamique
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Accueil";
    if (pathname === "/dashboard/create") return "Créer un document";
    if (pathname === "/dashboard/documents") return "Mes documents";
    if (pathname === "/dashboard/settings") return "Paramètres";
    return "Dashboard";
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1E3A8A] text-white flex flex-col">

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 bg-white/10">
          
          <img src="/templates/logo.png" alt="Logo DocPilot" className="-ml-10 mt-5 w-100" />
        </div>

        {/* Navigation */}
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

          <a href="/dashboard/settings" className={linkClass("/dashboard/settings")}>
            <Settings size={18} /> Paramètres
          </a>

        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 text-sm text-white/70">
          DenTi
        </div>
      </aside>

      {/* ZONE DROITE */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            {getPageTitle()}
          </h2>

          <UserButton />
        </header>

        {/* CONTENU */}
        <main className="flex-1 p-10 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
