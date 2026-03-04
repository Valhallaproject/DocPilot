const contratSchema = [
  {
    section: "Informations du freelance",
    fields: [
      { name: "freelance_name", label: "Nom", type: "text", required: true },
      { name: "freelance_company", label: "Entreprise", type: "text", required: false },
      { name: "freelance_address", label: "Adresse", type: "textarea", required: true },
      { name: "freelance_siret", label: "SIRET", type: "text", required: false },
      { name: "freelance_email", label: "Email", type: "email", required: true },
    ],
  },

  {
    section: "Informations client",
    fields: [
      { name: "client_name", label: "Nom du client", type: "text", required: true },
      { name: "client_company", label: "Entreprise du client", type: "text", required: false },
      { name: "client_address", label: "Adresse du client", type: "textarea", required: true },
      { name: "client_email", label: "Email du client", type: "email", required: true },
    ],
  },

  {
    section: "Mission",
    fields: [
      { name: "mission_title", label: "Titre de la mission", type: "text", required: true },
      { name: "mission_description", label: "Description détaillée", type: "textarea", required: true },
      { name: "start_date", label: "Date de début", type: "date", required: true },
      { name: "end_date", label: "Date de fin", type: "date", required: true },
    ],
  },

  {
    section: "Rémunération",
    fields: [
      { name: "price_ht", label: "Montant HT (€)", type: "number", required: true },
      { name: "tva_rate", label: "Taux de TVA (%)", type: "number", required: true },
      {
        name: "price_ttc",
        label: "Montant TTC (€)",
        type: "number",
        compute: (data: any) =>
          Number(data.price_ht || 0) + (Number(data.price_ht || 0) * Number(data.tva_rate || 0)) / 100,
      },
      { name: "payment_terms", label: "Modalités de paiement", type: "textarea", required: true },
    ],
  },

  {
    section: "Clauses",
    fields: [
      { name: "confidentiality_clause", label: "Clause de confidentialité", type: "textarea", required: true },
      { name: "ip_clause", label: "Clause de propriété intellectuelle", type: "textarea", required: true },
      { name: "termination_notice", label: "Délai de préavis (jours)", type: "number", required: true },
      { name: "jurisdiction_city", label: "Ville du tribunal compétent", type: "text", required: true },
    ],
  },

  {
    section: "Signature",
    fields: [
      { name: "contract_city", label: "Ville de signature", type: "text", required: true },
      { name: "contract_date", label: "Date de signature", type: "date", required: true },
    ],
  },
];

export default contratSchema;
