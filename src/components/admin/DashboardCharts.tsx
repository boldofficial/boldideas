'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity, BarChart3, TrendingUp } from 'lucide-react';

interface DashboardChartsProps {
  revenueTrend: { month: string; revenue: number }[];
  pipeline: { status: string; count: number; value: number }[];
  taskTrend: { date: string; completed: number; created: number }[];
}

function money(value: number) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-slate-200 bg-white p-3 text-sm shadow-lg">
      <p className="mb-1 font-semibold text-brand-navy">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-medium text-slate-600">
          {entry.name}: {entry.name === 'Revenue' ? money(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}

export default function DashboardCharts({ revenueTrend, pipeline, taskTrend }: DashboardChartsProps) {
  const visiblePipeline = pipeline.filter(item => item.count > 0 || item.value > 0);
  const maxPipelineValue = Math.max(...visiblePipeline.map(item => item.value), 1);

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-slate-50 text-brand-navy">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-navy">Revenue Trend</h3>
              <p className="text-xs text-slate-500">Paid invoices over the last 6 months</p>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-400">Monthly</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrend} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8A96E" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#C8A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => money(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#0A1128"
                fill="url(#revenueArea)"
                strokeWidth={2}
                dot={{ fill: '#C8A96E', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-slate-50 text-brand-navy">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Pipeline Position</h3>
            <p className="text-xs text-slate-500">Lead count and estimated value by stage</p>
          </div>
        </div>

        <div className="space-y-4">
          {visiblePipeline.length === 0 ? (
            <div className="border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No active pipeline yet.
            </div>
          ) : (
            visiblePipeline.map(item => (
              <div key={item.status}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium capitalize text-slate-700">{item.status}</span>
                  <span className="text-xs font-semibold text-brand-navy">{item.count} · {money(item.value)}</span>
                </div>
                <div className="h-2 bg-slate-100">
                  <div
                    className="h-full bg-brand-gold"
                    style={{ width: `${Math.max((item.value / maxPipelineValue) * 100, item.count > 0 ? 8 : 0)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-slate-50 text-brand-navy">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-brand-navy">Delivery Throughput</h3>
            <p className="text-xs text-slate-500">Tasks created vs completed over the last 7 days</p>
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={taskTrend} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="created" name="Created" fill="#94a3b8" radius={[2, 2, 0, 0]} barSize={22} />
              <Bar dataKey="completed" name="Completed" fill="#0A1128" radius={[2, 2, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
