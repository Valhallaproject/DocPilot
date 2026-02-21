"use client";

import { useEffect, useState } from "react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await fetch("/api/documents");
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Chargement…</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Mes documents</h1>

      {documents.length === 0 && (
        <p className="text-gray-500">Aucun document pour le moment.</p>
      )}

      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-lg p-4 flex justify-between items-center bg-white shadow-sm"
          >
            <div>
              <p className="font-medium capitalize">{doc.template}</p>
              <p className="text-sm text-gray-500">
                Créé le {new Date(doc.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>

            <div className="flex gap-3">
              <button className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">
                Télécharger
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">
                Dupliquer
              </button>
              <button
                onClick={async () => {
                    await fetch(`/api/documents/${doc.id}`, { method: "DELETE" });
                    setDocuments((docs) => docs.filter((d) => d.id !== doc.id));
                }}
                className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                Supprimer
                </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
