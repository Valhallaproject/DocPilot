export default function Field({ field, value, onChange }: any) {
  const isReadOnly = field.readOnly || field.compute;

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{field.label}</label>

      {/* Champ texte */}
      {field.type === "text" && (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          readOnly={isReadOnly}
          className={`w-full border rounded px-3 py-2 ${
            isReadOnly ? "bg-gray-100 text-gray-600" : ""
          }`}
        />
      )}

      {/* Champ number */}
      {field.type === "number" && (
        <input
          type="number"
          value={value || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          readOnly={isReadOnly}
          className={`w-full border rounded px-3 py-2 ${
            isReadOnly ? "bg-gray-100 text-gray-600" : ""
          }`}
        />
      )}

      {/* Champ textarea */}
      {field.type === "textarea" && (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          readOnly={isReadOnly}
          className={`w-full border rounded px-3 py-2 ${
            isReadOnly ? "bg-gray-100 text-gray-600" : ""
          }`}
        />
      )}

      {/* Champ date */}
      {field.type === "date" && (
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          readOnly={isReadOnly}
          className={`w-full border rounded px-3 py-2 ${
            isReadOnly ? "bg-gray-100 text-gray-600" : ""
          }`}
        />
      )}

      {/* Champ email */}
      {field.type === "email" && (
        <input
          type="email"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          readOnly={isReadOnly}
          className={`w-full border rounded px-3 py-2 ${
            isReadOnly ? "bg-gray-100 text-gray-600" : ""
          }`}
        />
      )}

    </div>
  );
}
