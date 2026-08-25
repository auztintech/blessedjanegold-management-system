"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui";

interface CustomDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  globalFilter?: string;
  isFetching?: boolean;
  onSelectionChange?: (rows: TData[]) => void;
  getRowId?: (row: TData, index: number) => string;
}

export function CustomDataTable<TData>({
  data,
  columns,
  globalFilter = "",
  isFetching = false,
  onSelectionChange,
  getRowId,
}: CustomDataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [filterValue, setFilterValue] = React.useState(globalFilter);
  const prevSelectionRef = React.useRef<TData[]>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, rowSelection, globalFilter: filterValue },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, _columnId, filter) => {
      if (!filter) return true;
      return row.getAllCells().some((cell) =>
        String(cell.getValue() ?? "")
          .toLowerCase()
          .includes(String(filter).toLowerCase())
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
  });

  React.useEffect(() => {
    setFilterValue(globalFilter);
  }, [globalFilter]);

  React.useEffect(() => {
    if (!onSelectionChange) return;
    const selectedRows = table
      .getSelectedRowModel()
      .flatRows.map((r) => r.original);
    if (
      JSON.stringify(selectedRows) !== JSON.stringify(prevSelectionRef.current)
    ) {
      prevSelectionRef.current = selectedRows;
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  return (
    <div className="w-full flex flex-col">
      <div className="rounded-md border border-gray-200 overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-orange-50/40">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12 px-3 text-left align-middle uppercase font-medium text-xs text-gray-600">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, ci) => (
                    <TableCell key={ci}>
                      <div className="h-6 w-full bg-gray-200 animate-pulse rounded-sm" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-400">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
