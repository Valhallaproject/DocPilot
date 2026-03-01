import "./globals.css";

export const metadata = {
  title: "DocPilot",
  description: "Génération automatique de documents pour freelances",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col bg-gray-50">
        
        {/* HEADER GLOBAL */}
        <header className="w-full bg-white border-b shadow-sm h-16 flex items-center px-6">
          <h1 className="text-xl font-semibold">DocPilot</h1>
        </header>

        {/* CONTENU */}
        <main className="flex-1">{children}</main>

        {/* FOOTER GLOBAL */}
        <footer className="w-full bg-white border-t h-14 flex items-center justify-center text-sm text-gray-500">
          © {new Date().getFullYear()} DocPilot — Tous droits réservés
        </footer>

      </body>
    </html>
  );
}


