"use client";

import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Printer, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
} from "@/components/ui";
import { useSales, useReverseSale, printSaleReceipt } from "@/hooks/use-sales";
import { Sale } from "@/types/sales";
import { CustomDataTable } from "@/components/shared/data-table";
import { formatMNumber } from "@/lib/currency";
import { ClientOnly } from "@/components/shared/client-only";

export default function SalesHistoryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const { data, isLoading, isFetching } = useSales({
    page,
    search: search || undefined,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<Sale, any>[]>(
    () => [
      {
        accessorKey: "transaction_number",
        header: "Transaction",
        cell: ({ row }) => (
          <span className="flex items-center gap-2 font-medium text-gray-900 whitespace-nowrap">
            <span
              className={`${
                row.original.is_reversed ? "text-yellow-500" : ""
              }`}>
              {row.original.transaction_number || "—"}
            </span>
            <span className="text-xs text-yellow-500 italic">
              {row.original.is_reversed ? "Reversed" : ""}
            </span>
          </span>
        ),
      },

      {
        accessorKey: "shop_name",
        header: "Shop",
        cell: ({ row }) => row.original.shop_name || "—",
      },

      {
        accessorKey: "sales_person_username",
        header: "Sales Person",
        cell: ({ row }) => row.original.sales_person_username || "—",
      },

      {
        accessorKey: "customer_name",
        header: "Customer Name",
        cell: ({ row }) => row.original.customer_name || "—",
      },

      {
        accessorKey: "customer_phone",
        header: "Phone",
        cell: ({ row }) => row.original.customer_phone || "—",
      },

      {
        accessorKey: "product_name",
        header: "Product Name",
        cell: ({ row }) => {
          const items = row.original.items || [];

          if (!items.length) {
            return "—";
          }

          return (
            <div className="min-w-[180px] max-w-[260px]">
              <div className="space-y-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="text-sm text-gray-700 truncate"
                    title={item.product_name}>
                    {item.product_name}
                  </div>
                ))}
              </div>
            </div>
          );
        },
      },

      {
        id: "quantity",
        header: "Quantity",
        cell: ({ row }) => {
          const items = row.original.items || [];

          return (
            <span className="whitespace-nowrap">
              {items.reduce((total, item) => total + Number(item.quantity), 0)}
            </span>
          );
        },
      },

      {
        accessorKey: "payment_method",
        header: "Payment Mode",
        cell: ({ row }) => {
          const paymentMethod = row.original.payment_method;

          const labels: Record<string, string> = {
            CASH: "Cash",
            CARD: "Card",
            MOBILE_MONEY: "Mobile Money",
            BANK_TRANSFER: "Bank Transfer",
          };

          return labels[paymentMethod] || paymentMethod || "—";
        },
      },

      {
        accessorKey: "total_amount",
        header: "Total",
        cell: ({ row }) => (
          <span className="font-semibold whitespace-nowrap">
            {formatMNumber(Number(row.original.total_amount))}
          </span>
        ),
      },

      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
      },

      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const sale = row.original;

          return (
            <SaleActions sale={sale} onView={() => setSelectedSale(sale)} />
          );
        },
      },
    ],
    []
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-4 w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales History</h1>
        <p className="text-sm text-gray-500">View and manage recorded sales</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="w-full sm:max-w-sm">
          <Input
            placeholder="Search sales..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <CustomDataTable
        data={data?.results ?? []}
        columns={columns}
        globalFilter=""
        isFetching={isLoading || isFetching}
        getRowId={(row: Sale) => String(row.id)}
      />

      {data && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing {data.results.length} of {data.count} sales
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!data.previous || page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}>
              Previous
            </Button>

            <span className="text-sm text-gray-600 px-2">Page {page}</span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!data.next}
              onClick={() => setPage((current) => current + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      <SaleDetailsDialog
        sale={selectedSale}
        open={!!selectedSale}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSale(null);
          }
        }}
      />
    </div>
  );
}

interface SaleActionsProps {
  sale: Sale;
  onView: () => void;
}

