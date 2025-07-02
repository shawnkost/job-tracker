"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import type { Application } from "@prisma/client";
import { EditApplicationDialog } from "./edit-application";

type SortDirection = "asc" | "desc";

type ColumnConfig = {
  label: string;
  field: keyof Application;
  sortable: boolean;
  type: "string" | "date" | "number";
};

const columns: ColumnConfig[] = [
  { label: "Company", field: "company", sortable: true, type: "string" },
  { label: "Position", field: "position", sortable: true, type: "string" },
  { label: "Status", field: "status", sortable: true, type: "string" },
  { label: "Applied Date", field: "appliedDate", sortable: true, type: "date" },
  { label: "Salary", field: "salaryMin", sortable: true, type: "number" },
  { label: "Location", field: "location", sortable: true, type: "string" },
  { label: "Actions", field: "id", sortable: false, type: "string" },
];

export function JobTable() {
  const [sortColumn, setSortColumn] =
    useState<keyof Application>("appliedDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);

  const { data: jobData, isLoading, error } = api.application.getAll.useQuery();

  const sortedApplications = useMemo(() => {
    if (!jobData) return [];

    const sorted = [...jobData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === "asc" ? -1 : 1;
      if (bValue == null) return sortDirection === "asc" ? 1 : -1;

      // Find column config to determine sort type
      const columnConfig = columns.find((col) => col.field === sortColumn);
      const sortType = columnConfig?.type ?? "string";

      let comparison = 0;

      if (sortType === "date") {
        const aTime = new Date(aValue as string).getTime();
        const bTime = new Date(bValue as string).getTime();
        comparison = aTime - bTime;
      } else if (sortType === "number") {
        comparison = (aValue as number) - (bValue as number);
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [jobData, sortColumn, sortDirection]);

  function handleSort(field: keyof Application) {
    const newDirection: SortDirection =
      sortColumn === field && sortDirection === "asc" ? "desc" : "asc";

    setSortColumn(field);
    setSortDirection(newDirection);
  }

  if (error) return <div>Error loading jobs</div>;

  return (
    <section className="mt-4">
      <div className="border-border bg-surface overflow-x-auto rounded-lg border shadow-md">
        <table className="text-primary w-full border text-left">
          <thead className="bg-surface border-border border-b">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.field}
                  className={`px-6 py-3 font-medium ${column.sortable ? "hover:text-accent cursor-pointer" : ""} transition-colors duration-200`}
                  onClick={
                    column.sortable ? () => handleSort(column.field) : undefined
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <span className="text-muted">
                        {sortColumn === column.field
                          ? sortDirection === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody id="app-table-body">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="bg-muted h-4 w-3/4 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              : sortedApplications?.map((application) => (
                  <tr key={application.id}>
                    <td className="px-6 py-4">{application.company}</td>
                    <td className="px-6 py-4">{application.position}</td>
                    <td className="px-6 py-4">
                      {application.status
                        ? application.status.charAt(0).toUpperCase() +
                          application.status.slice(1).toLowerCase()
                        : ""}
                    </td>
                    <td className="px-6 py-4">
                      {application.appliedDate
                        ? application.appliedDate.toLocaleDateString("en-US", {
                            timeZone: "UTC",
                          })
                        : ""}
                    </td>
                    <td className="px-6 py-4">
                      {application.salaryMin || application.salaryMax
                        ? `$${application.salaryMin?.toLocaleString() ?? "?"} - $${application.salaryMax?.toLocaleString() ?? "?"}`
                        : ""}
                    </td>
                    <td className="px-6 py-4">{application.location}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setEditingApplication(application)}
                        className="text-accent hover:text-accent/80 cursor-pointer underline transition-colors duration-200"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {editingApplication && (
        <EditApplicationDialog
          application={editingApplication}
          open={editingApplication !== null}
          onClose={() => setEditingApplication(null)}
        />
      )}
    </section>
  );
}
