"use client";
import {
  FunnelChart,
  Funnel,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts";
import { api } from "~/trpc/react";

interface FunnelData {
  name: string;
  value: number;
  fill: string;
}

export function ApplicationFunnel() {
  const { data: applications, isLoading } = api.application.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="bg-surface border-border h-80 w-full rounded-lg p-4 shadow">
        <h2 className="text-primary mb-2 text-lg font-semibold">
          Application Funnel
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
          Application Funnel
        </h2>
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted">No applications yet</div>
        </div>
      </div>
    );
  }

  // Calculate stage counts based on date fields
  const stageStats = applications.reduce(
    (acc, app) => {
      // Applied: Has appliedDate or createdAt
      if (app.appliedDate || app.createdAt) {
        acc.applied++;
      }
      // Phone Screen: Has responseDate OR status is phone_screen+
      if (
        (app.responseDate && app.status !== "rejected") ||
        app.status === "phone_screen" ||
        app.status === "technical" ||
        app.status === "final_round" ||
        app.status === "offer"
      ) {
        acc.phoneScreen++;
      }

      // Technical: Has firstInterviewDate and technical+ status
      if (
        app.firstInterviewDate &&
        (app.status === "technical" ||
          app.status === "final_round" ||
          app.status === "offer")
      ) {
        acc.technical++;
      }

      // Final Round: Has final_round or offer status
      if (app.status === "final_round" || app.status === "offer") {
        acc.finalRound++;
      }

      // Offer: Has offerDate or offer status
      if (app.offerDate || app.status === "offer") {
        acc.offer++;
      }

      // Track rejections
      if (app.status === "rejected" || app.rejectionDate) {
        acc.rejected++;
      }

      return acc;
    },
    {
      applied: 0,
      phoneScreen: 0,
      technical: 0,
      finalRound: 0,
      offer: 0,
      rejected: 0,
    },
  );

  const funnelData: FunnelData[] = [
    {
      name: "Applied",
      value: stageStats.applied,
      fill: "var(--color-blue)",
    },
    {
      name: "Phone Screen",
      value: stageStats.phoneScreen,
      fill: "var(--color-accent)",
    },
    {
      name: "Technical",
      value: stageStats.technical,
      fill: "var(--color-green)",
    },
    {
      name: "Final Round",
      value: stageStats.finalRound,
      fill: "var(--color-orange)",
    },
    {
      name: "Offer",
      value: stageStats.offer,
      fill: "var(--color-purple)",
    },
  ];

  // Calculate conversion rates
  const getConversionRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round((current / previous) * 100);
  };

  const totalApplications = stageStats.applied;
  const interviewRate = getConversionRate(
    stageStats.phoneScreen,
    totalApplications,
  );

  return (
    <div className="bg-surface border-border h-80 w-full rounded-lg p-4 shadow">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-primary text-lg font-semibold">
          Application Funnel
        </h2>
        <div className="text-muted text-sm">
          {interviewRate}% interview rate • {stageStats.rejected} rejected
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip
              formatter={(value, name) => [
                `${String(value)} applications`,
                String(name),
              ]}
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
              }}
            />
            <Funnel dataKey="value" data={funnelData} isAnimationActive={true}>
              <LabelList position="center" fill="var(--color-primary)" />
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
