"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "~/trpc/react";

function createSalaryBins(
  salaries: number[],
): { range: string; count: number; minValue: number }[] {
  if (salaries.length === 0) return [];

  const min = Math.min(...salaries);
  const max = Math.max(...salaries);
  const binSize = 20000; // $20k bins
  const binCount = Math.ceil((max - min) / binSize) + 1;

  const bins: { range: string; count: number; minValue: number }[] = [];

  for (let i = 0; i < binCount; i++) {
    const binMin = Math.floor(min / binSize) * binSize + i * binSize;
    const binMax = binMin + binSize - 1;

    const count = salaries.filter(
      (salary) => salary >= binMin && salary < binMin + binSize,
    ).length;

    if (count > 0) {
      bins.push({
        range: `$${(binMin / 1000).toFixed(0)}k-${((binMax + 1) / 1000).toFixed(0)}k`,
        count,
        minValue: binMin,
      });
    }
  }

  return bins.sort((a, b) => a.minValue - b.minValue);
}

export function SalaryHistogram() {
  const { data: applications, isLoading } = api.application.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="bg-surface border-border h-80 w-full rounded-lg p-4 shadow">
        <h2 className="text-primary mb-2 text-lg font-semibold">
          Salary Distribution
        </h2>
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted">Loading...</div>
        </div>
      </div>
    );
  }

  if (!applications) {
    return (
      <div className="bg-surface border-border h-80 w-full rounded-lg p-4 shadow">
        <h2 className="text-primary mb-2 text-lg font-semibold">
          Salary Distribution
        </h2>
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted">No data available</div>
        </div>
      </div>
    );
  }

  const salaries = applications
    .flatMap((app) => [app.salaryMin, app.salaryMax])
    .filter(
      (salary): salary is number => salary !== null && salary !== undefined,
    );

  if (salaries.length === 0) {
    return (
      <div className="bg-surface border-border h-80 w-full rounded-lg p-4 shadow">
        <h2 className="text-primary mb-2 text-lg font-semibold">
          Salary Distribution
        </h2>
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted">No salary data available</div>
        </div>
      </div>
    );
  }

  const binData = createSalaryBins(salaries);
  const avgSalary =
    salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length;

  return (
    <div className="bg-surface border-border h-80 w-full rounded-lg p-4 shadow">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-primary text-lg font-semibold">
          Salary Distribution
        </h2>
        <div className="text-muted text-sm">
          Avg: ${(avgSalary / 1000).toFixed(0)}k | Total: {salaries.length}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={binData}
            margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
          >
            <XAxis
              dataKey="range"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, _name) => [
                `${String(value)} applications`,
                "Count",
              ]}
              labelFormatter={(label) => `Salary Range: ${label}`}
            />
            <Bar
              dataKey="count"
              fill="var(--color-accent)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
