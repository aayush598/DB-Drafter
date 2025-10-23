import { Table, GeneratedSchema } from "@/types"; 

export function downloadFile(content: string, filename: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadMultipleSchemas(
  schemas: Record<string, GeneratedSchema>,
  tables: Array<Table>
): void {
  const sortedTables = [...tables].sort(
    (a, b) => a.sequence_order - b.sequence_order
  );
  
  let allSchemas = "";

  sortedTables.forEach((table) => {
    if (schemas[table.table_name]) {
      allSchemas += `\n-- Table: ${table.table_name}\n`;
      allSchemas += `-- ${"-".repeat(60)}\n\n`;
      allSchemas += schemas[table.table_name].sql_schema;
      allSchemas += "\n\n";
    }
  });

  downloadFile(allSchemas, "complete_database_schema.sql");
}