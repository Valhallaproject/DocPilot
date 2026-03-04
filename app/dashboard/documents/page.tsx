"use client";

import { useEffect, useState } from "react";
import { FileText, Receipt, FileSignature, Search, X, Loader2, Download, Eye, FileCog, Trash2 } from "lucide-react";

type Document = {
  id: string;
  template: string;
  createdAt: string;
  pdfPath: string | null;
  tempPdfUrl?: string;
  data: any;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);

  const [loadingPdfId, setLoadingPdfId] = useState<string | null>(null);
  const [progressId, setProgressId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 14;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => setDocuments(data));
  }, []);

  const generatePdf = async (id: string) => {
    try {
      setLoadingPdfId(id);
      setProgressId(id);

      const res = await fetch(`/api/documents/${id}/download`);
      if (!res.ok) {
        setLoadingPdfId(null);
        setProgressId(null);
        return;
      }

      const data = await res.json();

      if (data.pdfUrl) {
        setDocuments((docs) =>
          docs.map((d) =>
            d.id === id
              ? { ...d, pdfPath: "exists", tempPdfUrl: data.pdfUrl }
              : d
          )
        );

        setLoadingPdfId(null);
        setProgressId(null);

        showToast("PDF généré avec succès !");
        return data.pdfUrl;
      }
    } catch (e) {
      console.error("Erreur generatePdf:", e);
      setLoadingPdfId(null);
      setProgressId(null);
    }
  };

  const deleteDocument = async (id: string) => {
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setDocuments((docs) => docs.filter((d) => d.id !== id));
  };

  const formatType = (type: string) => {
    if (type === "devis") return "Devis";
    if (type === "facture") return "Facture";
    if (type === "contrat") return "Contrat";
    return type;
  };

  const getDocumentName = (doc: Document) => {
    const type = formatType(doc.template);
    const company = doc.data?.client_company;
    const client = doc.data?.client_name;

    if (company && client) return `${type} – ${company} (${client})`;
    if (company) return `${type} – ${company}`;
    if (client) return `${type} – ${client}`;

    return type;
  };

  const getIcon = (type: string) => {
    if (type === "devis")
      return (
        <span className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
          <FileText size={18} />
        </span>
      );

    if (type === "facture")
      return (
        <span className="w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center rounded-lg">
          <Receipt size={18} />
        </span>
      );

    if (type === "contrat")
      return (
        <span className="w-8 h-8 bg-purple-100 text-purple-600 flex items-center justify-center rounded-lg">
          <FileSignature size={18} />
        </span>
      );

    return null;
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      getDocumentName(doc).toLowerCase().includes(search.toLowerCase()) ||
      doc.template.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filterType === "all" || doc.template === filterType;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredDocs.length / ITEMS_PER_PAGE);
  const paginatedDocs = filteredDocs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Mes documents</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gérez vos devis, factures et contrats générés.
          </p>
        </div>

        <a
          href="/dashboard/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Nouveau document
        </a>
      </div>

      {/* BARRE DE RECHERCHE + FILTRE */}
      <div className="flex items-center gap-4 mb-6">

        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un document..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">Tous les types</option>
          <option value="devis">Devis</option>
          <option value="facture">Facture</option>
          <option value="contrat">Contrat</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-lg">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="p-4 text-left">Nom</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Créé le</th>
              <th className="p-4 text-left">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {paginatedDocs.map((doc) => {
              const hasPdf = !!doc.pdfPath;

              return (
                <>
                  <tr key={doc.id} className="hover:bg-gray-50 transition">

                    <td className="p-4 font-medium text-gray-800">
                      {getDocumentName(doc)}
                    </td>

                    <td className="p-4 flex items-center gap-2">
                      {getIcon(doc.template)}
                      <span className="capitalize">{formatType(doc.template)}</span>
                    </td>

                    <td className="p-4 text-gray-600">
                      {new Date(doc.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>

                    <td className="p-4">
                      {loadingPdfId === doc.id ? (
                        <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-700 flex items-center gap-2 animate-pulse">
                          <Loader2 size={14} className="animate-spin" />
                          Génération…
                        </span>
                      ) : hasPdf ? (
                        <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-700">
                          PDF prêt
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
                          En attente
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right flex items-center justify-end gap-2">

                        {/* Aperçu */}
                        {hasPdf && (
                            <button
                            onClick={async () => {
                                const freshUrl = await generatePdf(doc.id);
                                if (freshUrl) setPreviewPdf(freshUrl);
                            }}
                            title="Aperçu"
                            className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600 hover:text-gray-900"
                            >
                            <Eye size={20} />
                            </button>
                        )}

                        {/* Télécharger */}
                        {hasPdf && (
                            <button
                            onClick={async () => {
                                const freshUrl = await generatePdf(doc.id);
                                if (freshUrl) window.open(freshUrl, "_blank");
                            }}
                            title="Télécharger"
                            className="p-2 rounded-lg hover:bg-gray-100 transition text-blue-600 hover:text-blue-900"
                            >
                            <Download size={20} />
                            </button>
                        )}

                        {/* Générer PDF */}
                        {!hasPdf && (
                            <button
                            onClick={() => generatePdf(doc.id)}
                            disabled={loadingPdfId === doc.id}
                            title="Générer PDF"
                            className={`p-2 rounded-lg transition flex items-center justify-center ${
                                loadingPdfId === doc.id
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-green-600 hover:bg-gray-100 hover:text-green-800"
                            }`}
                            >
                            {loadingPdfId === doc.id ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <FileCog size={20} />
                            )}
                            </button>
                        )}

                        {/* Supprimer */}
                        <button
                            onClick={() => deleteDocument(doc.id)}
                            title="Supprimer"
                            className="p-2 rounded-lg hover:bg-red-100 transition text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={20} />
                        </button>

                    </td>



                  </tr>

                  {/* BARRE DE PROGRESSION */}
                  {progressId === doc.id && (
                    <tr>
                      <td colSpan={5} className="p-0">
                        <div className="h-1 bg-blue-100">
                          <div className="h-full bg-blue-500 progress-animate"></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-3">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* APERÇU PDF */}
      {previewPdf && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-10">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[80vh] relative">
            <button
              onClick={() => setPreviewPdf(null)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full shadow-lg transition"
            >
              <X size={20} />
            </button>

            <iframe
              src={previewPdf}
              className="w-full h-full rounded-b-xl"
            />
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

    </div>
  );
}
