"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import type { Application } from "@prisma/client";

type JobTableState = {
  applications: Application[];
  sortColumn: string;
  sortDirection: "asc" | "desc";
};

export function JobTable() {
  const [jobs, setJobs] = useState<JobTableState>({
    applications: [],
    sortColumn: "appliedDate",
    sortDirection: "desc",
  });

  const { data: jobData, isLoading, error } = api.application.getAll.useQuery();

  useEffect(() => {
    if (jobData) {
      setJobs({
        applications: jobData,
        sortColumn: "appliedDate",
        sortDirection: "desc",
      });
    }
  }, [jobData]);

  function handleSort(column: string) {
    let newDirection: "asc" | "desc" = "asc";
    if (jobs.sortColumn === column) {
      newDirection = jobs.sortDirection === "asc" ? "desc" : "asc";
    }

    // Create a sorted copy of the applications array
    const sortedApps = [...jobs.applications].sort((a, b) => {
      let aValue = a[column as keyof typeof a];
      let bValue = b[column as keyof typeof b];

      // Handle undefined/null
      if (aValue == null) return newDirection === "asc" ? -1 : 1;
      if (bValue == null) return newDirection === "asc" ? 1 : -1;

      // Handle dates (assuming ISO strings or Date objects)
      if (column.toLowerCase().includes("date")) {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      // Compare numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        return newDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Compare strings
      return newDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    setJobs({
      applications: sortedApps,
      sortColumn: column,
      sortDirection: newDirection,
    });
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading jobs</div>;

  return (
    <section>
      <div className="border-border bg-surface overflow-x-auto rounded-lg border shadow-md">
        <table className="text-primary w-full border text-left">
          <thead className="bg-surface border-border border-b">
            <tr>
              <th
                className="hover:text-accent cursor-pointer px-6 py-3 font-medium transition-colors duration-200"
                onClick={() => handleSort("company")}
              >
                <div className="flex items-center gap-2">
                  Company
                  <span className="text-muted">
                    {jobs.sortColumn === "company"
                      ? jobs.sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </span>
                </div>
              </th>
              <th
                className="hover:text-accent cursor-pointer px-6 py-3 font-medium transition-colors duration-200"
                onClick={() => handleSort("position")}
              >
                <div className="flex items-center gap-2">
                  Position
                  <span className="text-muted">
                    {jobs.sortColumn === "position"
                      ? jobs.sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </span>
                </div>
              </th>
              <th
                className="hover:text-accent cursor-pointer px-6 py-3 font-medium transition-colors duration-200"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  <span className="text-muted">
                    {jobs.sortColumn === "status"
                      ? jobs.sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </span>
                </div>
              </th>
              <th
                className="hover:text-accent cursor-pointer px-6 py-3 font-medium transition-colors duration-200"
                onClick={() => handleSort("appliedDate")}
              >
                <div className="flex items-center gap-2">
                  Date
                  <span className="text-muted">
                    {jobs.sortColumn === "appliedDate"
                      ? jobs.sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </span>
                </div>
              </th>
              <th
                className="hover:text-accent cursor-pointer px-6 py-3 font-medium transition-colors duration-200"
                onClick={() => handleSort("salary")}
              >
                <div className="flex items-center gap-2">
                  Salary
                  <span className="text-muted">
                    {jobs.sortColumn === "salary"
                      ? jobs.sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </span>
                </div>
              </th>
              <th
                className="hover:text-accent cursor-pointer px-6 py-3 font-medium transition-colors duration-200"
                onClick={() => handleSort("location")}
              >
                <div className="flex items-center gap-2">
                  Location
                  <span className="text-muted">
                    {jobs.sortColumn === "location"
                      ? jobs.sortDirection === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody id="app-table-body">
            {jobs.applications?.map((application) => (
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
                    ? new Intl.DateTimeFormat("en-US").format(
                        application.appliedDate,
                      )
                    : ""}
                </td>
                <td className="px-6 py-4">{application.salary}</td>
                <td className="px-6 py-4">{application.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