function SaleActions({ sale, onView }: SaleActionsProps) {
  const [reverseDialogOpen, setReverseDialogOpen] = useState(false);
  const [reason, setReason] = useState("");

  const reverseSale = useReverseSale();

  const handleReverse = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for the reversal");
      return;
    }

    try {
      await reverseSale.mutateAsync({
        saleId: sale.id,
        reason: reason.trim(),
      });

      setReason("");
      setReverseDialogOpen(false);
    } catch {
      // Error toast is handled inside useReverseSale.
    }
  };

  return (
    <>
      <ClientOnly
        fallback={
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
          </div>
        }>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className="h-8 w-8 flex items-center justify-center cursor-pointer rounded-md hover:bg-gray-100">
              <MoreHorizontal size={16} />
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={onView}>
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => printSaleReceipt(sale.id)}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </DropdownMenuItem>

            {!sale.is_reversed && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setReverseDialogOpen(true)}
                  className="text-red-500 focus:text-red-500">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reverse Sale
                </DropdownMenuItem>
              </>
            )}

            {sale.is_reversed && (
              <DropdownMenuItem disabled>
                <X className="w-4 h-4 mr-2" />
                Already Reversed
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </ClientOnly>

      <Dialog
        open={reverseDialogOpen}
        onOpenChange={(open) => {
          setReverseDialogOpen(open);

          if (!open) {
            setReason("");
          }
        }}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reverse Sale?</DialogTitle>

            <DialogDescription>
              This will restore the sold items to the shop inventory. The
              original sale record will remain unchanged.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor={`reverse-reason-${sale.id}`}>
              Reason for reversal
            </Label>

            <Input
              id={`reverse-reason-${sale.id}`}
              placeholder="Enter reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={reverseSale.isPending}
            />
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReverseDialogOpen(false)}
              disabled={reverseSale.isPending}>
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleReverse}
              disabled={reverseSale.isPending}
              className="bg-red-500 hover:bg-red-600 text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              {reverseSale.isPending ? "Reversing..." : "Reverse Sale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface SaleDetailsDialogProps {
  sale: Sale | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SaleDetailsDialog({
  sale,
  open,
  onOpenChange,
}: SaleDetailsDialogProps) {
  if (!sale) return null;

  const paymentLabels: Record<string, string> = {
    CASH: "Cash",
    CARD: "Card",
    MOBILE_MONEY: "Mobile Money",
    BANK_TRANSFER: "Bank Transfer",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sale Details</DialogTitle>

          <DialogDescription>
            Transaction details are displayed as read-only information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SaleDetailField
              label="Transaction Number"
              value={sale.transaction_number}
            />

            <SaleDetailField label="Shop" value={sale.shop_name} />

            <SaleDetailField
              label="Sales Person"
              value={sale.sales_person_username}
            />

            <SaleDetailField
              label="Payment Method"
              value={paymentLabels[sale.payment_method] || sale.payment_method}
            />

            <SaleDetailField label="Customer Name" value={sale.customer_name} />

            <SaleDetailField
              label="Customer Phone"
              value={sale.customer_phone}
            />

            <SaleDetailField
              label="Total Amount"
              value={formatMNumber(Number(sale.total_amount))}
            />

            <SaleDetailField
              label="Created At"
              value={
                sale.created_at
                  ? new Date(sale.created_at).toLocaleString()
                  : "—"
              }
            />

            <SaleDetailField
              label="Status"
              value={sale.is_reversed ? "Reversed" : "Completed"}
            />

            {sale.is_reversed && (
              <>
                <SaleDetailField
                  label="Reversed At"
                  value={
                    sale.reversed_at
                      ? new Date(sale.reversed_at).toLocaleString()
                      : "—"
                  }
                />

                <SaleDetailField
                  label="Reversed By"
                  value={sale.reversed_by_username || "—"}
                />

                <div className="sm:col-span-2">
                  <SaleDetailField
                    label="Reversal Reason"
                    value={sale.reversal_reason || "—"}
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900">Items</h3>
              <p className="text-sm text-gray-500">
                {sale.items.length} product line
                {sale.items.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {sale.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 text-sm">
                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-500">Product</p>
                      <p className="font-medium text-gray-900">
                        {item.product_name || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-medium text-gray-900">
                        {item.quantity}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Subtotal</p>
                      <p className="font-medium text-gray-900">
                        {formatMNumber(Number(item.subtotal))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SaleDetailFieldProps {
  label: string;
  value?: string | number | null;
}

function SaleDetailField({ label, value }: SaleDetailFieldProps) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900 break-words">
        {value || "—"}
      </p>
    </div>
  );
}
