import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { FilePlus, Clock, BarChart3, FileText, Receipt, FileSignature } from "lucide-react";
import StatsChart from "./components/StatsChart";
import YearSelector from "./components/YearSelector";
import { JSX } from "react";

// Badges colorés + icônes
function getBadge(type: string) {
  const config: Record<
    string,
    { icon: JSX.Element; classes: string; label: string }
  > = {
    devis: {
      icon: <FileText size={14} />,
      classes: "bg-blue-100 text-blue-700",
      label: "Devis",
    },
    facture: {
      icon: <Receipt size={14} />,
      classes: "bg-green-100 text-green-700",
      label: "Facture",
    },
    contrat: {
      icon: <FileSignature size={14} />,
      classes: "bg-purple-100 text-purple-700",
      label: "Contrat",
    },
  };

  const item = config[type] || {
    icon: <FileText size={14} />,
    classes: "bg-gray-100 text-gray-600",
    label: type,
  };

  return (
    <span
      className={`flex items-center gap-1 px-2 py-0.5 text-lg font-medium rounded-full ${item.classes}`}
    >
      {item.icon}
      {item.label}
    </span>
  );
}

export default async function DashboardHome({
  searchParams,
}: {
  searchParams: { year?: string };
}) {
  const { userId } = await auth();
  if (!userId) return <div>Non connecté</div>;

  // Récupération des documents
  const documents = await prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  const lastDocuments = [...documents].reverse().slice(0, 3);
  const totalDocuments = documents.length;

  // Années disponibles
  const years = Array.from(
    new Set(documents.map((doc) => doc.createdAt.getFullYear()))
  ).sort();

  const selectedYear =
    Number(searchParams?.year) || new Date().getFullYear();

  // Filtrer par année
  const filteredDocs = documents.filter(
    (doc) => doc.createdAt.getFullYear() === selectedYear
  );

  // Regroupement dynamique par mois/année
  const monthlyMap = new Map<string, number>();

  filteredDocs.forEach((doc) => {
    const date = doc.createdAt;
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
  });

  const monthsFR = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  const monthlyStats = Array.from(monthlyMap.entries()).map(
    ([key, count]) => {
      const [year, month] = key.split("-");
      const monthIndex = parseInt(month) - 1;

      return {
        label: `${monthsFR[monthIndex]} ${year}`,
        value: count,
      };
    }
  );

  const chartData = monthlyStats;

  // Stats par type
  const typeStats = {
    devis: 0,
    facture: 0,
    contrat: 0,
  };

  filteredDocs.forEach((doc) => {
    if (doc.template === "devis") typeStats.devis++;
    if (doc.template === "facture") typeStats.facture++;
    if (doc.template === "contrat") typeStats.contrat++;
  });

  return (
    <div className="space-y-8">

      {/* LIGNE 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-20">

        {/* CRÉER UN DOCUMENT */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
              <FilePlus size={22} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Créer un document
            </h3>
          </div>

          <p className="text-gray-600 text-lg mt-3">
            Générez un document en quelques clics en utilisant nos modèles professionnels.
          </p>

          <a
            href="/dashboard/create"
            className="mt-6  bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium px-4 py-2 rounded-lg transition flex items-center justify-center"
          >
            Nouveau document
          </a>
        </div>

        {/* DERNIERS DOCUMENTS */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
              <Clock size={22} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Derniers documents
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            {lastDocuments.length === 0 && (
              <p className="text-gray-500 text-lg">
                Aucun document pour le moment.
              </p>
            )}

            {lastDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex justify-between items-center text-lg"
              >
                <div className="flex items-center gap-2">
                  {getBadge(doc.template)}
                  <span className="text-gray-700">{doc.template}</span>
                </div>

                <span className="text-gray-500">
                  {doc.createdAt.toLocaleDateString("fr-FR")}
                </span>
              </div>
            ))}
          </div>

          <a
            href="/dashboard/documents"
            className="block text-blue-600 text-lg font-medium mt-4 hover:underline"
          >
            Voir tous
          </a>
        </div>
        {/* DOCUMENTS PAR TYPE (1/4) */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Documents par type
          </h3>

          <div className="space-y-3 text-lg">
            <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                {getBadge("devis")}
            </div>
            <span className="font-medium">{typeStats.devis}</span>
            </div>

            <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                {getBadge("facture")}
            </div>
            <span className="font-medium">{typeStats.facture}</span>
            </div>

            <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                {getBadge("contrat")}
            </div>
            <span className="font-medium">{typeStats.contrat}</span>
            </div>

          </div>
        </div>
      </div>

      {/* LIGNE 2 : STATISTIQUES + DOCUMENTS PAR TYPE */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-20">

        {/* GRAPHIQUE (3/4) */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
              <BarChart3 size={22} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Statistiques</h3>
          </div>

          {/* Filtre année */}
          <div className="flex items-center gap-3 mb-4">
            <label className="text-lg text-gray-600">Année :</label>
            <YearSelector years={years} selectedYear={selectedYear} />
          </div>

          {/* Graphique */}
          <StatsChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
