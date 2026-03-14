"use client";

import React, { useState, useEffect } from "react";
import Field from "./Field";
import { Trash2 } from "lucide-react";

interface FormBuilderProps {
  schema: any[];
  template: string;
  onSubmit: (data: any) => void;
  initialValues?: Record<string, any>;
}

export default function FormBuilder({
  schema,
  template,
  onSubmit,
  initialValues = {},
}: FormBuilderProps) {
  const [formData, setFormData] = useState<any>({});

  // Injecte les valeurs initiales (ex : client sélectionné)
  // Remplace l'ancien useEffect par ceci
  useEffect(() => {
    if (!initialValues || Object.keys(initialValues).length === 0) return;

    // Initialise proprement puis applique les compute
    const initial = recomputeFields({ ...initialValues });
    setFormData(initial);
  }, [initialValues]);

  const recomputeFields = (data: any) => {
  let updated = { ...data };

    // Ensure groups and arrays exist
    schema.forEach((section: any) => {
      if (section.group) {
        if (!updated[section.group]) updated[section.group] = {};
      }
      if (section.array) {
        if (!Array.isArray(updated[section.name])) updated[section.name] = [];
      }
    });

    schema.forEach((section: any) => {
      // Champs simples
      if (!section.array && !section.group && section.fields) {
        section.fields.forEach((field: any) => {
          if (field.compute) updated[field.name] = field.compute(updated);
        });
      }

      // Groupes
      if (section.group && section.fields) {
        section.fields.forEach((field: any) => {
          if (field.compute) {
            const groupObj = updated[section.group] || {};
            groupObj[field.name] = field.compute(groupObj);
            updated[section.group] = groupObj;
          }
        });
      }

      // Tableaux
      if (section.array && section.fields) {
        const arr = updated[section.name] || [];
        updated[section.name] = arr.map((item: any) => {
          let newItem = { ...item };
          section.fields.forEach((field: any) => {
            if (field.compute) newItem[field.name] = field.compute(newItem);
          });
          return newItem;
        });
      }
    });

    return updated;
  };


  const updateField = (name: string, value: any) => {
    setFormData((prev: any) => recomputeFields({ ...prev, [name]: value }));
  };

  const updateArrayItem = (arrayName: string, index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const updatedArray = [...(prev[arrayName] || [])];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      return recomputeFields({ ...prev, [arrayName]: updatedArray });
    });
  };

  const addArrayItem = (arrayName: string, defaultItem: any) => {
    setFormData((prev: any) => {
      const updated = {
        ...prev,
        [arrayName]: [...(prev[arrayName] || []), defaultItem],
      };
      return recomputeFields(updated);
    });
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    setFormData((prev: any) => {
      const updatedArray = [...(prev[arrayName] || [])];
      updatedArray.splice(index, 1);

      return recomputeFields({
        ...prev,
        [arrayName]: updatedArray,
      });
    });
  };
  

  return (
    <form
      id="form"
      className="space-y-10"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      {schema?.map((section: any, index: number) => (
        <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

          {/* TITRE PREMIUM */}
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
            {section.section}
          </h2>

          {/* CHAMPS SIMPLES */}
          {!section.array && !section.group && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields?.map((field: any, i: number) => (
                <Field
                  key={i}
                  field={field}
                  value={formData[field.name] || ""}
                  onChange={(value: any) => updateField(field.name, value)}
                />
              ))}
            </div>
          )}

          {/* TABLEAU (Prestations) */}
          {section.array && (
            <div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <table className="w-full text-sm mb-4">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      {section.fields.map((f: any, i: number) => (
                        <th key={i} className="p-2 text-left">{f.label}</th>
                      ))}
                      <th className="p-2 text-right"></th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {(formData[section.name] || []).map((item: any, i: number) => (
                      <tr key={i}>
                        {section.fields.map((field: any, j: number) => (
                          <td key={j} className="p-2">
                            <Field
                              field={field}
                              value={item[field.name]}
                              onChange={(value: any) =>
                                updateArrayItem(section.name, i, field.name, value)
                              }
                            />
                          </td>
                        ))}

                        <td className="p-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeArrayItem(section.name, i)}
                            className="p-1 rounded hover:bg-red-50 transition"
                          >
                            <Trash2
                              size={18}
                              className="text-gray-400 hover:text-red-600 transition"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() =>
                  addArrayItem(
                    section.name,
                    Object.fromEntries(section.fields.map((f: any) => [f.name, ""]))
                  )
                }
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
              >
                Ajouter une ligne
              </button>
            </div>
          )}

        </div>
      ))}
    </form>
  );
}
