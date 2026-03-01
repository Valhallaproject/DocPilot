export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]"> 
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6 space-y-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>

        <nav className="space-y-2">
          <a href="/dashboard" className="block text-gray-700 hover:text-black">Accueil</a>
          <a href="/dashboard/create" className="block text-gray-700 hover:text-black">Créer un document</a>
          <a href="/dashboard/documents" className="block text-gray-700 hover:text-black">Mes documents</a>
        </nav>
      </aside>

      {/* CONTENU */}
      <div className="flex-1 p-10">
        {children}
      </div>
    </div>
  );
}
