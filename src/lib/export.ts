/**
 * Universal Data Export Utility for Apex UMS
 * Supports CSV generation with sanitization and JSON export
 */

export function exportToCSV<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
) {
  if (!rows || rows.length === 0) {
    return;
  }

  const columnKeys = headers ? headers.map((h) => h.key) : (Object.keys(rows[0]) as (keyof T)[]);
  const headerLabels = headers ? headers.map((h) => h.label) : (columnKeys as string[]);

  // CSV escape helper preventing CSV formula injection
  const escapeCell = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    let str = String(val);
    // Escape quotes
    str = str.replace(/"/g, '""');
    // Prevent formula injection
    if (/^[=+\-@]/.test(str)) {
      str = `'${str}`;
    }
    return `"${str}"`;
  };

  const csvRows: string[] = [];
  csvRows.push(headerLabels.map((l) => `"${l}"`).join(","));

  for (const row of rows) {
    const values = columnKeys.map((key) => escapeCell(row[key]));
    csvRows.push(values.join(","));
  }

  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", csvContent);
  link.setAttribute("download", `${filename}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON<T>(filename: string, data: T) {
  const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", jsonContent);
  link.setAttribute("download", `${filename}_${timestamp}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
