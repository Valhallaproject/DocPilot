"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";


export default function ClientsTable() {
 const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [currentClient, setCurrentClient] = useState<any>(null);

  const emptyForm = {
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    siret: "",
    vatNumber: "",
    notes: "",
  };

  const [form, setForm] = useState(emptyForm);

  // Labels FR
  const labels: Record<string, string> = {
    companyName: "Nom de l’entreprise",
    contactName: "Nom du contact",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    city: "Ville",
    zip: "Code postal",
    country: "Pays",
    siret: "SIRET",
    vatNumber: "Numéro de TVA",
    notes: "Notes",
  };

  // Ordre logique
  const fieldsOrder = [
    "companyName",
    "contactName",
    "email",
    "phone",
    "address",
    "city",
    "zip",
    "country",
    "siret",
    "vatNumber",
    "notes",
  ];

  // Fetch clients
  const loadClients = async () => {
    setLoading(true);
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/clients", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (!res.ok) return toast.error("Erreur lors de la création");

    toast.success("Client créé");
    setOpenCreate(false);
    setForm(emptyForm);
    loadClients();
  };

  const handleEdit = async () => {
    if (!currentClient) return toast.error("Erreur: client non trouvé");

    const res = await fetch(`/api/clients/${currentClient.id}`, {
      method: "PATCH",
      body: JSON.stringify(form),
    });

    if (!res.ok) return toast.error("Erreur lors de la modification");

    toast.success("Client mis à jour");
    setOpenEdit(false);
    setForm(emptyForm);
    loadClients();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/clients/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) return toast.error("Erreur lors de la suppression");

    toast.success("Client supprimé");
    loadClients();
  };

  const openEditModal = (client: any) => {
    setCurrentClient(client);
    setForm({
        companyName: client.companyName,
        contactName: client.contactName,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        zip: client.zip,
        country: client.country,
        siret: client.siret,
        vatNumber: client.vatNumber,
        notes: client.notes,
});

    setOpenEdit(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Mes clients</h1>
          <p className="text-gray-500 text-sm">Gérez vos clients et accélérez la création de vos documents.</p>
        </div>

        <Button onClick={() => setOpenCreate(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nouveau client
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Entreprise</th>
              <th className="p-4 text-left">Contact</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Téléphone</th>
              <th>ID</th>
              <th className="p-4 text-right">Actions</th>
              
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Chargement...
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Aucun client pour le moment.
                </td>
              </tr>
            ) : (
              clients.map((client: any) => (
                <tr key={client.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4">{client.companyName}</td>
                  <td className="p-4">{client.contactName}</td>
                  <td className="p-4">{client.email}</td>
                  <td className="p-4">{client.phone}</td>
                  <td>{client.id}</td>


                  <td className="p-4 flex items-center justify-end gap-2">

                    <Link
                        href={`/dashboard/clients/${client.id}`}
                        className="p-2 rounded-lg hover:bg-blue-100 transition text-blue-600 hover:text-blue-800"
                        >
                        Voir
                    </Link>


                    <button
                        onClick={() => openEditModal(client)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600 hover:text-gray-900"
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={() => handleDelete(client.id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition text-red-500 hover:text-red-700"
                    >
                        <Trash2 size={18} />
                    </button>

                    </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Create */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau client</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {fieldsOrder.map((key) => (
              <div
                key={key}
                className={key === "notes" ? "col-span-2 space-y-1" : "space-y-1"}
              >
                <label className="text-sm font-medium">{labels[key]}</label>
                <Input
                  placeholder={labels[key]}
                  value={(form as any)[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <Button className="mt-4 w-full" onClick={handleCreate}>
            Créer
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal Edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {fieldsOrder.map((key) => (
              <div
                key={key}
                className={key === "notes" ? "col-span-2 space-y-1" : "space-y-1"}
              >
                <label className="text-sm font-medium">{labels[key]}</label>
                <Input
                  placeholder={labels[key]}
                  value={(form as any)[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <Button className="mt-4 w-full" onClick={handleEdit}>
            Enregistrer
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

