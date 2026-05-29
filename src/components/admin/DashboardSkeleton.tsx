// ─── Full-page skeleton (single Suspense boundary) ──────────
export default function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <MetricsSkeleton />
      <ChartsSkeleton />
      <HealthActivitySkeleton />
      <ProjectsSkeleton />
    </div>
  );
}

// ─── Section-level mini-skeletons (individual Suspense boundaries) ───

export function MetricsSkeleton() {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-slate-200 rounded-lg mb-3" />
          <div className="h-3 bg-slate-200 rounded w-20 mb-2" />
          <div className="h-7 bg-slate-200 rounded w-16 mb-2" />
          <div className="h-5 bg-slate-200 rounded w-14" />
        </div>
      ))}
    </div>
  );
}

export function ChartsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-slate-200 rounded-lg" />
            <div>
              <div className="h-4 bg-slate-200 rounded w-28 mb-1" />
              <div className="h-3 bg-slate-200 rounded w-20" />
            </div>
          </div>
          <div className="h-64 bg-slate-100 rounded-lg" />
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-slate-200 rounded-lg" />
            <div>
              <div className="h-4 bg-slate-200 rounded w-24 mb-1" />
              <div className="h-3 bg-slate-200 rounded w-16" />
            </div>
          </div>
          <div className="h-48 bg-slate-100 rounded-full w-40 mx-auto mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-200 rounded-full" />
                  <div className="h-3 bg-slate-200 rounded w-20" />
                </div>
                <div className="h-3 bg-slate-200 rounded w-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-slate-200 rounded-lg" />
          <div>
            <div className="h-4 bg-slate-200 rounded w-24 mb-1" />
            <div className="h-3 bg-slate-200 rounded w-36" />
          </div>
        </div>
        <div className="h-52 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}

export function HealthActivitySkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 animate-pulse">
      <div className="lg:col-span-2 bg-slate-200 rounded-lg p-6 h-40" />
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden h-[300px] lg:h-auto">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="h-4 bg-slate-200 rounded w-24" />
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-6 h-6 bg-slate-200 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-5 bg-slate-200 rounded w-32 mb-1" />
          <div className="h-3 bg-slate-200 rounded w-44" />
        </div>
        <div className="h-10 bg-slate-200 rounded w-36" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-sm">
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-48" />
              <div className="h-3 bg-slate-200 rounded w-64" />
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-slate-200 rounded" />
              <div className="w-8 h-8 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
