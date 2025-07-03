"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "~/trpc/react";

export function ApplicationsOverTime() {
  const { data: applications, isLoading } = api.application.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="bg-surface border-border h-80 w-full rounded-lg p-4 shadow">
        <h2 className="text-primary mb-2 text-lg font-semibold">
          Applications Over Time
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
          Applications Over Time
        </h2>
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted">No applications yet</div>
        </div>
      </div>
    );
  }

  // Group applications by week based on appliedDate
  const applicationsByWeek: Record<string, number> = applications.reduce(
    (acc, app) => {
      if (!app.appliedDate) return acc;

      const date = new Date(app.appliedDate);
      // Get the start of the week (Monday)
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const weekKey = startOfWeek.toISOString().split("T")[0]!;

      acc[weekKey] = (acc[weekKey] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Convert to chart data format and sort by date
  const chartData = Object.entries(applicationsByWeek)
    .map(([week, count]) => ({
      date: new Date(week).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      }),
      applications: count,
      fullDate: week,
    }))
    .sort(
      (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime(),
    )
    .slice(-8); // Show last 8 weeks

  return (
    <div className="bg-surface border-border h-80 w-full rounded-lg p-4 shadow">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-primary text-lg font-semibold">
          Applications Over Time
        </h2>
        <div className="text-muted text-sm">Weekly totals</div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 0, left: -30, bottom: 5 }}
          >
            <XAxis dataKey="date" stroke="var(--color-muted)" />
            <YAxis stroke="var(--color-muted)" />
            <Tooltip
              formatter={(value, _name) => [
                `${String(value)} applications`,
                "Applications",
              ]}
              labelFormatter={(label) => `Week of ${label}`}
            />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={{ fill: "var(--color-accent)", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
