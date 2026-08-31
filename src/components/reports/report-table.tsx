import { BorderedLayout } from "@/components/shared/bordered-layout";

interface ReportTableColumn<T> {
  label: string;
  accessor: keyof T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format?: (value: any, row: T) => React.ReactNode;
}

interface ReportTableProps<T> {
  title: string;
  data: T[];
  columns: ReportTableColumn<T>[];
  emptyMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReportTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  emptyMessage = "No data for this period.",
}: ReportTableProps<T>) {
  return (
    <BorderedLayout>
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 pb-4 overflow-x-auto">
        {data.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">{emptyMessage}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {columns.map((col) => (
                  <th
                    key={String(col.accessor)}
                    className="text-left py-2 px-2 font-medium text-gray-500 uppercase text-xs">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  {columns.map((col) => (
                    <td
                      key={String(col.accessor)}
                      className="py-2 px-2 text-gray-700">
                      {col.format
                        ? col.format(row[col.accessor], row)
                        : String(row[col.accessor] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </BorderedLayout>
  );
}
