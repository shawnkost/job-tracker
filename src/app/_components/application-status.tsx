"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { api } from "~/trpc/react";

const STATUS_COLORS: Record<string, string> = {
  applied: "var(--color-link)",
  phone_screen: "var(--color-warning)",
  technical: "var(--color-accent)",
  final_round: "var(--color-muted)",
  offer: "var(--color-accent)",
  rejected: "var(--color-rejected)",
};

const STATUS_LABELS: Record<string, string> = {
  applied: "Applied",
  phone_screen: "Phone Screen",
  technical: "Technical",
  final_round: "Final Round",
  offer: "Offer",
  rejected: "Rejected",
};

export function ApplicationStatus() {
  const { data: applications, isLoading } = api.application.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="bg-surface border-border h-80 w-full rounded-lg p-4 shadow">
        <h2 className="text-primary mb-2 text-lg font-semibold">
          Application Status
        </h2>
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted">Loading...</div>
        </div>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-surface border-border h-80 w-full rounded-lg p-4 shadow">
        <h2 className="text-primary mb-2 text-lg font-semibold">
          Application Status
        </h2>
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted">No applications yet</div>
        </div>
      </div>
    );
  }

  // Count applications by status
  const statusCounts = applications.reduce(
    (acc, app) => {
      const status = app.status ?? "applied";
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Convert to chart data format
  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status] ?? status,
    value: count,
    status: status,
  }));

  return (
    <div className="bg-surface border-border h-80 w-full rounded-lg p-4 shadow">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-primary text-lg font-semibold">
          Application Status
        </h2>
        <div className="text-muted text-sm">Total: {applications.length}</div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 5, right: 0, left: -30, bottom: 5 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={70}
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.status] ?? "var(--color-muted)"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${String(value)} applications`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
