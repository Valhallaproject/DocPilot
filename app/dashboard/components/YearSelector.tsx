"use client";

export default function YearSelector({
  years,
  selectedYear,
}: {
  years: number[];
  selectedYear: number;
}) {
  return (
    <select
      className="border border-gray-300 rounded px-2 py-1 text-sm"
      value={selectedYear}
      onChange={(e) => {
        const year = e.target.value;
        window.location.href = `/dashboard?year=${year}`;
      }}
    >
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  );
}
