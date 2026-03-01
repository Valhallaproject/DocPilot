"use client";

import { useEffect, useState } from "react";

type Document = {
  id: string;
  template: string;
  createdAt: string;
  pdfUrl: string | null;
  data: any;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => setDocuments(data));
  }, []);

  const generatePdf = async (id: string) => {
  try {
    const res = await fetch(`/api/documents/${id}/download`, {
      method: "GET",
    });

    if (!res.ok) {
      console.error("Erreur API:", res.status);
      return;
    }

    const data = await res.json();
    console.log("Réponse /download:", data);

    if (data.pdfUrl) {
      setDocuments((docs) =>
        docs.map((d) => (d.id === id ? { ...d, pdfUrl: data.pdfUrl } : d))
      );
    }
  } catch (e) {
    console.error("Erreur generatePdf:", e);
  }
};


  const deleteDocument = async (id: string) => {
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setDocuments((docs) => docs.filter((d) => d.id !== id));
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Mes documents</h1>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Template</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Créé le</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Statut</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{doc.template}</td>

                <td className="px-6 py-4 text-gray-600">
                  {new Date(doc.createdAt).toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {doc.pdfUrl ? (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                      PDF prêt
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-full">
                      En attente
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-right space-x-3">
                  {doc.pdfUrl ? (
                    <a
                      href={doc.pdfUrl}
                      target="_blank"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Télécharger
                    </a>
                  ) : (
                    <button
                        onClick={() => generatePdf(doc.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                        Générer PDF
                    </button>

                  )}

                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
