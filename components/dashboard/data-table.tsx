"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getERFColor, getERFStatusCode } from "@/lib/mock-data";

interface DataRow {
  date: string;
  depth: number;
  length: number;
  erf: number;
  status: "OK" | "ATTENTION" | "CRITICAL";
}

const mockTableData: DataRow[] = [
  {
    date: "2026-02-27",
    depth: 8.2,
    length: 125.4,
    erf: 0.75,
    status: "ATTENTION",
  },
  {
    date: "2026-02-01",
    depth: 7.8,
    length: 120.1,
    erf: 0.76,
    status: "ATTENTION",
  },
  {
    date: "2026-01-15",
    depth: 7.5,
    length: 118.3,
    erf: 0.77,
    status: "ATTENTION",
  },
  {
    date: "2026-01-01",
    depth: 7.2,
    length: 115.0,
    erf: 0.78,
    status: "ATTENTION",
  },
  {
    date: "2025-12-01",
    depth: 6.8,
    length: 110.2,
    erf: 0.79,
    status: "ATTENTION",
  },
  { date: "2025-11-05", depth: 6.3, length: 105.8, erf: 0.82, status: "OK" },
  { date: "2025-10-10", depth: 5.9, length: 100.4, erf: 0.84, status: "OK" },
  { date: "2025-09-20", depth: 5.5, length: 96.7, erf: 0.86, status: "OK" },
  { date: "2025-08-15", depth: 5.1, length: 91.2, erf: 0.88, status: "OK" },
  { date: "2025-07-01", depth: 4.6, length: 85.0, erf: 0.91, status: "OK" },
];

const statusConfig = {
  OK: {
    label: "Seguro",
    variant: "default" as const,
    className:
      "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 hover:bg-[#10B981]/20",
  },
  ATTENTION: {
    label: "Atencao",
    variant: "default" as const,
    className:
      "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 hover:bg-[#F59E0B]/20",
  },
  CRITICAL: {
    label: "Critico",
    variant: "default" as const,
    className:
      "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20 hover:bg-[#EF4444]/20",
  },
};

type SortKey = "date" | "depth" | "length" | "erf";
type FilterStatus = "ALL" | "OK" | "ATTENTION" | "CRITICAL";

export function DataTable() {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  const sortedData = useMemo(() => {
    let filtered = mockTableData;
    if (filter !== "ALL") {
      filtered = mockTableData.filter(
        (d) => getERFStatusCode(d.erf) === filter,
      );
    }
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    });
  }, [sortKey, sortAsc, filter]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  }

  const filters: { label: string; value: FilterStatus; color?: string }[] = [
    { label: "Todos", value: "ALL" },
    { label: "Seguro", value: "OK", color: "#10B981" },
    { label: "Atencao", value: "ATTENTION", color: "#F59E0B" },
    { label: "Critico", value: "CRITICAL", color: "#EF4444" },
  ];

  return (
    <Card
      className="overflow-hidden border-border/50 bg-card animate-fade-in-up"
      style={{ animationDelay: "800ms" }}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Dados Historicos
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground/70">
              Registros de analises anteriores
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {filters.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-7 px-2.5 text-xs",
                  filter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setFilter(f.value)}
              >
                {f.color && (
                  <div
                    className="mr-1 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: f.color }}
                  />
                )}
                {f.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border bg-muted/50">
                {[
                  { key: "date" as SortKey, label: "Data" },
                  { key: "depth" as SortKey, label: "Profundidade (mm)" },
                  { key: "length" as SortKey, label: "Comprimento (mm)" },
                  { key: "erf" as SortKey, label: "ERF" },
                ].map((col) => (
                  <th key={col.key} className="px-4 py-2.5 text-left">
                    <button
                      className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      <ArrowUpDown
                        className={cn(
                          "h-3 w-3",
                          sortKey === col.key && "text-primary",
                        )}
                      />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, i) => {
                const status = getERFStatusCode(row.erf);
                const config = statusConfig[status];
                return (
                  <tr
                    key={row.date}
                    className={cn(
                      "border-b border-border/50 transition-colors hover:bg-muted/30",
                      i % 2 === 1 && "bg-muted/20",
                    )}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-foreground">
                      {new Date(row.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-foreground">
                      {row.depth.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-foreground">
                      {row.length.toFixed(1)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{ color: getERFColor(row.erf) }}
                      >
                        {row.erf.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={config.variant}
                        className={cn(
                          "text-[10px] font-semibold",
                          config.className,
                        )}
                      >
                        {config.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sortedData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="text-sm">Nenhum registro encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
